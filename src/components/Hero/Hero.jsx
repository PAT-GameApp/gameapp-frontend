import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLocations } from '../../services/api';
import useLocationStore from '../../store/useLocationStore';
import './Hero.css';

const Hero = () => {
  const selectedLocation = useLocationStore((state) => state.selectedLocation);
  const setSelectedLocation = useLocationStore((state) => state.setSelectedLocation);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { data: locations, isLoading, isError } = useQuery({
    queryKey: ['locations'],
    queryFn: getLocations,
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setIsDropdownOpen(false);
  };

  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <div className="location-selector-wrapper" ref={dropdownRef}>
            <div
              className="location-selector"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="location-icon">📍</span>
              <span className="location-text">
                {isLoading ? 'Loading...' : isError ? 'Error loading' : selectedLocation?.city || 'Select a location'}
              </span>
              <span className={`dropdown-icon ${isDropdownOpen ? 'open' : ''}`}>▼</span>
            </div>

            {isDropdownOpen && !isLoading && !isError && locations && (
              <div className="location-dropdown">
                {locations.map((location) => (
                  <div
                    key={location.locationId}
                    className={`location-option ${location.locationId === selectedLocation?.locationId ? 'selected' : ''}`}
                    onClick={() => handleLocationSelect(location)}
                  >
                    <span className="location-icon"></span>
                    <span>{location.city}</span>
                  </div>
                ))}
              </div>
            )}
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
