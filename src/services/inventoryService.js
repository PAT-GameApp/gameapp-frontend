import api from './api';

const inventoryService = {
  // Equipment endpoints
  getAllEquipment: async () => {
    const response = await api.get('/equipment/');
    return response.data;
  },

  getEquipmentById: async (id) => {
    const response = await api.get(`/equipment/${id}`);
    return response.data;
  },

  addEquipment: async (equipmentData) => {
    const response = await api.post('/equipment/add', equipmentData);
    return response.data;
  },

  updateEquipment: async (id, equipmentData) => {
    const response = await api.put(`/equipment/${id}`, equipmentData);
    return response.data;
  },

  deleteEquipment: async (id) => {
    const response = await api.delete(`/equipment/${id}`);
    return response.data;
  },

  // Allotment endpoints
  getAllAllotments: async () => {
    const response = await api.get('/allotments');
    return response.data;
  },

  getAllotmentById: async (id) => {
    const response = await api.get(`/allotments/${id}`);
    return response.data;
  },

  addAllotment: async (allotmentData) => {
    const response = await api.post('/allotments/addAllotment', allotmentData);
    return response.data;
  },

  deleteAllotment: async (id) => {
    const response = await api.delete(`/allotments/${id}`);
    return response.data;
  },
};

export default inventoryService;
