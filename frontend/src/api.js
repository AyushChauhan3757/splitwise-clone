import axios from "axios";

const API = axios.create({
  baseURL: "https://splitwise-clone-b6y3.onrender.com", // ✅ Render backend
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
