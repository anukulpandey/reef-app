import axios from "axios";
import Cookies from "js-cookie";
// Default Points API base URL (local dev). You can override at runtime via localStorage/window.
const DEFAULT_BASE_URL = "https://points.reef.host/";
// For this webpack app, prefer runtime-configurable overrides (no rebuild needed):
// 1) window.__POINTS_API_BASE_URL__
// 2) localStorage["points-api-base-url"]
// 3) process.env.POINTS_API_BASE_URL (only if injected at build time)
// 4) DEFAULT_BASE_URL
const API_BASE_URL = (
  window.__POINTS_API_BASE_URL__ ||
  localStorage.getItem("points-api-base-url") ||
  process.env.POINTS_API_BASE_URL ||
  DEFAULT_BASE_URL
)
  .trim()
  .replace(/\/+$/, "");

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include token
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get("access_token");
    // console.log("🚀 ~ access_token:", accessToken);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
