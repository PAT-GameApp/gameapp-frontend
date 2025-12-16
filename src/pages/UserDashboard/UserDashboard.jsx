import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import GamesSection from "../../components/GamesSection/GamesSection";
import LocationModal from "../../components/LocationModal/LocationModal";
import useLocationStore from "../../store/useLocationStore";
import { useQuery } from "@tanstack/react-query";
import { getAllBookings, getAllGames } from "../../services/api";
import "./UserDashboard.css";

const UserDashboard = () => {
    const [activeSection, setActiveSection] = useState("bookings");
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const selectedLocation = useLocationStore((state) => state.selectedLocation);
    const userId = localStorage.getItem("userId");

    // Redirect to login if userId is not present
    if (!userId) {
        return <Navigate to="/login" replace />;
    }

    // Bookings Component
    const MyBookings = () => {
        const {
            data: bookings = [],
            isLoading: isLoadingBookings,
            isError: isErrorBookings,
            error: bookingsError,
        } = useQuery({
            queryKey: ["bookings"],
            queryFn: getAllBookings,
        });

        const { data: games = [] } = useQuery({
            queryKey: ["games"],
            queryFn: getAllGames,
        });

        // Filter bookings for the current user
        const userBookings = bookings.filter(
            (booking) => String(booking.userId) === String(userId)
        );

        const getGameName = (gameId) => {
            const game = games.find((g) => g.gameId === gameId);
            return game ? game.gameName : "Unknown Game";
        };

        if (isLoadingBookings) {
            return (
                <div className="user-section">
                    <div className="empty-state">
                        <div className="empty-state-icon">⏳</div>
                        <p className="empty-state-text">Loading your bookings...</p>
                    </div>
                </div>
            );
        }

        if (isErrorBookings) {
            return (
                <div className="user-section">
                    <div className="empty-state">
                        <div className="empty-state-icon">❌</div>
                        <p className="empty-state-text">Error loading bookings: {bookingsError?.message}</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="user-section">
                <div className="user-section-header">
                    <h1 className="user-section-title">My Bookings</h1>
                </div>

                {userBookings.length > 0 ? (
                    <div className="user-table-container">
                        <table className="user-table">
                            <thead>
                                <tr>
                                    <th>Booking ID</th>
                                    <th>Game</th>
                                    <th>Location</th>
                                    <th>Start Time</th>
                                    <th>End Time</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userBookings.map((booking) => (
                                    <tr key={booking.bookingId}>
                                        <td><strong>#{booking.bookingId}</strong></td>
                                        <td>{getGameName(booking.gameId)}</td>
                                        <td>{booking.bookingLocation}</td>
                                        <td>{new Date(booking.bookingStartTime).toLocaleString()}</td>
                                        <td>{new Date(booking.bookingEndTime).toLocaleString()}</td>
                                        <td>
                                            {booking.allotmentId ? (
                                                <span className="status-badge allotted">Allotted</span>
                                            ) : (
                                                <span className="status-badge pending">Pending</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">📅</div>
                        <p className="empty-state-text">You have no bookings yet.</p>
                    </div>
                )}
            </div>
        );
    };

    const renderSection = () => {
        switch (activeSection) {
            case "games":
                return (
                    <div className="user-section">
                        <div className="user-section-header">
                            <h1 className="user-section-title">All Games</h1>
                        </div>
                        <GamesSection />
                    </div>
                );
            case "bookings":
                return <MyBookings />;
            default:
                return <MyBookings />;
        }
    };

    return (
        <div className="user-page">
            <Navbar />
            <div className="user-container">
                {/* User Header */}
                <div className="user-header">
                    <h1 className="user-header-title">User Dashboard</h1>
                </div>

                <aside className="user-sidebar">
                    <div className="sidebar-header">
                        <h2>User Panel</h2>
                    </div>

                    {/* Location Selector in Sidebar */}
                    <div className="sidebar-location-wrapper">
                        <button
                            className="sidebar-location-selector"
                            onClick={() => setIsLocationModalOpen(true)}
                        >
                            <span className="location-icon">📍</span>
                            <span className="location-text">
                                {selectedLocation ? `${selectedLocation.office}, ${selectedLocation.city}` : "Select Location"}
                            </span>
                            <span className="dropdown-arrow">▼</span>
                        </button>
                        <LocationModal
                            isOpen={isLocationModalOpen}
                            onClose={() => setIsLocationModalOpen(false)}
                        />
                    </div>

                    <nav className="sidebar-nav">
                        <button
                            className={`sidebar-item ${activeSection === "bookings" ? "active" : ""}`}
                            onClick={() => setActiveSection("bookings")}
                        >
                            <span className="sidebar-icon">📅</span>
                            My Bookings
                        </button>
                        <button
                            className={`sidebar-item ${activeSection === "games" ? "active" : ""}`}
                            onClick={() => setActiveSection("games")}
                        >
                            <span className="sidebar-icon">🎮</span>
                            All Games
                        </button>
                    </nav>
                </aside>
                <main className="user-main">
                    {renderSection()}
                </main>
            </div>
        </div>
    );
};

export default UserDashboard;
