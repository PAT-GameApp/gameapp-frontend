import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBooking } from '../../services/api';
import './BookingModal.css';

const BookingModal = ({ game, location, userId, onClose, onSuccess }) => {
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [error, setError] = useState('');

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

        bookingMutation.mutate({
            userId: parseInt(userId),
            gameId: game.gameId,
            bookingLocation: location,
            bookingStartTime: startTime,
            bookingEndTime: endTime,
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
                        <p><strong>Location:</strong> {location}</p>
                        <p><strong>Players:</strong> {game.numberOfPlayers}</p>
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
