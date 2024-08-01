import React from 'react';
import '../Style/Left_half_page.css';
import logo from '../assets/logo.png'; // עדכון הנתיב ללוגו
import welcomeImage from '../assets/Main_image.png'; // נתיב לתמונה החדשה

const Left_half_page = () => {
  return (
    <div className="login-page">
      <div className="icon-container">
        <img src={logo} alt="Icon" className="icon" />
      </div>
      <div className="welcome-message">
        <img src={welcomeImage} alt="Welcome" className="welcome-image" />
        <h1>Welcome aboard my friend</h1>
        <p>Just a couple of clicks and we start</p>
      </div>
    </div>
  );
};

export default Left_half_page;
