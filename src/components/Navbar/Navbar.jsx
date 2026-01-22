<<<<<<< Updated upstream
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
=======
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import useAuthStore from "../../store/useAuthStore";
import "./Navbar.css";

const VITE_OAUTH_LOGIN_URL = import.meta.env.VITE_OAUTH_LOGIN_URL;
const VITE_OAUTH_LOGOUT_URL = import.meta.env.VITE_OAUTH_LOGOUT_URL;
const VITE_OAUTH_REGISTER_URL = import.meta.env.VITE_OAUTH_REGISTER_URL;
const VITE_NOTIFICATION_SERVICE_URL =
  import.meta.env.VITE_NOTIFICATION_SERVICE_URL || "http://localhost:8089";

// If your gateway routes notification-service under a prefix, set it here.
// Examples:
// - "" (root)
// - "/notification-service"
// - "/api/notification"
const VITE_NOTIFICATION_PATH_PREFIX =
  import.meta.env.VITE_NOTIFICATION_PATH_PREFIX || "";

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, role, logout } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(false); // Track if there are notifications
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const eventSourceRef = useRef(null);

  const isAdmin = role === "ADMIN";
  const isUser = role === "USER";

  // Some environments may not populate userId; for local dev/testing we fall back to "anonymous".
  const userId = localStorage.getItem("userId") || "anonymous";

  const fetchLatestNotifications = async () => {
    try {
      const response = await fetch(
        `${VITE_NOTIFICATION_SERVICE_URL}${VITE_NOTIFICATION_PATH_PREFIX}/notifications/latest?limit=20`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch notifications: ${response.status}`);
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setNotifications(data);
        setHasNotifications(data.length > 0);
      }
    } catch (e) {
      console.error("Failed to fetch latest notifications", e);
    }
  };

  useEffect(() => {
    // Create SSE connection only when logged in
    if (!isLoggedIn || !userId) {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      return;
    }

    // Close any old connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    const streamUrl = `${VITE_NOTIFICATION_SERVICE_URL}${VITE_NOTIFICATION_PATH_PREFIX}/notifications/stream?userId=${encodeURIComponent(
      userId,
    )}`;

    const es = new EventSource(streamUrl);
    eventSourceRef.current = es;

    es.addEventListener("INIT", () => {
      // connection established
    });

    // Matches backend event name BOOKING_NOTIFICATION
    es.addEventListener("BOOKING_NOTIFICATION", (event) => {
      try {
        const payload = JSON.parse(event.data);
        setNotifications((prev) => [payload, ...prev].slice(0, 20));
      } catch {
        // fallback if backend sends non-JSON
        setNotifications((prev) =>
          [{ id: crypto.randomUUID(), message: event.data }, ...prev].slice(
            0,
            20,
          ),
        );
      }
      setHasNotifications(true);
    });

    es.onerror = (err) => {
      console.error("SSE connection error", err);
      // browser will auto-retry; we don't close to allow reconnect
    };

    // Also load history once on login
    fetchLatestNotifications();

    return () => {
      es.close();
      if (eventSourceRef.current === es) {
        eventSourceRef.current = null;
      }
    };
  }, [isLoggedIn, userId]);

  const handleLogout = async () => {
    try {
      await fetch(VITE_OAUTH_LOGOUT_URL, {
        method: "GET",
        credentials: "include", // Important to send cookies for session invalidation
      });
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      localStorage.clear(); // Clear all local storage
      logout(); // Update store
      window.location.href = "/"; // Redirect to frontend homepage
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

>>>>>>> Stashed changes
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">Cognizant</span>
        </Link>
<<<<<<< Updated upstream
        
        <div className="navbar-right">
          <button className="login-btn" onClick={() => navigate('/login')}>
            Login
          </button>
=======

        <div className="navbar-right">
          {!isLoggedIn ? (
            <>
              <button
                className="login-btn"
                onClick={() => (window.location.href = VITE_OAUTH_LOGIN_URL)}
              >
                Login
              </button>
              <button
                className="register-btn"
                onClick={() => (window.location.href = VITE_OAUTH_REGISTER_URL)}
              >
                Register
              </button>
            </>
          ) : (
            <>
              {/* Notification icon - only show after login */}
              <button
                className="navbar-icon-btn"
                aria-label="Notifications"
                onClick={async () => {
                  setShowNotifications((prev) => !prev);
                  setHasNotifications(false);
                  await fetchLatestNotifications();
                }}
              >
                <span className="bell-icon">🔔</span>
                {hasNotifications && (
                  <span className="notification-badge"></span>
                )}
              </button>

              {showNotifications && (
                <div className="notifications-dropdown">
                  <div className="notifications-header">Notifications</div>
                  {notifications.length === 0 ? (
                    <div className="notifications-empty">No notifications</div>
                  ) : (
                    <div className="notifications-list">
                      {notifications.slice(0, 8).map((n) => (
                        <div
                          className="notifications-item"
                          key={n.id || n.timestamp || n.message}
                        >
                          <div
                            className={
                              n.message &&
                              n.message.startsWith(
                                "Booking created successfully",
                              )
                                ? "notifications-message success"
                                : "notifications-message"
                            }
                          >
                            {n.message || String(n)}
                          </div>
                          {n.timestamp && (
                            <div className="notifications-time">
                              {new Date(n.timestamp).toLocaleString()}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="profile-menu">
                <button className="profile-btn" onClick={toggleDropdown}>
                  Profile
                </button>
                {showDropdown && (
                  <div className="dropdown">
                    {isAdmin && (
                      <button
                        className="dropdown-item"
                        onClick={() => {
                          navigate("/admin");
                          setShowDropdown(false);
                        }}
                      >
                        Admin
                      </button>
                    )}
                    {(isAdmin || isUser) && (
                      <button className="dropdown-item" onClick={handleLogout}>
                        Logout
                      </button>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
>>>>>>> Stashed changes
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
