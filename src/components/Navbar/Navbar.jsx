import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const VITE_OAUTH_LOGIN_URL = import.meta.env.VITE_OAUTH_LOGIN_URL;
const VITE_OAUTH_LOGOUT_URL = import.meta.env.VITE_OAUTH_LOGOUT_URL;
const VITE_OAUTH_REGISTER_URL = import.meta.env.VITE_OAUTH_REGISTER_URL;

const Navbar = () => {
  const navigate = useNavigate();

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
      window.location.href = "/"; // Redirect to frontend homepage
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">Cognizant</span>
        </Link>

        <div className="navbar-right">
          <button
            className="login-btn"
            onClick={() => (window.location.href = VITE_OAUTH_LOGIN_URL)}
          >
            Login
          </button>
          <button className="register-btn" onClick={handleLogout}>
            Logout
          </button>
          <button
            className="register-btn"
            onClick={() => (window.location.href = VITE_OAUTH_REGISTER_URL)}
          >
            Register
          </button>
          <button className="register-btn" onClick={() => navigate("/admin")}>
            Admin
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
