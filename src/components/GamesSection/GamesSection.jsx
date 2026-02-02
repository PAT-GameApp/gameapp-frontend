import { useState, useRef, useEffect } from "react";
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
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const {
    data: games,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["games", selectedLocation?.locationId],
    queryFn: () => getGamesByLocation(selectedLocation?.locationId),
    enabled: !!selectedLocation, // Only fetch when location is selected
  });

  useEffect(() => {
    checkScrollButtons();
  }, [games]);

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 390; // card width + gap
      const newScrollLeft =
        direction === "left"
          ? scrollRef.current.scrollLeft - scrollAmount
          : scrollRef.current.scrollLeft + scrollAmount;

      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });

      setTimeout(checkScrollButtons, 400);
    }
  };
  const handleBookClick = (game) => {
    // Check if user is logged in
    const userId = localStorage.getItem("userId");
    if (!userId) {
      // Redirect to login if not authenticated
      navigate("/login");
      return;
    }

    console.log('Game clicked:', game);
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
          <h2 className="games-title">🎮 Available Games</h2>
          <p
            style={{
              color: "#667eea",
              fontSize: "1.2rem",
              fontWeight: "600",
              marginTop: "12px",
              opacity: 0.9,
            }}
          >
          
          </p>
        </div>

        <div className="games-grid">
          {!selectedLocation ? (
            <div className="games-message">
              <p>📍 Please select a location to view available games</p>
            </div>
          ) : isLoading ? (
            <div className="games-message">
              <p>🎲 Loading games...</p>
            </div>
          ) : isError ? (
            <div className="games-message">
              <p>❌ Error loading games. Please try again.</p>
            </div>
          ) : games && games.length > 0 ? (
            <div className="games-grid-wrapper">
              {canScrollLeft && (
                <button
                  className="scroll-button left"
                  onClick={() => scroll("left")}
                  aria-label="Scroll left"
                >
                  ‹
                </button>
              )}

              <div
                className="games-grid"
                ref={scrollRef}
                onScroll={checkScrollButtons}
              >                {games.map((game, index) => (
                  <div key={game.gameId} className="game-card-wrapper">
                    <GameCard
                      gameId={game.gameId}
                      name={game.gameName}
                      players={game.numberOfPlayers}
                      floor={game.gameFloor}
                      onBookClick={handleBookClick}
                    />
                  </div>
                ))}
              </div>

              {canScrollRight && (
                <button
                  className="scroll-button right"
                  onClick={() => scroll("right")}
                  aria-label="Scroll right"
                >
                  ›
                </button>
              )}

              {games.length > 3 && (
                <div className="scroll-hint">Swipe to explore more games</div>
              )}
            </div>
          ) : (
            <div className="games-message">
              <p>😕 No games available in this location</p>
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
