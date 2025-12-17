import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import useAuthStore from "../../store/useAuthStore";
import "./Navbar.css";

const VITE_OAUTH_LOGIN_URL = import.meta.env.VITE_OAUTH_LOGIN_URL;
const VITE_OAUTH_LOGOUT_URL = import.meta.env.VITE_OAUTH_LOGOUT_URL;
const VITE_OAUTH_REGISTER_URL = import.meta.env.VITE_OAUTH_REGISTER_URL;

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, role, logout } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);

  const isAdmin = role === "ADMIN";
  const isUser = role === "USER";

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

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">Cognizant</span>
        </Link>

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
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
