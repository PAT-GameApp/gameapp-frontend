import api from './api';

const bookingService = {
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings/create_booking', {
      userId: bookingData.userId,
      gameId: bookingData.gameId,
      allotmentId: bookingData.allotmentId,
      bookingLocation: bookingData.bookingLocation,
    });
    return response.data;
  },

  getAllBookings: async () => {
    const response = await api.get('/bookings/get_all_booking');
    return response.data;
  },

  getBookingById: async (id) => {
    const response = await api.get(`/bookings/get_booking_by_id/${id}`);
    return response.data;
  },

  deleteBooking: async (id) => {
    const response = await api.delete(`/bookings/delete_booking/${id}`);
    return response.data;
  },
};

export default bookingService;
