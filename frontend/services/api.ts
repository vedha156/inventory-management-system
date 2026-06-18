import axios from "axios";

const api = axios.create({
  baseURL: "https://inventory-management-system-1-i3er.onrender.com/api",
});

export default api;