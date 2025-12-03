import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/catalog');
  };
  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input 
            type="text" 
            id="email" 
            name="email" 
            value={credentials.email}
            onChange={handleChange}
          />

          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            value={credentials.password}
            onChange={handleChange}
          />          <button type="submit" className="login-submit">
            Login
          </button>
        </form>
        <div className="login-register-link">
          <span>Don't have an account?</span>
          <a href="/register"> Register</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
