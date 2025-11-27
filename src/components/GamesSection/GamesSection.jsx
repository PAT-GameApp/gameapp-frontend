import GameCard from '../GameCard/GameCard';
import './GamesSection.css';

const games = [
  {
    id: 1,
    name: 'Table Tennis',
    icon: '🏓',
    description: 'Book TT tables and find players'
  },
  {
    id: 2,
    name: 'Carrom',
    icon: '🎯',
    description: 'Classic board game sessions'
  },
  {
    id: 3,
    name: 'Chess',
    icon: '♟️',
    description: 'Strategic matches with colleagues'
  },
  {
    id: 4,
    name: 'Foosball',
    icon: '⚽',
    description: 'Fast-paced table football'
  },
  {
    id: 5,
    name: 'Pool',
    icon: '🎱',
    description: 'Billiards and pool games'
  }
];

const GamesSection = () => {
  return (
    <section className="games-section">
      <div className="games-container">
        <div className="games-header">
          <h2 className="games-title">Available Games</h2>
          <a href="#" className="see-all-link">
            SEE ALL GAMES →
          </a>
        </div>
        
        <div className="games-grid">
          {games.map((game) => (
            <GameCard
              key={game.id}
              name={game.name}
              icon={game.icon}
              description={game.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default GamesSection;
