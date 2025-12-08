import './GameCard.css';

const GameCard = ({ gameId, name, players, location, onBookClick }) => {
  const handleBookClick = (e) => {
    e.stopPropagation();
    onBookClick?.({ gameId, gameName: name, numberOfPlayers: players });
  };

  return (
    <div className="game-card">
      <div className="game-card-header">
        <h3 className="game-name">{name}</h3>
      </div>
      <div className="game-card-content">
        <div className="game-players">
          <span className="players-icon">👥</span>
          <span className="players-count">{players} Players</span>
        </div>
        <button className="book-now-btn" onClick={handleBookClick}>
          Book Now
        </button>
      </div>
    </div>
  );
};

export default GameCard;
