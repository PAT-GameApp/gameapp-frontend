import './GameCard.css';

const GameCard = ({ name, players }) => {
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
      </div>
    </div>
  );
};

export default GameCard;
