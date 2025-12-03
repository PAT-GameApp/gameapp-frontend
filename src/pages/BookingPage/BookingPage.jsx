import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import bookingService from '../../services/bookingService';
import inventoryService from '../../services/inventoryService';
import authService from '../../services/authService';
import './BookingPage.css';

const BookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { game } = location.state || { game: { name: 'Game', icon: '🎮' } };
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [allotments, setAllotments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const timeSlots = [
    { id: 1, time: '09:00 AM - 10:00 AM', available: true },
    { id: 2, time: '10:00 AM - 11:00 AM', available: true },
    { id: 3, time: '11:00 AM - 12:00 PM', available: false },
    { id: 4, time: '12:00 PM - 01:00 PM', available: true },
    { id: 5, time: '01:00 PM - 02:00 PM', available: true },
    { id: 6, time: '02:00 PM - 03:00 PM', available: true },
    { id: 7, time: '03:00 PM - 04:00 PM', available: false },
    { id: 8, time: '04:00 PM - 05:00 PM', available: true },
    { id: 9, time: '05:00 PM - 06:00 PM', available: true },
    { id: 10, time: '06:00 PM - 07:00 PM', available: true }
  ];

  useEffect(() => {
    fetchAllotments();
  }, []);

  const fetchAllotments = async () => {
    try {
      const data = await inventoryService.getAllAllotments();
      setAllotments(data);
    } catch (err) {
      console.error('Error fetching allotments:', err);
    }
  };
  const handleBooking = async () => {
    if (!selectedSlot || !selectedLocation) {
      setError('Please select a time slot and location');
      return;
    }

    setLoading(true);
    setError('');

    // Bypass backend and go directly to confirmation
    setTimeout(() => {
      navigate('/confirmation', {
        state: {
          game,
          date: selectedDate,
          slot: timeSlots.find(slot => slot.id === selectedSlot),
          location: selectedLocation
        }
      });
      setLoading(false);
    }, 500);

    // try {
    //   const currentUser = authService.getCurrentUser();
    //   const bookingData = {
    //     userId: currentUser?.userId || 1,
    //     gameId: game.id,
    //     allotmentId: allotments[0]?.allotmentId || 1,
    //     bookingLocation: selectedLocation,
    //   };

    //   await bookingService.createBooking(bookingData);
    //   
    //   navigate('/confirmation', {
    //     state: {
    //       game,
    //       date: selectedDate,
    //       slot: timeSlots.find(slot => slot.id === selectedSlot),
    //       location: selectedLocation
    //     }
    //   });
    // } catch (err) {
    //   setError(err.response?.data || 'Failed to create booking. Please try again.');
    //   console.error('Booking error:', err);
    // } finally {
    //   setLoading(false);
    // }
  };
  return (
    <div className="booking-page">      <header className="booking-header">        <div className="header-left">
          <img 
            src="/assets/images/Cognizant-Logo.jpg" 
            alt="Cognizant" 
            className="cognizant-logo"
          />
          <button className="back-btn" onClick={() => navigate('/catalog')}>
            ← Back
          </button>
        </div>
        <h1>Book {game.name}</h1>
      </header>

      <main className="booking-main">
        <div className="booking-container">
          {error && <div className="error-message">{error}</div>}
          
          <div className="game-info-section">
            <div className="game-icon-display">{game.icon}</div>
            <h2>{game.name}</h2>
            <p>{game.locations && `Available at: ${game.locations}`}</p>
            <p>{game.numPlayers && `Players: ${game.numPlayers}`}</p>
          </div>

          <div className="date-selection">
            <label htmlFor="booking-date">Select Date</label>
            <input
              type="date"
              id="booking-date"
              value={selectedDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div className="location-selection">
            <label htmlFor="booking-location">Select Location</label>
            <input
              type="text"
              id="booking-location"
              placeholder="Enter location"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            />
          </div>

          <div className="time-slots-section">
            <h3>Available Time Slots</h3>
            <div className="time-slots-grid">
              {timeSlots.map((slot) => (
                <button
                  key={slot.id}
                  className={`time-slot ${selectedSlot === slot.id ? 'selected' : ''} ${!slot.available ? 'unavailable' : ''}`}
                  onClick={() => slot.available && setSelectedSlot(slot.id)}
                  disabled={!slot.available}
                >
                  {slot.time}
                  {!slot.available && <span className="booked-label">Booked</span>}
                </button>
              ))}
            </div>
          </div>

          <button
            className="confirm-booking-btn"
            onClick={handleBooking}
            disabled={!selectedSlot || !selectedLocation || loading}
          >
            {loading ? 'Creating Booking...' : 'Confirm Booking'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default BookingPage;
