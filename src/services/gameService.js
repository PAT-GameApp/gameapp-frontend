import api from './api';

const gameService = {
  getAllGames: async () => {
    const response = await api.get('/games/get_all_games');
    return response.data;
  },

  getGameById: async (id) => {
    const response = await api.get(`/games/get_game_by_id/${id}`);
    return response.data;
  },

  createGame: async (gameData) => {
    const response = await api.post('/games/create_game', gameData);
    return response.data;
  },

  updateGame: async (id, gameData) => {
    const response = await api.put(`/games/update_game/${id}`, gameData);
    return response.data;
  },

  deleteGame: async (id) => {
    const response = await api.delete(`/games/delete_game/${id}`);
    return response.data;
  },
};

export default gameService;
