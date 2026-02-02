import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BookingSuccessModal.css';

const BookingSuccessModal = ({ bookingDetails, onClose }) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Hide confetti after 3 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
  const handleViewBookings = () => {
    navigate('/dashboard');
    onClose();
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return 'N/A';
    const date = new Date(dateTime);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="success-modal-overlay">
      {showConfetti && (
        <div className="confetti-container">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe'][Math.floor(Math.random() * 5)]
              }}
            />
          ))}
        </div>
      )}

      <div className="success-modal">
        <div className="success-icon-wrapper">
          <div className="success-checkmark">
            <svg className="checkmark" viewBox="0 0 52 52">
              <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
              <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
          </div>
        </div>

        <h2 className="success-title">🎉 Booking Confirmed!</h2>
        <p className="success-subtitle">Your game has been successfully booked</p>

        <div className="booking-summary">
          <div className="summary-card">
            <div className="summary-icon">🎮</div>
            <div className="summary-content">
              <span className="summary-label">Game</span>
              <span className="summary-value">{bookingDetails?.gameName || 'N/A'}</span>
            </div>
          </div>          <div className="summary-card">
            <div className="summary-icon">🏢</div>
            <div className="summary-content">
              <span className="summary-label">Floor</span>
              <span className="summary-value">Floor {bookingDetails?.floor || 'N/A'}</span>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">⏰</div>
            <div className="summary-content">
              <span className="summary-label">Start Time</span>
              <span className="summary-value">{formatDateTime(bookingDetails?.startTime)}</span>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">⏰</div>
            <div className="summary-content">
              <span className="summary-label">End Time</span>
              <span className="summary-value">{formatDateTime(bookingDetails?.endTime)}</span>
            </div>
          </div>

          {bookingDetails?.bookingId && (
            <div className="summary-card booking-id-card">
              <div className="summary-icon">🎫</div>
              <div className="summary-content">
                <span className="summary-label">Booking ID</span>
                <span className="summary-value booking-id">#{bookingDetails.bookingId}</span>
              </div>
            </div>
          )}
        </div>        <div className="success-actions">
          <button className="view-bookings-btn" onClick={handleViewBookings}>
            <span>View My Bookings</span>
            <span className="btn-arrow">→</span>
          </button>
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="success-message">
          <p>✨ Get ready for an amazing gaming experience! ✨</p>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessModal;
