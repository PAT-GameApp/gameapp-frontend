import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ConfirmationPage.css';
import cognizantLogo from '../../assets/Cognizant_Logo.png';

const ConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { game, date, slot } = location.state || {};

  if (!game || !date || !slot) {
    navigate('/catalog');
    return null;
  }

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="confirmation-page">
      <div className="confirmation-container">        <div className="confirmation-header">
          <img 
            src="/assets/images/Cognizant-Logo.jpg" 
            alt="Cognizant Logo" 
            className="cognizant-logo" 
            style={{ height: '80px', width: 'auto' }}
          />
        </div>

        <div className="success-animation">
          <div className="success-checkmark">
            <div className="check-icon">
              <span className="icon-line line-tip"></span>
              <span className="icon-line line-long"></span>
              <div className="icon-circle"></div>
              <div className="icon-fix"></div>
            </div>
          </div>
        </div>

        <div className="confirmation-content">
          <h1>Booking Confirmed!</h1>
          <p className="confirmation-message">Your game session has been successfully booked.</p>

          <div className="booking-details">
            <div className="detail-card">
              <div className="detail-icon">{game.icon}</div>
              <div className="detail-info">
                <span className="detail-label">Game</span>
                <span className="detail-value">{game.name}</span>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon">📅</div>
              <div className="detail-info">
                <span className="detail-label">Date</span>
                <span className="detail-value">{formatDate(date)}</span>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon">🕒</div>
              <div className="detail-info">
                <span className="detail-label">Time</span>
                <span className="detail-value">{slot.time}</span>
              </div>
            </div>
          </div>

          <div className="booking-reference">
            <p className="reference-label">Booking Reference</p>
            <p className="reference-number">#{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
          </div>

          <div className="confirmation-actions">
            <button className="btn-primary" onClick={() => navigate('/catalog')}>
              Book Another Game
            </button>
            <button className="btn-secondary" onClick={() => navigate('/')}>
              Go to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
