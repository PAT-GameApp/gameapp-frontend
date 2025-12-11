import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getGamesByLocation } from "../../services/api";
import useLocationStore from "../../store/useLocationStore";
import GameCard from "../GameCard/GameCard";
import BookingModal from "../BookingModal/BookingModal";
import "./GamesSection.css";

const GamesSection = () => {
  const navigate = useNavigate();
  const selectedLocation = useLocationStore((state) => state.selectedLocation);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const {
    data: games,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["games", selectedLocation?.city],
    queryFn: () => getGamesByLocation(selectedLocation?.city),
    enabled: !!selectedLocation, // Only fetch when location is selected
  });

  const handleBookClick = (game) => {
    // Check if user is logged in
    const userId = localStorage.getItem("userId");
    if (!userId) {
      // Redirect to login if not authenticated
      navigate("/login");
      return;
    }

    // Show booking modal
    setSelectedGame(game);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedGame(null);
  };

  const handleBookingSuccess = () => {
    // Optionally show a success message or notification
    console.log("Booking created successfully!");
  };

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
                key={game.gameId}
                gameId={game.gameId}
                name={game.gameName}
                players={game.numberOfPlayers}
                location={game.location?.city}
                onBookClick={handleBookClick}
              />
            ))
          ) : (
            <div className="games-message">
              <p>No games available in this location</p>
            </div>
          )}
        </div>
      </div>

      {showModal && selectedGame && (
        <BookingModal
          game={selectedGame}
          location={selectedLocation}
          userId={localStorage.getItem("userId")}
          onClose={handleCloseModal}
          onSuccess={handleBookingSuccess}
        />
      )}
    </section>
  );
};

export default GamesSection;
