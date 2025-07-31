import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Send token directly (no "Bearer ")
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = token;
  return req;
});

export default API;


