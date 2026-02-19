// ===============================
// SESSION 70 - Axios API Setup (AWS Production)
// ===============================

import axios from "axios";

// ==========================================
// BASE URL CONFIGURATION
// ==========================================
// TEMPORARILY hardcoded for local testing.
// Once confirmed working, you may switch back to env variable.

// const api = axios.create({
//   baseURL: "http://localhost:4000"
// });

// Debug log (OUTSIDE axios.create object)


// ==========================================
// BASE URL CONFIGURATION (ENV-BASED)
// ==========================================
// Uses:
// - .env.local when running npm run dev
// - .env.production when running npm run build / preview

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// Debug log (REAL value from environment file)
console.log("API BASE URL:", import.meta.env.VITE_JOB_TRACKER_API);

// ==========================================
// ATTACH TOKEN AUTOMATICALLY (IF EXISTS)
// ==========================================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
