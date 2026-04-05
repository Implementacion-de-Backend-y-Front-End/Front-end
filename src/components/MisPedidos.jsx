import { useState, useEffect } from "react";
import { Package, Truck, CheckCircle, Clock, XCircle } from "lucide-react";
import clienteAxios from "../api/axios";

// Configuración de estados con colores
const ESTADOS = {
  recibido: {
    label: "Recibido",
    color: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
    icon: Clock,
    description: "Esperando confirmación ⏳",
  },
  confirmado: {
    label: "Confirmado",
    color: "bg-blue-500/20 text-blue-500 border-blue-500/30",
    icon: Package,
    description: "En preparación 📦",
  },
  enCamino: {
    label: "En Camino",
    color: "bg-orange-500/20 text-orange-500 border-orange-500/30",
    icon: Truck,
    description: "Tu pedido va en camino 🚴",
  },
  entregado: {
    label: "Entregado",
    color: "bg-green-500/20 text-green-500 border-green-500/30",
    icon: CheckCircle,
    description: "¡Entregado! ✅",
  },
  cancelado: {
    label: "Cancelado",
    color: "bg-red-500/20 text-red-500 border-red-500/30",
    icon: XCircle,
    description: "Pedido cancelado ❌",
  },
};

const MisPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMisPedidos = async () => {
      try {
        setLoading(true);
        // RUTA CORRECTA - usa /api/orders/historial
        const res = await clienteAxios.get("/api/orders/historial");
        setPedidos(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error("Error al cargar pedidos:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchMisPedidos();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-slate-500 font-bold">
            Cargando tus pedidos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24 p-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-black italic mb-8 text-center uppercase">
          Mis <span className="text-orange-500">Pedidos</span>
        </h2>

        {pedidos.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl shadow-md text-center">
            <Package size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-400 font-bold">No tienes pedidos aún</p>
            <p className="text-slate-300 text-sm mt-2">
              ¡Haz tu primer pedido de Leños Rellenos!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {pedidos.map((p) => {
              const estadoConfig = ESTADOS[p.estado] || ESTADOS.recibido;
              const IconEstado = estadoConfig.icon;

              return (
                <div
                  key={p._id}
                  className="bg-white p-6 rounded-3xl shadow-md border-l-8 border-slate-900 relative overflow-hidden"
                >
                  {/* FOLIO */}
                  <div className="absolute top-4 right-4 font-mono font-black text-orange-500 text-lg">
                    {p.folio}
                  </div>

                  {/* ESTADO CON COLOR */}
                  <div className="mb-4">
                    <p className="text-xs text-slate-400 uppercase font-bold mb-2">
                      Estado:
                    </p>
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase border ${estadoConfig.color}`}
                    >
                      <IconEstado size={14} />
                      {estadoConfig.description}
                    </div>
                  </div>

                  {/* BARRA DE PROGRESO VISUAL */}
                  <div className="flex items-center gap-1 mb-4">
                    {["recibido", "confirmado", "enCamino", "entregado"].map(
                      (estado, idx) => (
                        <div
                          key={estado}
                          className={`h-2 flex-1 rounded-full transition-all ${
                            [
                              "recibido",
                              "confirmado",
                              "enCamino",
                              "entregado",
                            ].indexOf(p.estado) >= idx
                              ? p.estado === "cancelado"
                                ? "bg-red-500"
                                : "bg-orange-500"
                              : "bg-slate-200"
                          }`}
                        />
                      ),
                    )}
                  </div>

                  {/* PRODUCTOS */}
                  <div className="border-t pt-4">
                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-2">
                      Productos:
                    </p>
                    {p.productos.map((prod, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center py-1"
                      >
                        <span className="text-sm font-medium text-slate-700">
                          {prod.nombre}
                        </span>
                        <span className="text-sm font-bold text-slate-500">
                          x{prod.cantidad}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* TOTAL Y FECHA */}
                  <div className="mt-4 pt-4 border-t flex justify-between items-center">
                    <div className="text-xs text-slate-400">
                      {new Date(p.fechaPedido).toLocaleDateString("es-MX", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                    <p className="font-black text-xl text-slate-900">
                      ${p.total}.00
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MisPedidos;
