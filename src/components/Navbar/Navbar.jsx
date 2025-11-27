import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">Cognizant</span>
        </Link>
        
        <div className="navbar-right">
          <button className="login-btn">
            Login
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
