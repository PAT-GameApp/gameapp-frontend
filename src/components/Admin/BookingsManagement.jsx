import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllBookings, getAllGames, getGamesByLocation, allotBooking } from "../../services/api";

const BookingsManagement = ({ selectedLocation }) => {
    const queryClient = useQueryClient();
    const [showAllotModal, setShowAllotModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    // Fetch bookings using React Query
    const {
        data: bookings = [],
        isLoading: isLoadingBookings,
        isError: isErrorBookings,
        error: bookingsError,
    } = useQuery({
        queryKey: ["bookings"],
        queryFn: getAllBookings,
    });

    // Fetch games for display - conditionally by location
    const { data: games = [] } = useQuery({
        queryKey: ["games", selectedLocation],
        queryFn: () => selectedLocation ? getGamesByLocation(selectedLocation) : getAllGames(),
    });

    // Filter bookings by selected location
    const filteredBookings = useMemo(() => {
        if (!selectedLocation) return bookings;
        return bookings.filter(booking => booking.bookingLocation === selectedLocation);
    }, [bookings, selectedLocation]);

    // Allot booking mutation
    const allotBookingMutation = useMutation({
        mutationFn: allotBooking,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
            setShowAllotModal(false);
            setSelectedBooking(null);
        },
        onError: (error) => {
            console.error("Failed to allot booking:", error);
        },
    });

    const getGameName = (gameId) => {
        const game = games.find((g) => g.gameId === gameId);
        return game ? game.gameName : "Unknown Game";
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    const handleAllotClick = (booking) => {
        setSelectedBooking(booking);
        setShowAllotModal(true);
    };

    const handleAllotConfirm = async () => {
        if (!selectedBooking) return;
        allotBookingMutation.mutate(selectedBooking.bookingId);
    };

    const pendingBookings = filteredBookings.filter((b) => !b.allotmentId);
    const allottedBookings = filteredBookings.filter((b) => b.allotmentId);
    //debug
    console.log("Pending Bookings:", pendingBookings);

    if (isLoadingBookings) {
        return (
            <div className="admin-section">
                <div className="admin-section-header">
                    <h1 className="admin-section-title">📅 Bookings Management</h1>
                </div>
                <div className="empty-state">
                    <div className="empty-state-icon">⏳</div>
                    <p className="empty-state-text">Loading bookings...</p>
                </div>
            </div>
        );
    }

    if (isErrorBookings) {
        return (
            <div className="admin-section">
                <div className="admin-section-header">
                    <h1 className="admin-section-title">📅 Bookings Management</h1>
                </div>
                <div className="empty-state">
                    <div className="empty-state-icon">❌</div>
                    <p className="empty-state-text">Error loading bookings: {bookingsError?.message}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-section">
            <div className="admin-section-header">
                <h1 className="admin-section-title">📅 Bookings Management</h1>
                <div style={{ display: "flex", gap: "12px" }}>
                    <span className="status-badge pending">
                        {pendingBookings.length} Pending
                    </span>
                    <span className="status-badge allotted">
                        {allottedBookings.length} Allotted
                    </span>
                </div>
            </div>

            {/* Pending Bookings Section */}
            <div style={{ marginBottom: "40px" }}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#333", marginBottom: "16px" }}>
                    ⏳ Pending Allotment
                </h2>
                {pendingBookings.length > 0 ? (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Booking ID</th>
                                    <th>User ID</th>
                                    <th>Game</th>
                                    <th>Location</th>
                                    <th>From</th>
                                    <th>To</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingBookings.map((booking) => (
                                    <tr key={booking.bookingId}>
                                        <td><strong>#{booking.bookingId}</strong></td>
                                        <td>User #{booking.userId}</td>
                                        <td>{getGameName(booking.gameId)}</td>
                                        <td>{booking.bookingLocation}</td>
                                        <td>{formatDate(booking.bookingStartTime)}</td>
                                        <td>{formatDate(booking.bookingEndTime)}</td>
                                        <td>
                                            <button
                                                className="admin-btn-success"
                                                onClick={() => handleAllotClick(booking)}
                                            >
                                                ✓ Allot
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="empty-state" style={{ padding: "40px" }}>
                        <div className="empty-state-icon">✅</div>
                        <p className="empty-state-text">No pending bookings</p>
                    </div>
                )}
            </div>

            {/* Allotted Bookings Section */}
            <div>
                <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#333", marginBottom: "16px" }}>
                    ✅ Allotted Bookings
                </h2>
                {allottedBookings.length > 0 ? (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Booking ID</th>
                                    <th>Allotment ID</th>
                                    <th>User ID</th>
                                    <th>Game</th>
                                    <th>Location</th>
                                    <th>From</th>
                                    <th>To</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allottedBookings.map((booking) => (
                                    <tr key={booking.bookingId}>
                                        <td><strong>#{booking.bookingId}</strong></td>
                                        <td>
                                            <span className="status-badge allotted">
                                                #{booking.allotmentId}
                                            </span>
                                        </td>
                                        <td>User #{booking.userId}</td>
                                        <td>{getGameName(booking.gameId)}</td>
                                        <td>{booking.bookingLocation}</td>
                                        <td>{formatDate(booking.bookingStartTime)}</td>
                                        <td>{formatDate(booking.bookingEndTime)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="empty-state" style={{ padding: "40px" }}>
                        <div className="empty-state-icon">📋</div>
                        <p className="empty-state-text">No allotted bookings yet</p>
                    </div>
                )}
            </div>

            {/* All Bookings Cards */}
            <div style={{ marginTop: "40px" }}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#333", marginBottom: "16px" }}>
                    📊 All Bookings Overview
                </h2>
                {filteredBookings.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📅</div>
                        <p className="empty-state-text">No bookings found{selectedLocation ? ` for ${selectedLocation}` : ''}</p>
                    </div>
                ) : (
                    <div className="cards-grid">
                        {filteredBookings.map((booking) => (
                            <div key={booking.bookingId} className="admin-card">
                                <div className="card-header">
                                    <h3 className="card-title">Booking #{booking.bookingId}</h3>
                                    {booking.allotmentId ? (
                                        <span className="status-badge allotted">Allotted</span>
                                    ) : (
                                        <span className="status-badge pending">Pending</span>
                                    )}
                                </div>
                                <div className="card-detail">
                                    <span className="card-detail-icon">🎮</span>
                                    {getGameName(booking.gameId)}
                                </div>
                                <div className="card-detail">
                                    <span className="card-detail-icon">📍</span>
                                    {booking.bookingLocation}
                                </div>
                                <div className="card-detail">
                                    <span className="card-detail-icon">👤</span>
                                    User #{booking.userId}
                                </div>
                                <div className="card-detail">
                                    <span className="card-detail-icon">�</span>
                                    From: {formatDate(booking.bookingStartTime)}
                                </div>
                                <div className="card-detail">
                                    <span className="card-detail-icon">🕑</span>
                                    To: {formatDate(booking.bookingEndTime)}
                                </div>
                                {booking.allotmentId && (
                                    <div className="card-detail" style={{ color: "#28a745", fontWeight: "600" }}>
                                        <span className="card-detail-icon">✅</span>
                                        Allotment #{booking.allotmentId}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Allot Confirmation Modal */}
            {showAllotModal && selectedBooking && (
                <div className="modal-overlay" onClick={() => setShowAllotModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">Confirm Allotment</h2>
                            <button
                                className="modal-close"
                                onClick={() => setShowAllotModal(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <div style={{ marginBottom: "24px" }}>
                            <p style={{ color: "#666", marginBottom: "16px" }}>
                                Are you sure you want to allot this booking?
                            </p>
                            <div className="admin-card" style={{ marginBottom: "0" }}>
                                <div className="card-detail">
                                    <span className="card-detail-icon">🎫</span>
                                    Booking #{selectedBooking.bookingId}
                                </div>
                                <div className="card-detail">
                                    <span className="card-detail-icon">🎮</span>
                                    {getGameName(selectedBooking.gameId)}
                                </div>
                                <div className="card-detail">
                                    <span className="card-detail-icon">📍</span>
                                    {selectedBooking.bookingLocation}
                                </div>
                                <div className="card-detail">
                                    <span className="card-detail-icon">👤</span>
                                    User #{selectedBooking.userId}
                                </div>
                            </div>
                        </div>
                        <div className="form-actions">
                            <button
                                type="button"
                                className="admin-btn-secondary"
                                onClick={() => setShowAllotModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="admin-btn-success"
                                onClick={handleAllotConfirm}
                                disabled={allotBookingMutation.isPending}
                            >
                                {allotBookingMutation.isPending ? "Processing..." : "✓ Confirm Allotment"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingsManagement;
