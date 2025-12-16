import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import GamesSection from "../../components/GamesSection/GamesSection";
import LocationModal from "../../components/LocationModal/LocationModal";
import useLocationStore from "../../store/useLocationStore";
import { useQuery } from "@tanstack/react-query";
import { getAllBookings, getAllGames, getAllotmentById } from "../../services/api";
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
        const [allotmentDetails, setAllotmentDetails] = useState({});
        const [loadingAllotments, setLoadingAllotments] = useState(false);

        const {
            data: bookings = [],
            isLoading: isLoadingBookings,
            isError: isErrorBookings,
            error: bookingsError,
            refetch: refetchBookings,
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

        console.log('=== DEBUG ===');
        console.log('userId:', userId);
        console.log('All bookings:', bookings);
        console.log('User bookings:', userBookings);
        console.log('Allotment details state:', allotmentDetails);

        // Fetch allotment details for bookings that have allotmentId
        useEffect(() => {
            console.log('useEffect triggered, userBookings.length:', userBookings.length);
            
            const fetchAllotmentDetails = async () => {
                const bookingsWithAllotment = userBookings.filter(
                    (booking) => booking.allotmentId
                );

                console.log('Bookings with allotment:', bookingsWithAllotment);

                if (bookingsWithAllotment.length === 0) return;

                setLoadingAllotments(true);
                const newAllotmentDetails = {};

                for (const booking of bookingsWithAllotment) {
                    try {
                        const allotment = await getAllotmentById(booking.allotmentId);
                        console.log(`Fetched allotment ${booking.allotmentId}:`, allotment);
                        newAllotmentDetails[booking.allotmentId] = allotment;
                    } catch (error) {
                        console.error(`Error fetching allotment ${booking.allotmentId}:`, error);
                        newAllotmentDetails[booking.allotmentId] = null;
                    }
                }

                console.log('All allotment details:', newAllotmentDetails);
                setAllotmentDetails(newAllotmentDetails);
                setLoadingAllotments(false);
            };

            if (userBookings.length > 0) {
                fetchAllotmentDetails();
            }
        }, [bookings]);

        // Helper to check if a booking's allotment is returned
        const isAllotmentReturned = (booking) => {
            if (!booking.allotmentId) return false;
            // First check if booking object has returned status
            if (booking.returned !== undefined) return booking.returned;
            // Otherwise check from fetched allotment details
            const allotment = allotmentDetails[booking.allotmentId];
            return allotment?.returned || false;
        };

        // Separate bookings into active and completed
        const activeBookings = userBookings.filter((booking) => {
            // No allotment yet - still active/pending
            if (!booking.allotmentId) return true;
            // Has allotment but not returned - still active
            return !isAllotmentReturned(booking);
        });

        const completedBookings = userBookings.filter((booking) => {
            // Has allotment and is returned - completed
            return booking.allotmentId && isAllotmentReturned(booking);
        });

        const getGameName = (gameId) => {
            const game = games.find((g) => g.gameId === gameId);
            return game ? game.gameName : "Unknown Game";
        };

        const handleReturn = async (booking) => {
            try {
                const response = await fetch(`http://localhost:8089/allotments/${booking.allotmentId}/return`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                });
                if (response.ok) {
                    alert('Equipment returned successfully!');
                    // Update local allotment details
                    setAllotmentDetails(prev => ({
                        ...prev,
                        [booking.allotmentId]: { ...prev[booking.allotmentId], returned: true }
                    }));
                    refetchBookings();
                } else {
                    alert('Failed to return equipment');
                }
            } catch (error) {
                console.error('Error returning equipment:', error);
                alert('Error returning equipment');
            }
        };

        const renderBookingTable = (bookingsList, showReturnButton = false) => (
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
                        {bookingsList.map((booking) => (
                            <tr key={booking.bookingId}>
                                <td><strong>#{booking.bookingId}</strong></td>
                                <td>{getGameName(booking.gameId)}</td>
                                <td>{booking.bookingLocation}</td>
                                <td>{new Date(booking.bookingStartTime).toLocaleString()}</td>
                                <td>{new Date(booking.bookingEndTime).toLocaleString()}</td>
                                <td>
                                    {booking.allotmentId ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            {isAllotmentReturned(booking) ? (
                                                <span className="status-badge returned" style={{ backgroundColor: '#4CAF50', color: 'white' }}>Returned</span>
                                            ) : (
                                                <>
                                                    <span className="status-badge allotted">Allotted</span>
                                                    {showReturnButton && (
                                                        <button
                                                            className="return-btn"
                                                            onClick={() => handleReturn(booking)}
                                                            style={{
                                                                padding: '5px 10px',
                                                                backgroundColor: '#ff4444',
                                                                color: 'white',
                                                                border: 'none',
                                                                borderRadius: '4px',
                                                                cursor: 'pointer',
                                                                fontSize: '0.8rem'
                                                            }}
                                                        >
                                                            Return
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="status-badge pending">Pending</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );

        if (isLoadingBookings || loadingAllotments) {
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
                {/* Active Bookings Section */}
                <div className="user-section-header">
                    <h1 className="user-section-title">Active Bookings</h1>
                </div>

                {activeBookings.length > 0 ? (
                    renderBookingTable(activeBookings, true)
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">📅</div>
                        <p className="empty-state-text">You have no active bookings.</p>
                    </div>
                )}

                {/* Completed/Old Bookings Section */}
                <div className="user-section-header" style={{ marginTop: '40px' }}>
                    <h1 className="user-section-title">Completed Bookings</h1>
                </div>

                {completedBookings.length > 0 ? (
                    renderBookingTable(completedBookings, false)
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">✅</div>
                        <p className="empty-state-text">No completed bookings yet.</p>
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
