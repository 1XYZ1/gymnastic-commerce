import axios from "axios";
import { tokenStorage } from "@/auth/services";

const gymApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

gymApi.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export { gymApi };
