import api from './api';

const userService = {
  getAllUsers: async () => {
    const response = await api.get('/users/get_all_user');
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/users/get_user_by_id/${id}`);
    return response.data;
  },

  createUser: async (userData) => {
    const response = await api.post('/users/create_user', userData);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/users/update_user/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/users/delete_user/${id}`);
    return response.data;
  },
};

export default userService;
