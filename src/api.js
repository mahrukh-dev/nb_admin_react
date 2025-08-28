import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  timeout: 10000,
});

// Add request interceptor for debugging
API.interceptors.request.use(
  (config) => {
    console.log("Making request to:", config.baseURL + config.url);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error);
    if (error.code === "ERR_NETWORK") {
      console.error(
        "Network Error: Make sure your backend server is running on http://localhost:5000"
      );
    }
    return Promise.reject(error);
  }
);

export default API;
