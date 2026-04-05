import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import clienteAxios from "../api/axios";
import {
  Truck,
  MapPin,
  Phone,
  Package,
  CheckCircle,
  Clock,
  Navigation,
  LogOut,
  RefreshCw,
  ChevronRight,
  X,
  User,
  AlertCircle,
} from "lucide-react";

const RepartidorDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [rutas, setRutas] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pedidoActivo, setPedidoActivo] = useState(null);
  const [vista, setVista] = useState("rutas"); // "rutas" | "detalle" | "historial"

  useEffect(() => {
    fetchRutas();
    fetchHistorial();
  }, []);

  const fetchRutas = async () => {
    try {
      setLoading(true);
      const res = await clienteAxios.get("/api/delivery/mis-rutas");
      setRutas(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error al cargar rutas:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistorial = async () => {
    try {
      const res = await clienteAxios.get("/api/delivery/historial");
      setHistorial(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error al cargar historial:", error);
    }
  };

  // Marcar como "En Camino" - Envía WhatsApp al cliente
  const handleEnCamino = async (pedidoId) => {
    try {
      const res = await clienteAxios.put(`/api/delivery/en-camino/${pedidoId}`);

      if (res.data.whatsappUrl) {
        window.open(res.data.whatsappUrl, "_blank");
      }

      alert("✅ ¡En camino! Se abrió WhatsApp para notificar al cliente.");
      fetchRutas();
    } catch (error) {
      alert(error.response?.data?.message || "Error al iniciar entrega");
    }
  };

  // Confirmar entrega
  const handleEntregado = async (pedidoId) => {
    if (!window.confirm("¿Confirmas que ya entregaste este pedido?")) return;

    try {
      const res = await clienteAxios.put(`/api/delivery/entregar/${pedidoId}`);

      // Abrir WhatsApp del cliente
      if (res.data.whatsappCliente) {
        window.open(res.data.whatsappCliente, "_blank");
      }

      // Abrir WhatsApp de los admins (después de 1 segundo para no bloquear popups)
      if (res.data.whatsappAdmins && res.data.whatsappAdmins.length > 0) {
        setTimeout(() => {
          res.data.whatsappAdmins.forEach((admin, index) => {
            setTimeout(() => {
              window.open(admin.url, "_blank");
            }, index * 500); // Espaciar 500ms entre cada uno
          });
        }, 1000);
      }

      alert("✅ ¡Pedido entregado con éxito!");
      setPedidoActivo(null);
      setVista("rutas");
      fetchRutas();
      fetchHistorial();
    } catch (error) {
      alert(error.response?.data?.message || "Error al confirmar entrega");
    }
  };

  // Abrir en Google Maps
  const abrirMaps = (direccion) => {
    const query = encodeURIComponent(
      `${direccion.calle}, ${direccion.colonia}`,
    );
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      "_blank",
    );
  };

  // Llamar al cliente
  const llamarCliente = (telefono) => {
    window.open(`tel:${telefono}`, "_self");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw
            className="animate-spin text-orange-500 mx-auto mb-4"
            size={40}
          />
          <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">
            Cargando tus rutas...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pb-24">
      {/* HEADER */}
      <header className="bg-[#1e293b] border-b border-slate-800 p-4 sticky top-0 z-40">
        <div className="max-w-lg mx-auto flex justify-between items-center">
          <div>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
              Repartidor
            </p>
            <h1 className="text-lg font-black text-orange-500 uppercase italic">
              {user?.nombre || "Repartidor"}
            </h1>
          </div>
          <button
            onClick={logout}
            className="bg-slate-800 p-3 rounded-xl hover:bg-red-600/20 hover:text-red-500 transition-all"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* TABS */}
      <div className="bg-[#1e293b] border-b border-slate-800">
        <div className="max-w-lg mx-auto flex">
          <button
            onClick={() => setVista("rutas")}
            className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all ${
              vista === "rutas"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            Mis Rutas ({rutas.length})
          </button>
          <button
            onClick={() => setVista("historial")}
            className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all ${
              vista === "historial"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            Entregados ({historial.length})
          </button>
        </div>
      </div>

      <main className="max-w-lg mx-auto p-4">
        {/* VISTA: MIS RUTAS */}
        {vista === "rutas" && (
          <div className="space-y-4">
            {rutas.length === 0 ? (
              <div className="bg-[#1e293b] rounded-3xl p-12 text-center border-2 border-dashed border-slate-800">
                <Package className="mx-auto mb-4 text-slate-600" size={48} />
                <p className="text-slate-500 font-bold uppercase text-sm">
                  No tienes rutas asignadas
                </p>
                <p className="text-slate-600 text-xs mt-2">
                  Espera a que el admin te asigne pedidos
                </p>
                <button
                  onClick={fetchRutas}
                  className="mt-6 bg-slate-800 px-6 py-3 rounded-xl text-xs font-bold uppercase flex items-center gap-2 mx-auto hover:bg-slate-700 transition-all"
                >
                  <RefreshCw size={14} /> Actualizar
                </button>
              </div>
            ) : (
              rutas.map((pedido, index) => (
                <div
                  key={pedido._id}
                  className="bg-[#1e293b] rounded-2xl border border-slate-800 overflow-hidden"
                >
                  {/* Encabezado del pedido */}
                  <div className="bg-slate-800/50 p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-500 w-8 h-8 rounded-full flex items-center justify-center font-black text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 font-bold">
                          FOLIO
                        </p>
                        <p className="font-black text-orange-500">
                          {pedido.folio}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        pedido.estado === "enCamino"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {pedido.estado === "enCamino" ? "En Camino" : "Pendiente"}
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-4 space-y-4">
                    {/* Cliente */}
                    <div className="flex items-center gap-3">
                      <User className="text-slate-500" size={18} />
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase">
                          Cliente
                        </p>
                        <p className="font-bold">{pedido.clienteId?.nombre}</p>
                      </div>
                    </div>

                    {/* Dirección */}
                    <div className="flex items-start gap-3">
                      <MapPin className="text-orange-500 mt-1" size={18} />
                      <div className="flex-1">
                        <p className="text-[10px] text-slate-500 uppercase">
                          Dirección
                        </p>
                        <p className="font-medium text-sm">
                          {pedido.direccion?.calle}, {pedido.direccion?.colonia}
                        </p>
                        {pedido.direccion?.referencia && (
                          <p className="text-orange-400 text-xs italic mt-1">
                            Ref: {pedido.direccion.referencia}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Productos */}
                    <div className="bg-slate-900/50 p-3 rounded-xl">
                      <p className="text-[10px] text-slate-500 uppercase mb-2">
                        Productos
                      </p>
                      {pedido.productos?.map((p, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span>{p.nombre}</span>
                          <span className="text-orange-500 font-bold">
                            x{p.cantidad}
                          </span>
                        </div>
                      ))}
                      <div className="border-t border-slate-800 mt-2 pt-2 flex justify-between">
                        <span className="font-bold">Total:</span>
                        <span className="text-green-500 font-black">
                          ${pedido.total}
                        </span>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* Botón Llamar */}
                      <button
                        onClick={() =>
                          llamarCliente(pedido.clienteId?.telefono)
                        }
                        className="bg-slate-800 py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase hover:bg-slate-700 transition-all"
                      >
                        <Phone size={16} className="text-green-500" />
                        Llamar
                      </button>

                      {/* Botón Maps */}
                      <button
                        onClick={() => abrirMaps(pedido.direccion)}
                        className="bg-slate-800 py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase hover:bg-slate-700 transition-all"
                      >
                        <Navigation size={16} className="text-blue-500" />
                        Maps
                      </button>
                    </div>

                    {/* Botón Principal */}
                    {pedido.estado !== "enCamino" ? (
                      <button
                        onClick={() => handleEnCamino(pedido._id)}
                        className="w-full bg-blue-600 py-4 rounded-xl font-black uppercase text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/30"
                      >
                        <Truck size={20} />
                        IR AHORA
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEntregado(pedido._id)}
                        className="w-full bg-green-600 py-4 rounded-xl font-black uppercase text-sm flex items-center justify-center gap-2 hover:bg-green-700 transition-all shadow-lg shadow-green-900/30"
                      >
                        <CheckCircle size={20} />
                        MARCAR ENTREGADO
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}

            {/* Botón Actualizar */}
            {rutas.length > 0 && (
              <button
                onClick={fetchRutas}
                className="w-full bg-slate-800 py-4 rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2 hover:bg-slate-700 transition-all"
              >
                <RefreshCw size={14} /> Actualizar Lista
              </button>
            )}
          </div>
        )}

        {/* VISTA: HISTORIAL */}
        {vista === "historial" && (
          <div className="space-y-4">
            {historial.length === 0 ? (
              <div className="bg-[#1e293b] rounded-3xl p-12 text-center border-2 border-dashed border-slate-800">
                <Clock className="mx-auto mb-4 text-slate-600" size={48} />
                <p className="text-slate-500 font-bold uppercase text-sm">
                  Sin entregas hoy
                </p>
              </div>
            ) : (
              historial.map((pedido) => (
                <div
                  key={pedido._id}
                  className="bg-[#1e293b] rounded-2xl border border-slate-800 p-4"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-slate-500">FOLIO</p>
                      <p className="font-black text-green-500">
                        {pedido.folio}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-500">CLIENTE</p>
                      <p className="font-bold text-sm">
                        {pedido.clienteId?.nombre}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-800">
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                      Entregado ✓
                    </span>
                    <span className="text-green-500 font-black">
                      ${pedido.total}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* RESUMEN FLOTANTE */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#1e293b] border-t border-slate-800 p-4">
        <div className="max-w-lg mx-auto flex justify-between items-center">
          <div>
            <p className="text-[10px] text-slate-500 uppercase">
              Rutas Pendientes
            </p>
            <p className="text-2xl font-black text-orange-500">
              {rutas.length}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-500 uppercase">
              Entregados Hoy
            </p>
            <p className="text-2xl font-black text-green-500">
              {historial.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepartidorDashboard;
