import axios from "axios";

const BACKEND_URL = "http://localhost:5000"; // Change to your backend URL

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true, // Important for handling cookies and sessions
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Credentials": true,
  },
});

// 🔹 Request Interceptor (Attach Token Automatically)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Or use Redux state if persisted
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 🔹 Response Interceptor (Handle Unauthorized Access & Errors)
axiosInstance.interceptors.response.use(
  (response) => response, // Pass successful response as-is
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.error("Unauthorized! Redirecting to login...");
        // Handle logout (clear token, redirect)
        localStorage.removeItem("token");
        window.location.href = "/login"; // Redirect to login page
      } else if (error.response.status === 403) {
        console.error("Forbidden! You don't have permission.");
      } else if (error.response.status === 500) {
        console.error("Server error! Try again later.");
      }
    } else if (error.request) {
      console.error("No response from server!");
    } else {
      console.error("Request error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
