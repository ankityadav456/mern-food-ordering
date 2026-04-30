import axios from "axios";

const instance = axios.create({
  // baseURL: "http://localhost:5000/api",
  baseURL: import.meta.env.VITE_BACKEND_URL + "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default instance;
