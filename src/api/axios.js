import axios from "axios";

const clienteAxios = axios.create({
  // 1. Prioridad: Usa la variable de entorno de Railway, si no existe, usa localhost
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
});

// Interceptor para enviar el token en los headers siempre
clienteAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // Asegúrate de que tu Backend use este mismo nombre: 'x-auth-token'
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default clienteAxios;
