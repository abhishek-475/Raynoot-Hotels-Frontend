import API from "../utils/api";

// Create booking
export const createBooking = async (data) => {
  const res = await API.post("/bookings", data);
  return res.data;
};

// Get booking by user
export const getUserBookings = async () => {
  const res = await API.get("/bookings/my");
  return res.data;
};

export const getAllBookings = async () => {
  const res = await API.get("/bookings"); 
  return res.data;
};

// Update booking status (Admin)
export const updateBookingStatus = async (id, status) => {
  const res = await API.put(`/bookings/${id}/status`, { status }); 
  return res.data;
};

// Delete booking (User or Admin)
export const cancelBooking = async (id) => {
  const res = await API.delete(`/bookings/${id}`); 
  return res.data;
};



