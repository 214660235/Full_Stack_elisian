
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal, Box, Typography, Button } from '@mui/material';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import ForgotPasswordComponent from './ForgotPasswordComponent';
import '../Style/LoginPage.css';
import Logo_Google from '../assets/Logo_Google.webp';
import Facebook_Icon from '../assets/Facebook_Icon.webp';
import emailIcon from '../assets/Mail_Icon.png';
import passwordIcon from '../assets/Lock_Icon.png';
import Eye_Icon from '../assets/Eye_Icon.png';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [showGoogleLogin, setShowGoogleLogin] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/login', { email, password });
      console.log(response.data);
      checkConnection();
  
      // Handle login success
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            setError('Email and password are required.');
            break;
          case 401:
            setError('Invalid email. Please register.');
            break;
          case 402:
            setError('Incorrect password. Please try again. Or restore.');
            break;
          default:
            setError('There was an error logging in!');
        }
        setOpen(true);
      } else {
        setError('There was an error logging in!');
        setOpen(true);
      }
      console.error(error);
    }
  };
  
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/register', { email, password });
      console.log(response.data);
      setToastMessage(response.data.message);
      setShowToast(true);
      checkConnection();
    } catch (error) {
      if (error.response && error.response.data.error === 'User already exists') {
        setError('The user already exists!');
        setOpen(true);
      } else {
        setError('There was an error registering!');
        setOpen(true);
      }
      console.error(error);
    }
  };

  const checkConnection = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/test-connection');
      if (response.status === 200) {
        setToastMessage('Successfully connected to OpenAI Chat GPT API');
      } else {
        setToastMessage('Failed to connect to OpenAI Chat GPT API');
      }
      setShowToast(true);
    } catch (error) {
      console.error('Error connecting to OpenAI:', error);
      setToastMessage('Error connecting to OpenAI Chat GPT API');
      setShowToast(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    redirectToLogin(); // Switch to login form when closing the modal
  };

  const closeToast = () => {
    setShowToast(false);
  };

  const redirectToLogin = () => {
    setError('');
    setIsLogin(true);
  };

  const redirectToRegister = () => {
    setError('');
    setIsLogin(false);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      setEmail(decoded.email);
      checkConnection();
      setTimeout(() => { setShowGoogleLogin(false); }, 5000);

      const response = await axios.post('http://127.0.0.1:5000/google-register', { 
        email: decoded.email, 
        google_id: decoded.sub  // Adjust this according to the actual property from the decoded response
      });
      setToastMessage(response.data.message);
      setShowToast(true);
    } catch (error) {
      setError('There was an error registering with Google! ' + (error.response ? error.response.data.error : ''));
    }
  };

  const handleGoogleError = (error) => {
    setError('Login Failed');
  };

  const handleGoogleLoginClick = () => {
    setShowGoogleLogin(true);
  };

  const handleForgotPasswordClick = () => {
    setForgotPasswordOpen(true);
  };

  return (
    <GoogleOAuthProvider clientId="913044228623-ll9kap8eojd6ibs54fs9bu8070u0kljo.apps.googleusercontent.com">
      <div className="right-side">
        <div className="login-form">
          <h2>{isLogin ? 'Log in' : 'Register'}</h2>
          <form onSubmit={isLogin ? handleLogin : handleRegister}>
            <div className="input-container">
              <img src={emailIcon} alt="Email icon" className="icon" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-container">
              <img src={passwordIcon} alt="Password icon" className="icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                <img src={Eye_Icon} alt="Eye icon" className="eye-icon" />
              </span>
            </div>
            {isLogin && (
              <a href="#" className="forgot-password" onClick={handleForgotPasswordClick}>Forgot password?</a>
            )}
            <button type="submit" className="login-button">{isLogin ? 'Log in' : 'Register'}</button>
          </form>
          <div className="divider">
            <span className="divider-line"></span>
            <span className="divider-text">Or</span>
            <span className="divider-line"></span>
          </div>
          <div className="alternative-login">
            {showGoogleLogin ? (
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                render={renderProps => (
                  <button onClick={renderProps.onClick} className="google-login">
                    <img src={Logo_Google} alt="Google icon" className="icon" />
                    Google
                  </button>
                )}
              />
            ) : (
              <button onClick={handleGoogleLoginClick} className="google-login">
                <img src={Logo_Google} alt="Google icon" className="icon" />
                Google
              </button>
            )}
            <button className="facebook-login">
              <img src={Facebook_Icon} alt="Facebook icon" className="icon" />
              Facebook
            </button>
          </div>
          <p className="no-account">{isLogin ? 'Have no account yet?' : 'Already have an account?'}</p>
          <div className="register-button-container">
            <button onClick={isLogin ? redirectToRegister : redirectToLogin} className="register-button">
              {isLogin ? 'Register' : 'Log in'}
            </button>
          </div>
        </div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="error-modal-title"
          aria-describedby="error-modal-description"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4
          }}>
            <Typography id="error-modal-title" variant="h6" component="h2">
              Error
            </Typography>
            <Typography id="error-modal-description" sx={{ mt: 2 }}>
              {error}
            </Typography>
            {error === 'The user already exists!' && (
              <Button onClick={() => { handleClose(); }} sx={{ mt: 2 }}>
                Go to Login
              </Button>
            )}
            <Button onClick={handleClose} sx={{ mt: 2 }}>Close</Button>
          </Box>
        </Modal>

        {showToast && (
          <div className="toast-message">
            {toastMessage}
            <button onClick={closeToast} className="close-toast-button">Close</button>
          </div>
        )}
      </div>
      <ForgotPasswordComponent open={forgotPasswordOpen} onClose={() => setForgotPasswordOpen(false)} />
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
