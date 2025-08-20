import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api", 
  withCredentials: true, // This ensures cookies are sent with requests
});

export default API;