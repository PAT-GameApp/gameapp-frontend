import React from 'react';
import './RegisterPage.css';

const RegisterPage = () => {
  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Register</h2>
        <form className="login-form">
          <label htmlFor="user_name">Username</label>
          <input type="text" id="user_name" name="user_name" required />

          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required />

          <label htmlFor="phone_number">Phone Number</label>
          <input type="tel" id="phone_number" name="phone_number" required />

          <label htmlFor="role">Role</label>
          <input type="text" id="role" name="role" required />

          <label htmlFor="department">Department</label>
          <input type="text" id="department" name="department" required />

          <label htmlFor="office_location">Office Location</label>
          <input type="text" id="office_location" name="office_location" required />

          <button type="submit" className="login-submit">Register</button>
        </form>
        <div className="login-register-link">
          <span>Already have an account?</span>
          <a href="/login"> Login</a>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
