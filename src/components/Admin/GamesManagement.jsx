import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllGames, getGamesByLocation, createGame, getLocations } from "../../services/api";

const GamesManagement = ({ selectedLocation }) => {
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState("view");
  const [formData, setFormData] = useState({
    gameName: "",
    gameInfo: "",
    locationId: "",
    gameFloor: "",
    numberOfPlayers: "",
  });

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // Fetch locations
  const { data: locations = [] } = useQuery({
    queryKey: ["locations"],
    queryFn: getLocations,
  });

  // Extract unique countries
  const countries = useMemo(() => {
    if (!locations) return [];
    return [...new Set(locations.map((loc) => loc.country))].sort();
  }, [locations]);

  // Extract cities for selected country
  const cities = useMemo(() => {
    if (!selectedCountry || !locations) return [];
    return [
      ...new Set(
        locations
          .filter((loc) => loc.country === selectedCountry)
          .map((loc) => loc.city)
      ),
    ].sort();
  }, [locations, selectedCountry]);

  // Extract offices for selected city
  const offices = useMemo(() => {
    if (!selectedCity || !locations) return [];
    return locations
      .filter((loc) => loc.city === selectedCity)
      .sort((a, b) => a.office.localeCompare(b.office));
  }, [locations, selectedCity]);

  // Fetch games using React Query - conditionally by location
  const {
    data: games = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["games", selectedLocation?.locationId],
    queryFn: () => (selectedLocation && selectedLocation.locationId) ? getGamesByLocation(selectedLocation.locationId) : getAllGames(),
  });

  // Create game mutation
  const createGameMutation = useMutation({
    mutationFn: createGame,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
      setFormData({
        gameName: "",
        gameInfo: "",
        locationId: "",
        gameFloor: "",
        numberOfPlayers: "",
      });
      setShowCreateModal(false);
      setSelectedCountry("");
      setSelectedCity("");
    },
    onError: (error) => {
      console.error("Failed to create game:", error);
    },
  });

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
    setSelectedCity("");
    setFormData((prev) => ({ ...prev, locationId: "" }));
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    setFormData((prev) => ({ ...prev, locationId: "" }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateGame = async (e) => {
    e.preventDefault();
    createGameMutation.mutate({
      ...formData,
      gameFloor: formData.gameFloor,
      locationId: parseInt(formData.locationId),
      numberOfPlayers: parseInt(formData.numberOfPlayers),
    });
  };

  if (isLoading) {
    return (
      <div className="admin-section">
        <div className="admin-section-header">
          <h1 className="admin-section-title">🎮 Games Management</h1>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">⏳</div>
          <p className="empty-state-text">Loading games...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="admin-section">
        <div className="admin-section-header">
          <h1 className="admin-section-title">🎮 Games Management</h1>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">❌</div>
          <p className="empty-state-text">Error loading games: {error?.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h1 className="admin-section-title">🎮 Games Management</h1>
        <button
          className="admin-btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          <span>+</span> Create New Game
        </button>
      </div>

      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === "view" ? "active" : ""}`}
          onClick={() => setActiveTab("view")}
        >
          View All Games
        </button>
        <button
          className={`admin-tab ${activeTab === "cards" ? "active" : ""}`}
          onClick={() => setActiveTab("cards")}
        >
          Card View
        </button>
      </div>

      {activeTab === "view" ? (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Game Name</th>
                <th>Location</th>
                <th>Floor</th>
                <th>Players</th>
                <th>Info</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {games.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <div className="empty-state">
                      <div className="empty-state-icon">🎮</div>
                      <p className="empty-state-text">No games found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                games.map((game) => (
                  <tr key={game.gameId}>
                    <td>#{game.gameId}</td>
                    <td>
                      <strong>{game.gameName}</strong>
                    </td>
                    <td>{game.location?.city}</td>
                    <td>Floor {game.gameFloor}</td>
                    <td>{game.numberOfPlayers} players</td>
                    <td>{game.gameInfo || "—"}</td>
                    <td>
                      <button className="admin-btn-secondary">View</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="cards-grid">
          {games.length === 0 ? (
            <div className="empty-state" style={{ gridColumn: "1 / -1" }}>
              <div className="empty-state-icon">🎮</div>
              <p className="empty-state-text">No games found</p>
            </div>
          ) : (
            games.map((game) => (
              <div key={game.gameId} className="admin-card">
                <div className="card-header">
                  <h3 className="card-title">{game.gameName}</h3>
                  <span className="card-icon">🎮</span>
                </div>
                <div className="card-detail">
                  <span className="card-detail-icon">📍</span>
                  {game.location?.city}
                </div>
                <div className="card-detail">
                  <span className="card-detail-icon">🏢</span>
                  Floor {game.gameFloor}
                </div>
                <div className="card-detail">
                  <span className="card-detail-icon">👥</span>
                  {game.numberOfPlayers} players
                </div>
                {game.gameInfo && (
                  <div className="card-detail">
                    <span className="card-detail-icon">ℹ️</span>
                    {game.gameInfo}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Create Game Modal */}
      {showCreateModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowCreateModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Create New Game</h2>
              <button
                className="modal-close"
                onClick={() => setShowCreateModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateGame}>
              <div className="form-group">
                <label className="form-label">Game Name *</label>
                <input
                  type="text"
                  name="gameName"
                  className="form-input"
                  placeholder="e.g., Snooker"
                  value={formData.gameName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Country *</label>
                <select
                  className="form-input"
                  value={selectedCountry}
                  onChange={handleCountryChange}
                  required
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">City *</label>
                <select
                  className="form-input"
                  value={selectedCity}
                  onChange={handleCityChange}
                  disabled={!selectedCountry}
                  required
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Office *</label>
                <select
                  name="locationId"
                  className="form-input"
                  value={formData.locationId}
                  onChange={handleInputChange}
                  disabled={!selectedCity}
                  required
                >
                  <option value="">Select Office</option>
                  {offices.map((loc) => (
                    <option key={loc.locationId} value={loc.locationId}>
                      {loc.office}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Floor *</label>
                <input
                  type="text"
                  name="gameFloor"
                  className="form-input"
                  placeholder="e.g., 2"
                  value={formData.gameFloor}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Number of Players *</label>
                <input
                  type="number"
                  name="numberOfPlayers"
                  className="form-input"
                  placeholder="e.g., 4"
                  value={formData.numberOfPlayers}
                  onChange={handleInputChange}
                  required
                  min="1"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Game Info</label>
                <input
                  type="text"
                  name="gameInfo"
                  className="form-input"
                  placeholder="Optional description"
                  value={formData.gameInfo}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="admin-btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn-primary"
                  disabled={createGameMutation.isPending}
                >
                  {createGameMutation.isPending ? "Creating..." : "Create Game"}
                </button>
              </div>
            </form>
          </div>
        </div >
      )}
    </div >
  );
};

export default GamesManagement;
