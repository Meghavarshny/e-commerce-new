import axios from "axios";

// Configure only if you want to use a shared axios instance everywhere
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("authToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Add a response interceptor to handle token errors (401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear auth data on unauthorized error
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      
      // If we are in a browser environment, we might want to redirect
      if (typeof window !== "undefined") {
        // Only redirect if not already on the login page
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login?error=session_expired";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
