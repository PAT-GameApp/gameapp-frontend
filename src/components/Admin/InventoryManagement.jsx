import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllEquipment,
  getAllGames,
  getGamesByLocation,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  getLocations,
} from "../../services/api";
import ModalPortal from "../ModalPortal/ModalPortal";

const InventoryManagement = ({ selectedLocation }) => {
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [editQuantity, setEditQuantity] = useState("");
  const [formData, setFormData] = useState({
    equipmentName: "",
    equipmentQuantity: "",
    gameId: "",
  });

  // Fetch equipment using React Query
  const {
    data: inventoryData,
    isLoading: isLoadingInventory,
    isError: isErrorInventory,
    error: inventoryError,
  } = useQuery({
    queryKey: ["equipment"],
    queryFn: getAllEquipment,
  });

  // Ensure inventory is always an array
  const inventory = Array.isArray(inventoryData) ? inventoryData : [];

  // Fetch locations for displaying location info
  const { data: locationsData } = useQuery({
    queryKey: ["locations"],
    queryFn: getLocations,
  });

  const locations = Array.isArray(locationsData) ? locationsData : [];

  // Fetch games for the dropdown - conditionally by location
  const { data: gamesData } = useQuery({
    queryKey: ["games", selectedLocation],
    queryFn: () =>
      selectedLocation && selectedLocation.locationId
        ? getGamesByLocation(selectedLocation.locationId)
        : getAllGames(),
  });

  // Ensure games is always an array
  const games = Array.isArray(gamesData) ? gamesData : [];

  // Filter equipment based on games at the selected location
  const filteredInventory = useMemo(() => {
    if (!selectedLocation) return inventory;
    const gameIds = games.map((g) => g.gameId);
    return inventory.filter((item) => gameIds.includes(item.gameId));
  }, [inventory, games, selectedLocation]);

  // Create equipment mutation
  const createEquipmentMutation = useMutation({
    mutationFn: createEquipment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
      setFormData({
        equipmentName: "",
        equipmentQuantity: "",
        gameId: "",
      });
      setShowCreateModal(false);
    },
    onError: (error) => {
      console.error("Failed to create equipment:", error);
    },
  });

  const updateEquipmentMutation = useMutation({
    mutationFn: updateEquipment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
      setShowEditModal(false);
      setSelectedEquipment(null);
      setEditQuantity("");
    },
    onError: (error) => {
      console.error("Failed to update equipment:", error);
    },
  });

  const deleteEquipmentMutation = useMutation({
    mutationFn: deleteEquipment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
      setShowEditModal(false);
      setSelectedEquipment(null);
      setEditQuantity("");
    },
    onError: (error) => {
      console.error("Failed to delete equipment:", error);
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateEquipment = async (e) => {
    e.preventDefault();
    createEquipmentMutation.mutate({
      equipmentName: formData.equipmentName,
      equipmentQuantity: parseInt(formData.equipmentQuantity),
      gameId: parseInt(formData.gameId),
    });
  };

  const openEditModal = (item) => {
    const normalized = {
      equipmentId: item.equipmentId ?? item.equipment_id,
      equipmentName: item.equipmentName,
      equipmentQuantity: item.equipmentQuantity,
      gameId: item.gameId,
    };
    setSelectedEquipment(normalized);
    setEditQuantity(String(normalized.equipmentQuantity ?? ""));
    setShowEditModal(true);
  };

  const handleUpdateQuantity = (e) => {
    e.preventDefault();
    if (!selectedEquipment?.equipmentId) return;

    const quantityInt = parseInt(editQuantity, 10);
    updateEquipmentMutation.mutate({
      equipmentId: selectedEquipment.equipmentId,
      equipmentData: {
        equipmentId: selectedEquipment.equipmentId,
        equipmentName: selectedEquipment.equipmentName,
        equipmentQuantity: quantityInt,
        gameId: selectedEquipment.gameId,
      },
    });
  };

  const handleDeleteEquipment = () => {
    if (!selectedEquipment?.equipmentId) return;
    const ok = window.confirm(
      `Delete equipment "${selectedEquipment.equipmentName}"? This cannot be undone.`,
    );
    if (!ok) return;
    deleteEquipmentMutation.mutate(selectedEquipment.equipmentId);
  };

  const getGameName = (gameId) => {
    const game = games.find((g) => g.gameId === gameId);
    return game ? game.gameName : "Unknown Game";
  };

  const getLocationInfo = (locationId) => {
    const location = locations.find((loc) => loc.locationId === locationId);
    return location;
  };

  const getFormattedGameName = (game) => {
    // Try different possible property names
    const locationId =
      game.locationId || game.location_id || game.location?.locationId;
    console.log("Full game object:", game);
    const location = locationId ? getLocationInfo(locationId) : null;
    console.log(
      "Game:",
      game.gameName,
      "LocationId:",
      locationId,
      "Found Location:",
      location,
    );
    if (location && location.office) {
      return `${game.gameName} - ${game.gameFloor || game.game_floor} - ${location.office}`;
    }
    // Fallback if location not found - still show floor and gameLocation
    const floor = game.gameFloor || game.game_floor;
    const gameLocation = game.gameLocation || game.game_location;
    if (floor && gameLocation) {
      return `${game.gameName} - ${floor} - ${gameLocation}`;
    } else if (floor) {
      return `${game.gameName} - ${floor}`;
    } else if (gameLocation) {
      return `${game.gameName} - ${gameLocation}`;
    }
    return game.gameName;
  };

  if (isLoadingInventory) {
    return (
      <div className="admin-section">
        <div className="admin-section-header">
          <h1 className="admin-section-title">📦 Inventory Management</h1>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">⏳</div>
          <p className="empty-state-text">Loading inventory...</p>
        </div>
      </div>
    );
  }

  if (isErrorInventory) {
    return (
      <div className="admin-section">
        <div className="admin-section-header">
          <h1 className="admin-section-title">📦 Inventory Management</h1>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">❌</div>
          <p className="empty-state-text">
            Error loading inventory: {inventoryError?.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h1 className="admin-section-title">📦 Inventory Management</h1>
        <button
          className="admin-btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          <span>+</span> Add Equipment
        </button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Equipment Name</th>
              <th>Quantity</th>
              <th>Associated Game</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.length === 0 ? (
              <tr>
                <td colSpan="5">
                  <div className="empty-state">
                    <div className="empty-state-icon">📦</div>
                    <p className="empty-state-text">
                      No equipment found
                      {selectedLocation ? ` for ${selectedLocation}` : ""}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredInventory.map((item) => (
                <tr key={item.equipment_id || item.equipmentId}>
                  <td>#{item.equipment_id || item.equipmentId}</td>
                  <td>
                    <strong>{item.equipmentName || item.equipmentName}</strong>
                  </td>
                  <td>{item.equipmentQuantity || item.equipmentQuantity}</td>
                  <td>{getGameName(item.gameId || item.gameId)}</td>
                  <td>
                    <button
                      className="admin-btn-secondary"
                      onClick={() => openEditModal(item)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Inventory Cards Summary */}
      {games.length > 0 && (
        <div className="cards-grid" style={{ marginTop: "32px" }}>
          {games.map((game) => {
            const gameEquipment = filteredInventory.filter(
              (e) => (e.gameId || e.gameId) === game.gameId,
            );
            return (
              <div key={game.gameId} className="admin-card">
                <div className="card-header">
                  <h3 className="card-title">{game.gameName}</h3>
                  <span className="card-icon">🎯</span>
                </div>
                <div className="card-detail">
                  <span className="card-detail-icon">📍</span>
                  {game.gameLocation}
                </div>
                <div className="card-detail">
                  <span className="card-detail-icon">📦</span>
                  {gameEquipment.length} equipment items
                </div>
                {gameEquipment.length > 0 && (
                  <div
                    style={{
                      marginTop: "12px",
                      fontSize: "0.85rem",
                      color: "#666",
                    }}
                  >
                    {gameEquipment.map((eq) => (
                      <div
                        key={eq.equipment_id || eq.equipmentId}
                        style={{ padding: "4px 0" }}
                      >
                        • {eq.equipmentName || eq.equipmentName} (×
                        {eq.equipmentQuantity || eq.equipmentQuantity})
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create Equipment Modal */}
      {showCreateModal && (
        <ModalPortal>
          <div
            className="modal-overlay"
            onClick={() => setShowCreateModal(false)}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Add New Equipment</h2>
                <button
                  className="modal-close"
                  onClick={() => setShowCreateModal(false)}
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleCreateEquipment}>
                <div className="form-group">
                  <label className="form-label">Equipment Name *</label>
                  <input
                    type="text"
                    name="equipmentName"
                    className="form-input"
                    placeholder="e.g., Cue Stick"
                    value={formData.equipmentName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Quantity *</label>
                  <input
                    type="number"
                    name="equipmentQuantity"
                    className="form-input"
                    placeholder="e.g., 10"
                    value={formData.equipmentQuantity}
                    onChange={handleInputChange}
                    required
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Associated Game *</label>
                  <select
                    name="gameId"
                    className="form-select"
                    value={formData.gameId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a game</option>
                    {games.map((game) => (
                      <option key={game.gameId} value={game.gameId}>
                        {getFormattedGameName(game)}
                      </option>
                    ))}
                  </select>
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
                    disabled={createEquipmentMutation.isPending}
                  >
                    {createEquipmentMutation.isPending
                      ? "Adding..."
                      : "Add Equipment"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* Edit Equipment Modal (Update Quantity + Delete) */}
      {showEditModal && selectedEquipment && (
        <ModalPortal>
          <div
            className="modal-overlay"
            onClick={() => {
              if (
                updateEquipmentMutation.isPending ||
                deleteEquipmentMutation.isPending
              )
                return;
              setShowEditModal(false);
              setSelectedEquipment(null);
              setEditQuantity("");
            }}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Edit Equipment</h2>
                <button
                  className="modal-close"
                  onClick={() => {
                    if (
                      updateEquipmentMutation.isPending ||
                      deleteEquipmentMutation.isPending
                    )
                      return;
                    setShowEditModal(false);
                    setSelectedEquipment(null);
                    setEditQuantity("");
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ marginBottom: "12px", color: "#555" }}>
                <div>
                  <strong>{selectedEquipment.equipmentName}</strong>
                </div>
                <div style={{ fontSize: "0.9rem" }}>
                  ID: #{selectedEquipment.equipmentId} • Game:{" "}
                  {getGameName(selectedEquipment.gameId)}
                </div>
              </div>

              <form onSubmit={handleUpdateQuantity}>
                <div className="form-group">
                  <label className="form-label">Stock Quantity *</label>
                  <input
                    type="number"
                    className="form-input"
                    min="1"
                    step="1"
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(e.target.value)}
                    required
                  />
                </div>

                {(updateEquipmentMutation.isError ||
                  deleteEquipmentMutation.isError) && (
                  <div
                    style={{
                      marginTop: "8px",
                      color: "#b42318",
                      fontSize: "0.9rem",
                    }}
                  >
                    {(
                      updateEquipmentMutation.error ||
                      deleteEquipmentMutation.error
                    )?.message || "Operation failed"}
                  </div>
                )}

                <div
                  className="form-actions"
                  style={{ justifyContent: "space-between" }}
                >
                  <button
                    type="button"
                    className="admin-btn-danger"
                    onClick={handleDeleteEquipment}
                    disabled={
                      updateEquipmentMutation.isPending ||
                      deleteEquipmentMutation.isPending
                    }
                  >
                    {deleteEquipmentMutation.isPending
                      ? "Deleting..."
                      : "Delete Equipment"}
                  </button>

                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      type="button"
                      className="admin-btn-secondary"
                      onClick={() => {
                        if (
                          updateEquipmentMutation.isPending ||
                          deleteEquipmentMutation.isPending
                        )
                          return;
                        setShowEditModal(false);
                        setSelectedEquipment(null);
                        setEditQuantity("");
                      }}
                      disabled={
                        updateEquipmentMutation.isPending ||
                        deleteEquipmentMutation.isPending
                      }
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="admin-btn-primary"
                      disabled={
                        updateEquipmentMutation.isPending ||
                        deleteEquipmentMutation.isPending
                      }
                    >
                      {updateEquipmentMutation.isPending ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
};

export default InventoryManagement;
