import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const VITE_OAUTH_LOGIN_URL = import.meta.env.VITE_OAUTH_LOGIN_URL;

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">Cognizant</span>
        </Link>

        <div className="navbar-right">
          <button className="login-btn" onClick={() => window.location.href = VITE_OAUTH_LOGIN_URL}>
            Login
          </button>
          <button className="register-btn" onClick={() => navigate('/register')}>
            Register
          </button>
          <button className="register-btn" onClick={() => navigate('/admin')}>
            Admin
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
