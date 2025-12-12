import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLocations } from '../../services/api';
import useLocationStore from '../../store/useLocationStore';
import './LocationModal.css';

const LocationModal = ({ isOpen, onClose }) => {
    const [step, setStep] = useState('country'); // country, city, office
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);

    const setSelectedLocation = useLocationStore((state) => state.setSelectedLocation);

    const { data: locations = [], isLoading, isError } = useQuery({
        queryKey: ['locations'],
        queryFn: getLocations,
        enabled: isOpen,
    });

    // Extract unique countries
    const countries = useMemo(() => {
        if (!locations) return [];
        return [...new Set(locations.map(loc => loc.country))];
    }, [locations]);

    // Extract cities for selected country
    const cities = useMemo(() => {
        if (!selectedCountry || !locations) return [];
        return [...new Set(locations
            .filter(loc => loc.country === selectedCountry)
            .map(loc => loc.city))];
    }, [locations, selectedCountry]);

    // Extract offices for selected city
    const offices = useMemo(() => {
        if (!selectedCity || !locations) return [];
        return locations.filter(loc => loc.city === selectedCity);
    }, [locations, selectedCity]);

    const handleCountrySelect = (country) => {
        setSelectedCountry(country);
        setStep('city');
    };

    const handleCitySelect = (city) => {
        setSelectedCity(city);
        setStep('office');
    };

    const handleOfficeSelect = (location) => {
        setSelectedLocation(location);
        onClose();
        // Reset state after closing
        setTimeout(() => {
            setStep('country');
            setSelectedCountry(null);
            setSelectedCity(null);
        }, 300);
    };

    const handleBack = () => {
        if (step === 'city') {
            setStep('country');
            setSelectedCountry(null);
        } else if (step === 'office') {
            setStep('city');
            setSelectedCity(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="location-modal-overlay" onClick={onClose}>
            <div className="location-modal-content" onClick={e => e.stopPropagation()}>
                <div className="location-modal-header">
                    {step !== 'country' && (
                        <button className="back-button" onClick={handleBack}>
                            ← Back
                        </button>
                    )}
                    <h2>Select {step.charAt(0).toUpperCase() + step.slice(1)}</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <div className="location-modal-body">
                    {isLoading ? (
                        <div className="loading-state">Loading locations...</div>
                    ) : isError ? (
                        <div className="error-state">Failed to load locations</div>
                    ) : (
                        <div className="options-grid">
                            {step === 'country' && countries.map(country => (
                                <button
                                    key={country}
                                    className="location-option-btn"
                                    onClick={() => handleCountrySelect(country)}
                                >
                                    {country}
                                </button>
                            ))}

                            {step === 'city' && cities.map(city => (
                                <button
                                    key={city}
                                    className="location-option-btn"
                                    onClick={() => handleCitySelect(city)}
                                >
                                    {city}
                                </button>
                            ))}

                            {step === 'office' && offices.map(office => (
                                <button
                                    key={office.locationId}
                                    className="location-option-btn"
                                    onClick={() => handleOfficeSelect(office)}
                                >
                                    {office.office}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LocationModal;
