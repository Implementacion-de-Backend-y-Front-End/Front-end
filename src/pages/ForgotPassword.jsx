import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react"; // Iconos profesionales
import clienteAxios from "../api/axios";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [correo, setCorreo] = useState("");
  const [codigo, setCodigo] = useState("");
  const [validado, setValidado] = useState(false);

  // Estados para la nueva contraseña
  const [showPassword, setShowPassword] = useState(false);
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await clienteAxios.post("/users/olvide-password", { correo });
      setStep(2);
    } catch (error) {
      alert("Error al enviar el correo.");
    } finally {
      setLoading(false);
    }
  };

  if (validado) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-orange-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-t-8 border-orange-600 animate-in fade-in zoom-in duration-300">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Nueva Contraseña
          </h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (nuevaPassword !== confirmarPassword)
                return alert("Las contraseñas no coinciden");
              setLoading(true);
              try {
                await clienteAxios.post("/users/reset-password", {
                  correo,
                  nuevaPassword,
                });
                alert("¡Contraseña actualizada!");
                window.location.href = "/login";
              } catch (err) {
                alert("Error al guardar");
              }
              setLoading(false);
            }}
          >
            {/* Campo Nueva Contraseña con Ojito */}
            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nueva Contraseña"
                className="w-full p-3 border-2 rounded-xl focus:border-orange-500 outline-none transition-all"
                onChange={(e) => setNuevaPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-orange-500 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <input
              type="password"
              placeholder="Confirmar Contraseña"
              className="w-full p-3 border-2 rounded-xl mb-6 focus:border-orange-500 outline-none transition-all"
              onChange={(e) => setConfirmarPassword(e.target.value)}
              required
            />

            <button
              disabled={loading}
              className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-orange-700 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "ACTUALIZAR Y ENTRAR"
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-orange-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-t-8 border-orange-500 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {step === 1 ? (
          <form onSubmit={handleSendCode} className="text-center">
            <div className="text-5xl mb-4 animate-bounce">📧</div>
            <h2 className="text-2xl font-bold text-gray-800">
              Recuperar Contraseña
            </h2>
            <input
              type="email"
              placeholder="tu@correo.com"
              className="w-full p-3 border-2 rounded-xl mb-4 mt-4 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
            <button
              disabled={loading}
              className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-orange-600 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : "ENVIAR CÓDIGO"}
            </button>
          </form>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setValidado(true);
            }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-gray-800">
              Verifica tu Código
            </h2>
            <input
              type="text"
              maxLength="6"
              placeholder="000000"
              className="w-full p-4 border-2 border-orange-200 rounded-xl mb-6 text-center text-3xl tracking-[10px] font-bold text-orange-600 focus:bg-orange-50 outline-none transition-all"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              required
            />
            <button className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl mb-4 hover:brightness-110 active:scale-95 transition-all">
              VERIFICAR CÓDIGO
            </button>
          </form>
        )}
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-orange-600 font-bold hover:text-orange-800 transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
