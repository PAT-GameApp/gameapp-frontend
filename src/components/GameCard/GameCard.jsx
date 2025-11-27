import './GameCard.css';

const GameCard = ({ name, icon, description }) => {
  return (
    <div className="game-card">
      <div className="game-card-image">
        <span className="game-icon">{icon}</span>
      </div>
      <div className="game-card-content">
        <h3 className="game-name">{name}</h3>
        <p className="game-description">{description}</p>
      </div>
    </div>
  );
};

export default GameCard;
