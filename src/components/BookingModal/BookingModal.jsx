import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { createBooking, getAllEquipment } from '../../services/api';
import './BookingModal.css';

const BookingModal = ({ game, location, userId, onClose, onSuccess }) => {
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [error, setError] = useState('');
    const [playerIds, setPlayerIds] = useState(Array(game.numberOfPlayers).fill(''));
    const [selectedEquipmentId, setSelectedEquipmentId] = useState('');

    const { data: equipmentData } = useQuery({
        queryKey: ['equipment'],
        queryFn: getAllEquipment,
    });

    // Ensure equipmentList is always an array
    const equipmentList = Array.isArray(equipmentData) ? equipmentData : [];

    const queryClient = useQueryClient();

    const bookingMutation = useMutation({
        mutationFn: createBooking,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            onSuccess?.();
            onClose();
        },
        onError: (err) => {
            setError(err.response?.data?.message || 'Failed to create booking. Please try again.');
        },
    });

    const handlePlayerIdChange = (index, value) => {
        const newPlayerIds = [...playerIds];
        newPlayerIds[index] = value;
        setPlayerIds(newPlayerIds);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!startTime || !endTime) {
            setError('Please select both start and end times');
            return;
        }

        if (new Date(startTime) >= new Date(endTime)) {
            setError('End time must be after start time');
            return;
        }

        if (playerIds.some(id => !id)) {
            setError('Please enter all player IDs');
            return;
        }

        if (!selectedEquipmentId) {
            setError('Please select equipment');
            return;
        }

        bookingMutation.mutate({
            userId: parseInt(userId),
            gameId: game.gameId,
            playerIds: playerIds.map(id => parseInt(id)),
            equipmentId: parseInt(selectedEquipmentId),
            locationId: location?.locationId?.toString(), // Ensure string if backend expects string, but consistent with requested JSON
            bookingStartTime: new Date(startTime).toISOString(),
            bookingEndTime: new Date(endTime).toISOString(),
        });
    };

    return (
        <div className="booking-modal-overlay" onClick={onClose}>
            <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
                <div className="booking-modal-header">
                    <h2>Book {game.gameName}</h2>
                    <button className="booking-modal-close" onClick={onClose}>×</button>
                </div>

                <form className="booking-form" onSubmit={handleSubmit}>
                    <div className="booking-info">
                        <p><strong>Location:</strong> {location?.office}, {location?.city}</p>
                        <p><strong>Players Required:</strong> {game.numberOfPlayers}</p>
                    </div>

                    <div className="booking-section">
                        <h3>Player Details</h3>
                        {playerIds.map((_, index) => (
                            <div key={index} className="booking-field">
                                <label>Player {index + 1} ID</label>
                                <input
                                    type="number"
                                    value={playerIds[index]}
                                    onChange={(e) => handlePlayerIdChange(index, e.target.value)}
                                    placeholder={`Enter User ID for Player ${index + 1}`}
                                    required
                                />
                            </div>
                        ))}
                    </div>

                    <div className="booking-section">
                        <h3>Equipment</h3>
                        <div className="booking-field">
                            <label>Select Equipment</label>
                            <select
                                value={selectedEquipmentId}
                                onChange={(e) => setSelectedEquipmentId(e.target.value)}
                                required
                            >
                                <option value="">Select Equipment</option>
                                {equipmentList.map((eq) => (
                                    <option key={eq.equipmentId} value={eq.equipmentId}>
                                        {eq.equipmentName} ({eq.stockAvailable} available)
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="booking-field">
                        <label htmlFor="startTime">Start Time</label>
                        <input
                            type="datetime-local"
                            id="startTime"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            min={new Date().toISOString().slice(0, 16)}
                            required
                        />
                    </div>

                    <div className="booking-field">
                        <label htmlFor="endTime">End Time</label>
                        <input
                            type="datetime-local"
                            id="endTime"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            min={startTime || new Date().toISOString().slice(0, 16)}
                            required
                        />
                    </div>

                    {error && <div className="booking-error">{error}</div>}

                    <div className="booking-actions">
                        <button
                            type="button"
                            className="booking-cancel-btn"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="booking-submit-btn"
                            disabled={bookingMutation.isPending}
                        >
                            {bookingMutation.isPending ? 'Booking...' : 'Confirm Booking'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;
