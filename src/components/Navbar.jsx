import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md border-b-2 border-orange-500 py-4 px-6 flex justify-between items-center sticky top-0 z-50">
      {/* Logo o Nombre */}
      <Link to="/" className="flex items-center space-x-2">
        <span className="text-2xl">🔥</span>
        <span className="font-black text-xl text-gray-800 tracking-tighter uppercase">
          Leños <span className="text-orange-600">Rellenos</span>
        </span>
      </Link>

      {/* Menú Dinámico */}
      <div className="flex items-center space-x-6">
        <Link
          to="/"
          className="text-gray-600 font-semibold hover:text-orange-600 transition"
        >
          Catálogo
        </Link>

        {/* CORRECCIÓN FINAL: 
          1. Verificamos que 'user' exista.
          2. Verificamos que 'user.nombre' exista antes de hacer el .split().
          3. Si algo falta, mostramos "Usuario" para evitar la pantalla blanca.
        */}
        {user ? (
          <div className="flex items-center space-x-4">
            <Link
              to="/perfil"
              className="flex items-center space-x-2 bg-orange-50 px-3 py-1 rounded-full border border-orange-200 hover:bg-orange-100 transition"
            >
              <span className="text-orange-600 font-bold">
                👤 {user?.nombre ? user.nombre.split(" ")[0] : "Usuario"}
              </span>
            </Link>

            {/* Si es Admin, podrías mostrar un botón extra aquí en el futuro */}
            {user?.rol === "admin" && (
              <Link
                to="/admin/repartidores"
                className="text-xs font-black text-orange-600 border-b-2 border-orange-600 hover:text-orange-800 transition"
              >
                GESTIÓN
              </Link>
            )}

            <button
              onClick={onLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-600 shadow-md transition active:scale-95"
            >
              Salir
            </button>
          </div>
        ) : (
          <div className="space-x-4">
            <Link
              to="/login"
              className="text-gray-600 font-bold hover:text-orange-600 transition"
            >
              Entrar
            </Link>
            <Link
              to="/register"
              className="bg-orange-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-700 transition shadow-lg active:scale-95"
            >
              Registrarse
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
