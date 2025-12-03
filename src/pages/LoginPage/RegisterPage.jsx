import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import './RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    phoneNumber: '',
    role: '',
    department: '',
    officeLocation: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.register(formData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Register</h2>
        {error && <div className="error-message">{error}</div>}
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="userName">Username</label>
          <input 
            type="text" 
            id="userName" 
            name="userName" 
            value={formData.userName}
            onChange={handleChange}
            required 
          />

          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={formData.email}
            onChange={handleChange}
            required 
          />

          <label htmlFor="phoneNumber">Phone Number</label>
          <input 
            type="tel" 
            id="phoneNumber" 
            name="phoneNumber" 
            value={formData.phoneNumber}
            onChange={handleChange}
            required 
          />

          <label htmlFor="role">Role</label>
          <input 
            type="text" 
            id="role" 
            name="role" 
            value={formData.role}
            onChange={handleChange}
            required 
          />

          <label htmlFor="department">Department</label>
          <input 
            type="text" 
            id="department" 
            name="department" 
            value={formData.department}
            onChange={handleChange}
            required 
          />

          <label htmlFor="officeLocation">Office Location</label>
          <input 
            type="text" 
            id="officeLocation" 
            name="officeLocation" 
            value={formData.officeLocation}
            onChange={handleChange}
            required 
          />

          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            value={formData.password}
            onChange={handleChange}
            required 
          />

          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
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
