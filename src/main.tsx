import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GymShopApp } from "./GymShopApp";

import "./index.css";

// Debug info para Vercel
console.log('🚀 App iniciando...');
console.log('📍 API URL:', import.meta.env.VITE_API_URL);
console.log('🔧 Modo:', import.meta.env.MODE);
console.log('📅 Build:', new Date().toISOString());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GymShopApp />
  </StrictMode>
);
