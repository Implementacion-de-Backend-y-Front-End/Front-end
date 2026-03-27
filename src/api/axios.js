import axios from "axios";

const clienteAxios = axios.create({
  baseURL: "http://localhost:4000/api", // La URL de tu servidor de Node
});

// Interceptor para enviar el token en los headers siempre
clienteAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default clienteAxios;
