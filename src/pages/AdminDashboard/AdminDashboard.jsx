import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "../../components/Navbar/Navbar";
import GamesManagement from "../../components/Admin/GamesManagement";
import InventoryManagement from "../../components/Admin/InventoryManagement";
import BookingsManagement from "../../components/Admin/BookingsManagement";
import useLocationStore from "../../store/useLocationStore";
import { getLocations } from "../../services/api";
import "./AdminDashboard.css";

const AdminDashboard = () => {
    const [activeSection, setActiveSection] = useState("games");
    const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedLocation = useLocationStore((state) => state.selectedLocation);
    const setSelectedLocation = useLocationStore((state) => state.setSelectedLocation);

    // Fetch locations for the dropdown
    const { data: locations = [], isLoading: isLoadingLocations } = useQuery({
        queryKey: ["locations"],
        queryFn: getLocations,
    });

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsLocationDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLocationSelect = (location) => {
        setSelectedLocation(location);
        setIsLocationDropdownOpen(false);
    };

    const renderSection = () => {
        switch (activeSection) {
            case "games":
                return <GamesManagement selectedLocation={selectedLocation} locations={locations} />;
            case "inventory":
                return <InventoryManagement selectedLocation={selectedLocation} />;
            case "bookings":
                return <BookingsManagement selectedLocation={selectedLocation} />;
            default:
                return <GamesManagement selectedLocation={selectedLocation} locations={locations} />;
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
                    <div className="sidebar-location-wrapper" ref={dropdownRef}>
                        <button
                            className="sidebar-location-selector"
                            onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                        >
                            <span className="location-icon">📍</span>
                            <span className="location-text">
                                {selectedLocation?.city || "All Locations"}
                            </span>
                            <span className={`dropdown-arrow ${isLocationDropdownOpen ? "open" : ""}`}>
                                ▼
                            </span>
                        </button>
                        {isLocationDropdownOpen && (
                            <div className="sidebar-location-dropdown">
                                <div
                                    className={`location-option ${!selectedLocation ? "selected" : ""}`}
                                    onClick={() => handleLocationSelect(null)}
                                >
                                    <span className="option-icon">🌐</span>
                                    All Locations
                                </div>
                                {isLoadingLocations ? (
                                    <div className="location-option loading">Loading...</div>
                                ) : (
                                    locations.map((location) => (
                                        <div
                                            key={location.locationId}
                                            className={`location-option ${selectedLocation?.locationId === location.locationId ? "selected" : ""}`}
                                            onClick={() => handleLocationSelect(location)}
                                        >
                                            <span className="option-icon">📍</span>
                                            {location.city}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
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
