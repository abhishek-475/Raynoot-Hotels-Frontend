import API from "../utils/api";

// Get all rooms
export const getAllRooms = async () => {
  const res = await API.get("/rooms");
  return res.data;
};

// Get single room by ID
export const getRoomById = async (id) => {
  const res = await API.get(`/rooms/${id}`);
  return res.data;
};

// Admin: create room
export const createRoom = async (data) => {
  const res = await API.post("/rooms", data);
  return res.data;
};

// Admin: update room
export const updateRoom = async (id, data) => {
  const res = await API.put(`/rooms/${id}`, data);
  return res.data;
};

// Admin: delete room
export const deleteRoom = async (id) => {
  const res = await API.delete(`/rooms/${id}`);
  return res.data;
};

// Enhanced availability check with better error handling
export const checkRoomAvailability = async (roomId, checkIn, checkOut) => {
  try {
    const res = await API.get(`/rooms/${roomId}/availability`, {
      params: { checkIn, checkOut }
    });
    return res.data;
  } catch (err) {
    // Re-throw the error with more context
    const error = new Error(err.response?.data?.message || "Availability check failed");
    error.status = err.response?.status;
    throw error;
  }
};