import { useState, useRef } from "react";
import {
  UserPlus,
  User,
  Phone,
  Mail,
  Lock,
  Loader2,
  ShieldCheck,
  Users,
} from "lucide-react";
import clienteAxios from "../../api/axios";
import PersonalList from "./PersonalList";

const UsuariosManager = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    password: "",
    rol: "repartidor",
  });
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const listaRef = useRef(null);

  const scrollToUsuarios = () => {
    listaRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // ✅ CORREGIDO: Usar la ruta protegida para registrar staff
      await clienteAxios.post("/api/users/registrar-staff", formData);
      alert(`¡${formData.rol.toUpperCase()} registrado con éxito! 🔥`);
      setFormData({
        nombre: "",
        telefono: "",
        correo: "",
        password: "",
        rol: "repartidor",
      });
      setRefresh((prev) => prev + 1);
    } catch (error) {
      alert(error.response?.data?.message || "Error al registrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen pb-20 p-4">
      {/* SECCIÓN 1: Formulario de Alta */}
      <section className="max-w-4xl mx-auto bg-[#1e293b] p-8 rounded-3xl border border-slate-800 shadow-2xl mb-12 animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-cyan-600/10 p-4 rounded-full mb-3">
            <UserPlus className="text-cyan-400" size={32} />
          </div>
          <h2 className="text-3xl font-black uppercase text-white italic tracking-tighter text-center">
            Alta de <span className="text-cyan-400">Personal</span>
          </h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[3px]">
            Leños Rellenos Admin
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputGroup
              label="Nombre Completo"
              icon={<User size={18} />}
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej. Fernando Zapata"
            />
            <InputGroup
              label="Teléfono"
              icon={<Phone size={18} />}
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="4181187969"
            />
          </div>

          <InputGroup
            label="Correo Electrónico"
            icon={<Mail size={18} />}
            name="correo"
            type="email"
            value={formData.correo}
            onChange={handleChange}
            placeholder="usuario@gmail.com"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputGroup
              label="Contraseña Temporal"
              icon={<Lock size={18} />}
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
            />

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-2">
                Nivel de Privilegios
              </label>
              <div className="relative flex items-center">
                <ShieldCheck
                  className="absolute ml-4 text-cyan-400"
                  size={18}
                />
                <select
                  name="rol"
                  className="w-full bg-[#0f172a] p-4 pl-12 rounded-2xl border border-slate-800 text-white font-bold appearance-none outline-none focus:border-cyan-500 cursor-pointer"
                  value={formData.rol}
                  onChange={handleChange}
                >
                  <option value="repartidor">🛵 REPARTIDOR</option>
                  <option value="admin">🔑 ADMINISTRADOR</option>
                </select>
              </div>
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-cyan-600 py-5 rounded-2xl font-black uppercase tracking-[3px] text-white hover:bg-cyan-700 active:scale-[0.98] transition-all flex justify-center items-center gap-3 shadow-xl shadow-cyan-900/20 mt-4"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "REGISTRAR EN EL EQUIPO 🪵"
            )}
          </button>
        </form>
      </section>

      {/* SECCIÓN 2: Lista de Usuarios */}
      <div ref={listaRef} className="max-w-4xl mx-auto">
        <PersonalList reload={refresh} />
      </div>

      {/* BOTÓN FLOTANTE */}
      <button
        onClick={scrollToUsuarios}
        className="fixed bottom-8 right-8 bg-cyan-600 text-white px-6 py-4 rounded-full shadow-2xl shadow-cyan-900/40 font-black uppercase italic text-xs flex items-center gap-3 hover:bg-cyan-500 transition-all hover:-translate-y-2 active:scale-95 z-50 border-2 border-cyan-400/20"
      >
        <Users size={20} />
        Ver Usuarios
      </button>
    </div>
  );
};

const InputGroup = ({ label, icon, ...props }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black text-slate-500 uppercase ml-2">
      {label}
    </label>
    <div className="relative flex items-center">
      <div className="absolute ml-4 text-cyan-400">{icon}</div>
      <input
        {...props}
        className="w-full bg-[#0f172a] p-4 pl-12 rounded-2xl border border-slate-800 outline-none focus:border-cyan-500 text-white transition-all font-medium placeholder:text-slate-700"
        required
      />
    </div>
  </div>
);

export default UsuariosManager;
