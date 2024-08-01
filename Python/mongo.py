

from flask import Flask, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
from pymongo import MongoClient
import requests
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import random
import string

app = Flask(__name__)
CORS(app)

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['RegisterDB']
users_collection = db['users']

def send_reset_email(email, token):
    sender_email = "devoraravitz69@gmail.com"
    sender_password = "pcxx gfxc myyy rhyh"
    receiver_email = email

    message = MIMEMultipart("alternative")
    message["Subject"] = "Password Reset Request"
    message["From"] = sender_email
    message["To"] = receiver_email

    text = f"""
    Hi,
    To reset your password, please use the following token:
    {token}
    """
    part = MIMEText(text, "plain")
    message.attach(part)

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, receiver_email, message.as_string())

def generate_token():
    return ''.join(random.choices(string.ascii_letters + string.digits, k=20))
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if email is None:
        return jsonify({"error": "Email is required"}), 400

    if password is None:
        return jsonify({"error": "Password is required"}), 400

    hashed_password = generate_password_hash(password)

    # Check if user already exists
    existing_user = users_collection.find_one({"email": email})
    if existing_user:
        if existing_user.get('password') == '':
            # Update password if it is empty
            users_collection.update_one({"email": email}, {"$set": {"password": hashed_password}})
            return jsonify({"message": "Password updated successfully", "email": email}), 200
        else:
            return jsonify({"error": "User already exists"}), 400

    # Store user in MongoDB
    user = {
        "email": email,
        "password": hashed_password,
        "google_id": ""
    }
    users_collection.insert_one(user)

    return jsonify({"message": "User registered successfully", "email": email}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if email is None or password is None:
        return jsonify({"error": "Email and password are required"}), 400

    user = users_collection.find_one({"email": email})
    if user:
        if check_password_hash(user['password'], password):
            return jsonify({"message": "Login successful", "email": email}), 200
        else:
            return jsonify({"error": "Invalid password"}), 402
    else:
        return jsonify({"error": "Invalid email"}), 401

@app.route('/google-register', methods=['POST'])
def google_register():
    data = request.get_json()
    email = data.get('email')
    google_id = data.get('google_id')

    if email is None or google_id is None:
        return jsonify({"error": "Email and Google ID are required"}), 400

    # Find user by email
    existing_user = users_collection.find_one({"email": email})

    if existing_user:
        if existing_user.get("google_id") == google_id:
            # Google ID matches
            return jsonify({"message": "User already logged in"}), 200
        elif existing_user.get("google_id") =="":
            # Google ID is missing, update with new Google ID
            users_collection.update_one(
                {"email": email},
                {"$set": {"google_id": google_id}}
            )
            return jsonify({"message": "User successfully logged in and Google ID updated"}), 200
    else:
        # Create a new user if not found
        user = {
            "email": email,
            "google_id": google_id,
            "password": ""
        }
        users_collection.insert_one(user)
        return jsonify({"message": "User registered successfully with Google"}), 201


@app.route('/test-connection', methods=['GET'])
def test_connection():
    try:
        response = requests.post('http://localhost:8989/test-connection')
        if response.status_code == 200:
            app.logger.info('Successfully connected to OpenAI Chat GPT API')
            return jsonify({"message": "Successfully connected to OpenAI Chat GPT API"}), 200
        else:
            return jsonify({"error": "Failed to connect to OpenAI Chat GPT API"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/check-email', methods=['POST'])
def check_email():
    data = request.get_json()
    email = data.get('email')
    if email is None:
        return jsonify({"exists": False}), 400

    user = users_collection.find_one({"email": email})
    if user:
        return jsonify({"exists": True}), 200
    else:
        return jsonify({"exists": False}), 200

@app.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')
    if email is None:
        return jsonify({"error": "Email is required"}), 400

    user = users_collection.find_one({"email": email})
    if user:
        token = generate_token()
        users_collection.update_one({"email": email}, {"$set": {"reset_token": token}})
        send_reset_email(email, token)
        return jsonify({"message": "Password reset token sent"}), 200
    else:
        return jsonify({"error": "Email does not exist"}), 400

@app.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    email = data.get('email')
    token = data.get('token')
    new_password = data.get('new_password')

    if email is None or token is None or new_password is None:
        return jsonify({"error": "Email, token, and new password are required"}), 400

    user = users_collection.find_one({"email": email})
    if user and user.get('reset_token') == token:
        hashed_password = generate_password_hash(new_password)
        users_collection.update_one({"email": email}, {"$set": {"password": hashed_password}})
        return jsonify({"message": "Password has been reset successfully"}), 200
    else:
        return jsonify({"error": "Invalid token or email"}), 400

if __name__ == '__main__':
    app.run(debug=True)