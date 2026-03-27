import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import clienteAxios from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  // Extraemos la función login del contexto para el inicio de sesión automático
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Estado inicial con los campos exactos de tu Backend
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    password: "",
    rol: "cliente", // Rol oculto por defecto
  });

  const { nombre, telefono, correo, password } = formData;

  // Manejar los cambios en los inputs
  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Enviar datos al Backend para crear la cuenta
      const res = await clienteAxios.post("/users/register", formData);

      // 2. Login Automático
      // IMPORTANTE: Enviamos 'telefono' porque es lo que tu Backend usa para loguear
      await login({
        telefono: formData.telefono,
        password: formData.password,
      });

      alert(`✅ ¡Bienvenido(a) ${nombre}! Tu cuenta ha sido creada con éxito.`);

      // 3. Redirigir al inicio
      navigate("/");
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message || "Hubo un error al registrar la cuenta",
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-orange-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border-t-8 border-orange-600">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-600">
            🪵 Leños Rellenos
          </h1>
          <p className="text-gray-500 mt-2">
            Crea tu cuenta para empezar a pedir
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Nombre Completo
            </label>
            <input
              type="text"
              name="nombre"
              value={nombre}
              onChange={onChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition"
              placeholder="Ej. Alexis Villegas"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              type="text"
              name="telefono"
              value={telefono}
              onChange={onChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition"
              placeholder="418 123 4567"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              name="correo"
              value={correo}
              onChange={onChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition"
              placeholder="alexis@correo.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg shadow-lg transform transition active:scale-95 uppercase tracking-wider"
          >
            Registrarse y Entrar
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            ¿Ya tienes una cuenta?{" "}
            <Link
              to="/login"
              className="text-orange-600 font-bold hover:underline"
            >
              Loguearse
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
