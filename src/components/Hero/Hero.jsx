import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <div className="location-selector">
            <span className="location-icon">📍</span>
            <span className="location-text">Bangalore</span>
            <span className="dropdown-icon">▼</span>
          </div>
          
          <h1 className="hero-title">
            BOOK GAME TABLES.
            <br />
            JOIN GAMES.
            <br />
            CONNECT WITH COLLEAGUES.
          </h1>
          
          <p className="hero-description">
            Cognizant's Sports Community to Book Game Tables, 
            Find Players, and Join Games at your Office.
          </p>
        </div>
        
        <div className="hero-images">
          <div className="image-grid">
            <div className="image-placeholder large">
              <span>🏓</span>
            </div>
            <div className="image-placeholder medium">
              <span>🎯</span>
            </div>
            <div className="image-placeholder small">
              <span>♟️</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
