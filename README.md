
# User Authentication and Registration Management Project


link to video explain:https://drive.google.com/file/d/1e5t4ZNNWzH2yDYvQFDlomWS9FYU2rMBg/view?usp=sharing




![לוגו הפרויקט](https://drive.google.com/uc?export=view&id=17PrwMZ-7b9kZKNQhfzq8NNal2iacDdVQ)






## Introduction

In this project, I developed a website for managing user authentication and registration processes using various technologies and programming languages.

- I developed the registration interface using **React JS** to ensure an intuitive and user-friendly experience.
- The server is connected to Python and handles communication with the frontend as well as user management.
- I used **MongoDB** to manage the database, where all user information is stored.
- After user registration, the application displays a Toast message with random text retrieved via an API connection to **Chat GPT**, which runs on a second server written in **Node.js**.

## Database Structure

Our database, managed by **MongoDB**, contains a collection of users. Each user record includes three fields: email, password, and Google ID.  
The reason we have both a password and Google ID is to support two types of authentication:

- **Password:** Used for regular login with an email and password defined by the user during registration.
- **Google ID:** Used for authentication via the user's Google account.

### Example User Structure

```json
{
  "email": "vfe@gmail.com",
  "password": "scrypt:32768:8:1$xuElcZ7246HE3xSA$e6311acb9aaff9b6e4126a4b4af72c963f14756f7170c368d78c1e135b0ef4952fe619e52477d61f44e87bcb886aee0ec6c715d03dba16a7b7d2df8c9f8d2d95",
  "google_id": ""
}
```
The email serves as a unique key to identify the user, the password is the user's encrypted password, and the Google ID is the field where the user's Google account identifier is stored if they log in through Google.

## Login Process

### Regular Login

- The user enters their email and password and clicks "Login."
- The application sends a POST request to the server at `/login`, where the server checks if the email exists in the database.
  - If the email exists, the server checks if the password is correct.
    - If the password is correct, the user logs in successfully, and a success message is displayed.
    - If the password is incorrect, an error message "Incorrect password. Please try again or reset." is displayed.
      - If the user forgot their password, they can click "Forgot Password?" to initiate the password recovery process. In this process, the user provides their email, and the server sends a verification code to the email. The user enters the code and sets a new password, completing the password reset.
  - If the email does not exist, an error message "Invalid email. Please register." is displayed.

## Registration Process

- When the user enters their email and password and clicks "Register," the application sends a POST request to the server at `/register`.
- The server checks if the email is already registered in the database.
  - If the email is not registered, a new user is created with the provided details, and a success message is displayed: "Welcome!"
  - If the email is already registered, an error message "User already exists!" is displayed.

## Google Authentication Process

- The user clicks the Google login button, the Google OAuth process begins, and the user is authenticated.
- The server then checks the user's email.
  - If the email is already linked with a Google ID, the user logs in successfully.
  - If the email exists but is not linked with a Google ID, the server updates the details and links the user.
  - If the email does not exist, a new user is created, and the user logs in.

## OpenAI API Connection Test

To ensure that the connection to the OpenAI Chat GPT API is working correctly, the application sends a POST request to `/test-connection` with parameters including the model and message for testing. If the connection is successful, a success message is displayed. If the connection fails, an error message is displayed.

## Installation Instructions

To run this project locally, please follow these steps:

1. **Clone the repository:**

   ```bash
   git clone <repository_url>
   cd <repository_directory>
   ```

2. **Install backend dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

3. **Install frontend dependencies:**

   ```bash
   cd client
   npm install
   ```

4. **Set up environment variables:**
   - Create a `.env` file in the root directory.
   - Add the necessary environment variables (e.g., `MONGODB_URI`, `OPENAI_API_KEY`, etc.).

5. **Run the backend server:**

   ```bash
   python app.py
   ```

6. **Run the frontend server:**

   ```bash
   cd client
   npm start
   ```

7. **Test the application:**
   - Open your browser and navigate to `http://localhost:3000` to view the application.

---

Good luck with the project! ✌️
