import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL|| 'https://raynott-college-3.onrender.com/api';


const API = axios.create({
  baseURL: API_URL,
  timeout:15000,
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
