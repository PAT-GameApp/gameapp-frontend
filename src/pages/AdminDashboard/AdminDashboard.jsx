import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "../../components/Navbar/Navbar";
import GamesManagement from "../../components/Admin/GamesManagement";
import InventoryManagement from "../../components/Admin/InventoryManagement";
import BookingsManagement from "../../components/Admin/BookingsManagement";
import useLocationStore from "../../store/useLocationStore";
import LocationModal from "../../components/LocationModal/LocationModal";
import "./AdminDashboard.css";

const AdminDashboard = () => {
    const [activeSection, setActiveSection] = useState("games");
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const selectedLocation = useLocationStore((state) => state.selectedLocation);

    const renderSection = () => {
        switch (activeSection) {
            case "games":
                return <GamesManagement selectedLocation={selectedLocation} />;
            case "inventory":
                return <InventoryManagement selectedLocation={selectedLocation} />;
            case "bookings":
                return <BookingsManagement selectedLocation={selectedLocation} />;
            default:
                return <GamesManagement selectedLocation={selectedLocation} />;
        }
    };

    return (
        <div className="admin-page">
            <Navbar />
            <div className="admin-container">
                {/* Admin Header */}
                <div className="admin-header">
                    <h1 className="admin-header-title">Admin Dashboard</h1>
                </div>
                <aside className="admin-sidebar">
                    <div className="sidebar-header">
                        <h2>Admin Panel</h2>
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
                            className={`sidebar-item ${activeSection === "games" ? "active" : ""}`}
                            onClick={() => setActiveSection("games")}
                        >
                            <span className="sidebar-icon">🎮</span>
                            Manage Games
                        </button>
                        <button
                            className={`sidebar-item ${activeSection === "inventory" ? "active" : ""}`}
                            onClick={() => setActiveSection("inventory")}
                        >
                            <span className="sidebar-icon">📦</span>
                            Manage Inventory
                        </button>
                        <button
                            className={`sidebar-item ${activeSection === "bookings" ? "active" : ""}`}
                            onClick={() => setActiveSection("bookings")}
                        >
                            <span className="sidebar-icon">📅</span>
                            Manage Bookings
                        </button>
                    </nav>
                </aside>
                <main className="admin-main">
                    {renderSection()}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
