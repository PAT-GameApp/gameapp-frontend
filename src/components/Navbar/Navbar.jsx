import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">Cognizant</span>
        </Link>
        
        <div className="navbar-right">
          <button className="login-btn" onClick={() => navigate('/login')}>
            Login
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
