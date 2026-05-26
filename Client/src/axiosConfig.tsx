import axios from "axios";

// take baseURL from .env file
const instance = axios.create({
  // baseURL: "https://blog-e0l8.onrender.com/api/v1",
  // use Vite's import.meta.env instead of process.env to avoid TS "Cannot find name 'process'" errors
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
});
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
export default instance;
