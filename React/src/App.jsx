import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginPage from './components/LoginPage';
import Left_half_page from './components/Left_half_page';


function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Left_half_page />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={
              <div className="container">
                <div className="component">
                  <LoginPage />
                </div>
              </div>
            } />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;

