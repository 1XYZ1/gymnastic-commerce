import axios from "axios";
// IMPORTANTE: Import directo, NO desde barrel export para evitar dependencia circular
import { tokenStorage } from "@/auth/services/TokenStorageService";

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
