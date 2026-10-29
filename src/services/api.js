import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach JWT Bearer Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("campusconnect_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Unauthorized / Expired Token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear all token and session data on 401 unauthorized
      localStorage.removeItem("campusconnect_token");
      localStorage.removeItem("campusconnect_user");
      localStorage.removeItem("campusconnect_pending_email");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.clear();
    }
    return Promise.reject(error);
  }
);

export default api;
