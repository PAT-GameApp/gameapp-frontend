import api from './api';

const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', {
      userName: userData.userName,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      role: userData.role,
      department: userData.department,
      officeLocation: userData.officeLocation,
      password: userData.password,
    });
    return response.data;
  },
  login: async (credentials) => {
    // Backend uses Spring Security form-based login
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await api.post('/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      withCredentials: true, // Include cookies for session
    });
    
    // Store session/token if provided
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export default authService;
