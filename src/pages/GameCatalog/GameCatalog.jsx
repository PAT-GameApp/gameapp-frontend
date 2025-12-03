import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gameService from '../../services/gameService';
import authService from '../../services/authService';
import './GameCatalog.css';

const gameIcons = {
  'Table Tennis': '🏓',
  'Carrom': '🎯',
  'Chess': '♟️',
  'Foosball': '⚽',
  'Billiards': '🎱',
  'Pool': '🎱',
};

const gameImages = {
  'Table Tennis': '/assets/images/table-tennis.jpg',
  'Carrom': '/assets/images/carrom.webp',
  'Chess': '/assets/images/chess.jpg',
  'Foosball': '/assets/images/foosball.jpg',
  'Billiards': '/assets/images/billiards.jpg',
  'Pool': '/assets/images/pool.jpg',
  'Shuttle': '/assets/images/shuttle.jpg',
  'Badminton': '/assets/images/badminton.jpg',
};

const gameColors = {
  'Table Tennis': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'Carrom': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'Chess': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'Foosball': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'Billiards': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'Pool': 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
};

const GameCatalog = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGames();
  }, []);
  const fetchGames = async () => {
    setLoading(true);
    try {
      const data = await gameService.getAllGames();
      setGames(data);
    } catch (err) {
      // For testing, use mock data if API fails
      setGames([
        { game_id: 1, game_name: 'Table Tennis', game_locations: 'Floor 1', game_numPlayers: '2-4' },
        { game_id: 2, game_name: 'Carrom', game_locations: 'Floor 2', game_numPlayers: '2-4' },
        { game_id: 3, game_name: 'Chess', game_locations: 'Floor 1', game_numPlayers: '2' },
        { game_id: 4, game_name: 'Foosball', game_locations: 'Floor 3', game_numPlayers: '2-4' },
        { game_id: 5, game_name: 'Billiards', game_locations: 'Floor 2', game_numPlayers: '2' },
        { game_id: 6, game_name: 'Pool', game_locations: 'Floor 3', game_numPlayers: '2-8' },
      ]);
      console.log('Using mock data for games');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="loading">Loading games...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }
  return (
    <div className="game-catalog">
      <header className="catalog-header">        <div className="header-left">
          <img 
            src="/assets/images/Cognizant-Logo.jpg" 
            alt="Cognizant" 
            className="cognizant-logo"
          />
          <h1>Game Venues</h1>
        </div>
        <div className="header-right">
          <button className="notification-btn" title="Notifications">
            <span className="notification-icon">🔔</span>
          </button>
        </div>
      </header>

      <main className="catalog-main">        <div className="games-grid">
          {games.map((game) => {
            const icon = gameIcons[game.game_name] || '🎮';
            const image = gameImages[game.game_name];
            const gradient = gameColors[game.game_name] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            return (
              <div key={game.game_id} className="game-card">                <div className="game-image-container" style={{ background: gradient }}>
                  {image && (
                    <img 
                      src={image} 
                      alt={game.game_name} 
                      className="game-image"
                      onError={(e) => { 
                        console.log(`Failed to load image: ${image}`);
                        e.target.style.display = 'none'; 
                      }}
                    />
                  )}
                  <div className="game-icon-overlay">
                    <span className="game-icon-large">{icon}</span>
                  </div>
                </div>
                <div className="game-info">
                  <h3 className="game-name">{game.game_name}</h3>
                  <p className="game-description">
                    {game.game_locations && `Location: ${game.game_locations}`}
                    <br />
                    {game.game_numPlayers && `Players: ${game.game_numPlayers}`}
                  </p>
                  <button 
                    className="game-book-btn"
                    onClick={() => navigate('/booking', { 
                      state: { 
                        game: {
                          id: game.game_id,
                          name: game.game_name,
                          icon: icon,
                          locations: game.game_locations,
                          numPlayers: game.game_numPlayers
                        }
                      } 
                    })}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default GameCatalog;
