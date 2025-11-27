import API from "../utils/api";

// Register
export const registerUser = async (data) => {
  const res = await API.post("/auth/register", data);
  return res.data;
};

// Login
export const loginUser = async (data) => {
  const res = await API.post("/auth/login", data);
  return res.data;
};

// Profile
export const getProfile = async () => {
  const res = await API.get("/auth/profile");
  return res.data;
};

// Admin: get all users -
export const getAllUsers = async () => {
  const res = await API.get("/auth/users"); 
  return res.data;
};

// Admin: update user 
export const updateUser = async (id, data) => {
  const res = await API.put(`/auth/users/${id}`, data); 
  return res.data;
};

// Admin: delete user 
export const deleteUser = async (id) => {
  const res = await API.delete(`/auth/users/${id}`); 
  return res.data;
};

// Create admin
export const createAdmin = async (data) => {
  const res = await API.post("/auth/create-admin", data);
  return res.data;
};