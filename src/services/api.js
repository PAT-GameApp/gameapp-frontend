import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8089";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    accept: "*/*",
    "Content-Type": "application/json",
  },
});

// Request interceptor to add Authorization header with Bearer token
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// ==================== API FUNCTIONS ====================

// --- Location APIs ---
export const getLocations = async () => {
  const response = await apiClient.get("/locations/");
  return response.data;
};

export const getGamesByLocation = async (office) => {
  const response = await apiClient.get(`/games/locations/${office}`);
  return response.data;
};

// --- Games APIs ---
// GET all games
export const getAllGames = async () => {
  const response = await apiClient.get("/games/");
  return response.data;
};

// POST create game
export const createGame = async (gameData) => {
  const response = await apiClient.post("/games/", gameData);
  return response.data;
};

// --- Equipment/Inventory APIs ---
// GET all equipment
export const getAllEquipment = async () => {
  const response = await apiClient.get("/equipment/");
  return response.data;
};

// POST add equipment
export const createEquipment = async (equipmentData) => {
  const response = await apiClient.post("/equipment/add", equipmentData);
  return response.data;
};

// --- Bookings APIs ---
// GET all bookings
export const getAllBookings = async () => {
  const response = await apiClient.get("/bookings/");
  return response.data;
};

// POST create booking
export const createBooking = async (bookingData) => {
  const response = await apiClient.post("/bookings/", bookingData);
  return response.data;
};

// POST allot booking (placeholder - endpoint TBD)
export const allotBooking = async (bookingId) => {
  // TODO: Update with actual allotment endpoint when available
  const response = await apiClient.post(`/bookings/${bookingId}/allot`);
  return response.data;
};
