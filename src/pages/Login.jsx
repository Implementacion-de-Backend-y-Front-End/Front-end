import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await login({ telefono, password });

      const user = data?.user || data;
      const rol = user?.rol;
      const nombre = user?.nombre || "Usuario";

      alert(`¡Hola de nuevo, ${nombre}! 🔥`);

      switch (rol) {
        case "admin":
          navigate("/admin");
          break;
        case "repartidor":
          navigate("/repartidor");
          break;
        default:
          navigate("/");
          break;
      }
    } catch (error) {
      console.error("Error en login:", error);
      alert(
        error.response?.data?.message || "Teléfono o contraseña incorrectos",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-orange-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white shadow-xl rounded-2xl w-full max-w-md border-t-8 border-orange-500 animate-in fade-in zoom-in duration-300"
      >
        <div className="text-center mb-6">
          <h2 className="text-3xl font-black text-gray-800 tracking-tighter uppercase">
            🪵 LEÑOS <span className="text-orange-600">RELLENOS</span>
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Inicia sesión con tu número de teléfono
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-bold mb-1 text-sm">
              Teléfono
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border-2 rounded-xl focus:border-orange-500 outline-none transition-all placeholder:text-gray-300"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Ej. 4615289540"
              required
            />
          </div>

          <div className="relative">
            <label className="block text-gray-700 font-bold mb-1 text-sm">
              Contraseña
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-3 border-2 rounded-xl focus:border-orange-500 outline-none transition-all placeholder:text-gray-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-10 text-xl"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        <div className="text-right mt-3">
          <Link
            to="/forgot-password"
            className="text-xs font-bold text-orange-600 hover:text-orange-800 transition-colors uppercase tracking-wider"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-6 ${
            loading ? "bg-gray-400" : "bg-orange-500 hover:bg-orange-600"
          } text-white font-black py-4 rounded-xl transition-all duration-300 shadow-lg transform active:scale-95 uppercase tracking-widest`}
        >
          {loading ? "VERIFICANDO..." : "ENTRAR"}
        </button>

        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <p className="text-gray-600 text-sm font-medium">
            ¿No tienes cuenta?{" "}
            <Link
              to="/register"
              className="text-orange-600 font-black hover:underline"
            >
              REGÍSTRATE AQUÍ
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
