import React from 'react';
import './LoginPage.css';

const LoginPage = () => {
  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login</h2>
        <form className="login-form">
          <label htmlFor="username">Username / Email</label>
          <input type="text" id="username" name="username" required />

          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required />

          <button type="submit" className="login-submit">Login</button>
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
