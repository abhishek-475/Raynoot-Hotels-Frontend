import API from "../utils/api";

// Get all hotels
export const getAllHotels = async () => {
  const res = await API.get("/hotels");
  return res.data;
};

// Get single hotel
export const getHotelById = async (id) => {
  const res = await API.get(`/hotels/${id}`);
  return res.data;
};

// Admin: create hotel
export const createHotel = async (data) => {
  const res = await API.post("/hotels", data);
  return res.data;
};

// Admin: update hotel
export const updateHotel = async (id, data) => {
  const res = await API.put(`/hotels/${id}`, data);
  return res.data;
};

// Admin: delete hotel
export const deleteHotel = async (id) => {
  const res = await API.delete(`/hotels/${id}`);
  return res.data;
};
