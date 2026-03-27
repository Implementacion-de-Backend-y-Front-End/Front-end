import { createContext, useState, useEffect } from "react";
import clienteAxios from "../api/axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarUsuario = () => {
      const token = localStorage.getItem("token");
      const usuarioGuardado = localStorage.getItem("user"); // <--- IMPORTANTE: Leer el usuario

      if (token && usuarioGuardado) {
        try {
          // Restauramos el objeto completo (con nombre, rol, etc.)
          setUser(JSON.parse(usuarioGuardado));
        } catch (error) {
          console.error("Error al parsear usuario del localStorage");
          logout(); // Si el JSON está mal, limpiamos todo
        }
      }
      setLoading(false);
    };

    cargarUsuario();
  }, []);

  const login = async (datos) => {
    const respuesta = await clienteAxios.post("/users/login", datos);

    // 1. Guardamos AMBAS cosas en localStorage
    localStorage.setItem("token", respuesta.data.token);
    localStorage.setItem("user", JSON.stringify(respuesta.data.user));

    // 2. Seteamos el objeto completo en el estado
    setUser(respuesta.data.user);

    return respuesta.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // <--- No olvides limpiar esto también
    setUser(null);
    window.location.href = "/login"; // Redirección limpia al salir
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
