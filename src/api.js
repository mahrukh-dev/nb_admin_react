import axios from "axios";

// Use environment variable for production, fallback to localhost for development
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  timeout: 30000, // Increased timeout for production
});

// Request interceptor to attach JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("🌐 Making request to:", config.baseURL + config.url);
    console.log("🔧 Environment:", process.env.NODE_ENV);
    console.log("🔧 API URL:", process.env.REACT_APP_API_URL || "localhost");
    return config;
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => {
    console.log("✅ API Response received:", response.status);
    return response;
  },
  (error) => {
    console.error("❌ API Error:", error);
    console.error("❌ Error response:", error.response?.data);
    console.error("❌ Error status:", error.response?.status);
    console.error("❌ Request URL:", error.config?.url);
    console.error("❌ Base URL:", error.config?.baseURL);

    if (error.code === "ECONNABORTED") {
      console.error("⏰ Request timeout - Server might be slow or unavailable");
    }
    if (error.code === "ERR_NETWORK") {
      console.error(
        "🌐 Network Error: Check your internet connection and server availability"
      );
    }
    return Promise.reject(error);
  }
);

export default API;

