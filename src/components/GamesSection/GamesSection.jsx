import { useQuery } from '@tanstack/react-query';
import { getGamesByLocation } from '../../services/api';
import useLocationStore from '../../store/useLocationStore';
import GameCard from '../GameCard/GameCard';
import './GamesSection.css';

const GamesSection = () => {
  const selectedLocation = useLocationStore((state) => state.selectedLocation);

  const { data: games, isLoading, isError } = useQuery({
    queryKey: ['games', selectedLocation],
    queryFn: () => getGamesByLocation(selectedLocation),
    enabled: !!selectedLocation, // Only fetch when location is selected
  });

  return (
    <section className="games-section">
      <div className="games-container">
        <div className="games-header">
          <h2 className="games-title">Available Games</h2>
        </div>

        <div className="games-grid">
          {!selectedLocation ? (
            <div className="games-message">
              <p>Please select a location to view available games</p>
            </div>
          ) : isLoading ? (
            <div className="games-message">
              <p>Loading games...</p>
            </div>
          ) : isError ? (
            <div className="games-message">
              <p>Error loading games. Please try again.</p>
            </div>
          ) : games && games.length > 0 ? (
            games.map((game) => (
              <GameCard
                key={game.game_id}
                name={game.game_name}
                players={game.game_numPlayers}
              />
            ))
          ) : (
            <div className="games-message">
              <p>No games available in this location</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default GamesSection;
