import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8089';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'accept': '*/*',
    },
});

export const getLocations = async () => {
    const response = await apiClient.get('/games/locations');
    return response.data;
};

export const getGamesByLocation = async (location) => {
    const response = await apiClient.get(`/games/locations/${location}`);
    return response.data;
};
