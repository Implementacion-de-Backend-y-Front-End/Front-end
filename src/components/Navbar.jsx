import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-[#FDF6E3] shadow-md border-b-2 border-[#8B4513] py-4 px-6 flex justify-between items-center sticky top-0 z-50">
      {/* Logo o Nombre */}
      <Link to="/" className="flex items-center space-x-2">
        <span className="text-2xl">🪵</span>
        <span className="font-black text-xl text-[#5D3A1A] tracking-tighter uppercase">
          Leños <span className="text-[#8B4513]">Rellenos</span>
        </span>
      </Link>

      {/* Menú Dinámico */}
      <div className="flex items-center space-x-6">
        <Link
          to="/menu"
          className="text-[#5D3A1A] font-semibold hover:text-[#8B4513] transition"
        >
          Catálogo
        </Link>

        {user ? (
          <div className="flex items-center space-x-4">
            <Link
              to="/perfil"
              className="flex items-center space-x-2 bg-[#F5E6D3] px-3 py-1 rounded-full border border-[#D4A574] hover:bg-[#E8D5B7] transition"
            >
              <span className="text-[#8B4513] font-bold">
                👤 {user?.nombre ? user.nombre.split(" ")[0] : "Usuario"}
              </span>
            </Link>

            {user?.rol === "admin" && (
              <Link
                to="/admin"
                className="text-xs font-black text-[#8B4513] border-b-2 border-[#8B4513] hover:text-[#5D3A1A] transition"
              >
                GESTIÓN
              </Link>
            )}

            <button
              onClick={onLogout}
              className="bg-[#8B4513] text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#6B3410] shadow-md transition active:scale-95"
            >
              Salir
            </button>
          </div>
        ) : (
          <div className="space-x-4">
            <Link
              to="/login"
              className="text-[#5D3A1A] font-bold hover:text-[#8B4513] transition"
            >
              Entrar
            </Link>
            <Link
              to="/register"
              className="bg-[#8B4513] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#6B3410] transition shadow-lg active:scale-95"
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
