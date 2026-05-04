import axios from "axios";

const instance = axios.create({
  //  baseURL: "http://localhost:5000/api",
    // headers: { "Content-Type": "application/json" },
  baseURL: import.meta.env.VITE_BACKEND_URL + "/api",
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default instance;