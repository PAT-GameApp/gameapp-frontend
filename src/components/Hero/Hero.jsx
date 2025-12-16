import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLocations } from '../../services/api';
import LocationModal from '../LocationModal/LocationModal';
import useLocationStore from '../../store/useLocationStore';
import './Hero.css';

const Hero = () => {
  const selectedLocation = useLocationStore((state) => state.selectedLocation);
  const setSelectedLocation = useLocationStore((state) => state.setSelectedLocation);
  const [isModalOpen, setIsModalOpen] = useState(false);



  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <div className="location-selector-wrapper">
            <div
              className="location-selector"
              onClick={() => setIsModalOpen(true)}
            >
              <span className="location-icon">📍</span>
              <span className="location-text">
                {selectedLocation ? `${selectedLocation.office}, ${selectedLocation.city}` : 'Select a location'}
              </span>
              <span className="dropdown-icon">▼</span>
            </div>

            <LocationModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          </div>

          <h1 className="hero-title">
            BOOK GAME TABLES.
            <br />
            JOIN GAMES.
            <br />
            CONNECT WITH COLLEAGUES.
          </h1>

          <p className="hero-description">
            Cognizant's Sports Community to Book Game Tables,
            Find Players, and Join Games at your Office.
          </p>

          <button
            className="hero-cta-button"
            onClick={() => window.location.href = '/dashboard'}
            style={{
              padding: '12px 24px',
              fontSize: '1rem',
              fontWeight: '600',
              color: '#fff',
              backgroundColor: '#0033A0',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginTop: '20px',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#002880'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#0033A0'}
          >
            My Bookings
          </button>
        </div>

        <div className="hero-images">
          <div className="image-grid">
            <div className="image-placeholder large">
              <span>🏓</span>
            </div>
            <div className="image-placeholder medium">
              <span>🎯</span>
            </div>
            <div className="image-placeholder small">
              <span>♟️</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
