
import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Box, Typography, Button } from '@mui/material';

const ForgotPasswordComponent = ({ open, onClose }) => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1); // 1: Email input, 2: Token input, 3: New password input

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const emailExistsResponse = await axios.post('http://127.0.0.1:5000/check-email', { email });
      if (!emailExistsResponse.data.exists) {
        setError('Email does not exist');
        return;
      }

      const response = await axios.post('http://127.0.0.1:5000/forgot-password', { email });
      console.log(response.data);
      setStep(2);
      setSuccess(true);
      
    } catch (error) {
      setError('There was an error processing your request!');
      console.error(error);
    }
  };

  const handleTokenSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/reset-password', { email, token, new_password: newPassword });
      console.log(response.data);
      if (response.data.message === "Password has been reset successfully") {
        setSuccess(true);
        setStep(3);
      } else {
        setError('Invalid token or email');
      }
    } catch (error) {
      setError('There was an error processing your request!');
      console.error(error);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleForgotPassword}>
            <div className="input-container">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" sx={{ mt: 2 }}>
              Send Reset Link
            </Button>
            {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
          </form>
        );
      case 2:
        return (
          <form onSubmit={handleTokenSubmit}>
            <div className="input-container">
              <input
                type="text"
                placeholder="Token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
              />
            </div>
            <div className="input-container">
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" sx={{ mt: 2 }}>
              Submit
            </Button>
            {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
          </form>
        );
      case 3:
        return (
          <Typography id="forgot-password-modal-description" sx={{ mt: 2 }}>
            Password has been reset successfully.
          </Typography>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="forgot-password-modal-title"
      aria-describedby="forgot-password-modal-description"
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
        <Typography id="forgot-password-modal-title" variant="h6" component="h2">
          Forgot Password
        </Typography>
        {renderStep()}
        <Button onClick={onClose} sx={{ mt: 2 }}>Close</Button>
      </Box>
    </Modal>
  );
};

export default ForgotPasswordComponent;

