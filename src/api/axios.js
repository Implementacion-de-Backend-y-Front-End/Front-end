import axios from "axios";

const clienteAxios = axios.create({
  // CAMBIO AQUÍ: Escribe la URL de tu backend directamente entre comillas
  // Esto elimina el error 404 porque Axios ya no "adivinará" la ruta.
  baseURL: "https://backend-production-0532.up.railway.app/api",
});

// Tu interceptor está perfecto, NO lo cambies
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
