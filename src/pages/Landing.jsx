import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Landing = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Si ya está logueado, redirigir según rol
  if (user) {
    if (user.rol === "admin") {
      navigate("/admin");
      return null;
    }
    if (user.rol === "repartidor") {
      navigate("/repartidor");
      return null;
    }
    navigate("/menu");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FDF6E3] flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-[#8B4513] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#D2691E] rounded-full blur-3xl"></div>
        </div>

        {/* Contenido Principal */}
        <div className="relative z-10 text-center max-w-md mx-auto">
          {/* Logo/Imagen */}
          <div className="mb-8 relative">
            <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-[#8B4513] shadow-2xl">
              <img
                src="https://customer-assets.emergentagent.com/job_lenos-rellenos/artifacts/hnbu0sbs_Gemini_Generated_Image_b5dhnsb5dhnsb5dh.png"
                alt="Leño Relleno"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Humo animado */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="text-4xl animate-bounce opacity-60">〰️</span>
            </div>
          </div>

          {/* Título */}
          <h1
            className="text-4xl md:text-5xl font-black text-[#5D3A1A] mb-3"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Leños Rellenos
          </h1>

          {/* Subtítulo */}
          <p className="text-[#8B6914] text-lg mb-2 font-medium">
            Sabor casero en cada bocado
          </p>

          {/* Descripción */}
          <p className="text-[#7A6B5A] text-sm mb-8 px-4">
            Pan artesanal recién horneado, relleno con los mejores ingredientes.
            Hecho con amor, como en casa.
          </p>

          {/* Decoración */}
          <div className="flex items-center justify-center gap-3 mb-8 text-[#C4A76C]">
            <span>✦</span>
            <span className="text-xs uppercase tracking-widest font-bold">
              Desde 2024
            </span>
            <span>✦</span>
          </div>

          {/* Botones */}
          <div className="space-y-4">
            <Link
              to="/login"
              className="block w-full bg-[#8B4513] text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-lg hover:bg-[#6B3410] transition-all active:scale-95 uppercase tracking-wide"
            >
              Iniciar Sesión
            </Link>

            <Link
              to="/register"
              className="block w-full bg-white text-[#8B4513] py-4 px-8 rounded-2xl font-bold text-lg shadow-md border-2 border-[#8B4513] hover:bg-[#FFF8E7] transition-all active:scale-95 uppercase tracking-wide"
            >
              Crear Cuenta
            </Link>
          </div>

          {/* Texto adicional */}
          <p className="text-[#9A8B7A] text-xs mt-8">
            Pide ahora y recibe en la puerta de tu casa
          </p>
        </div>
      </div>

      {/* Footer decorativo */}
      <div className="bg-[#5D3A1A] py-4 px-6">
        <div className="flex items-center justify-center gap-2 text-[#E8D5B7]">
          <span className="text-lg">🪵</span>
          <span className="text-xs font-medium uppercase tracking-widest">
            Horneados con amor
          </span>
          <span className="text-lg">🔥</span>
        </div>
      </div>
    </div>
  );
};

export default Landing;
