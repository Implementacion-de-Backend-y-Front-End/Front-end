import React, { useState, useEffect } from "react";
import { Eye, X, Loader2 } from "lucide-react";
import clienteAxios from "../../api/axios";

const PedidosManager = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [mostrarAsignar, setMostrarAsignar] = useState(false);
  const [repartidores, setRepartidores] = useState([]);
  const [repartidorSeleccionado, setRepartidorSeleccionado] = useState(null);

  useEffect(() => {
    fetchPedidos();
    fetchRepartidores();
  }, []);

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      const res = await clienteAxios.get("/admin/pending");
      console.log("Pedido seleccionado:", pedidoSeleccionado);
      setPedidos(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error al conectar:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRepartidores = async () => {
    try {
      const res = await clienteAxios.get("/users");
      const repartidoresFiltrados = res.data.filter(
        (user) => user.rol === "repartidor",
      );
      setRepartidores(repartidoresFiltrados);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRechazar = async (id) => {
    // Preguntamos para evitar errores accidentales
    if (!window.confirm("¿Estás seguro de que deseas rechazar este pedido?"))
      return;

    try {
      // Esta ruta debe coincidir con tu router.put("/reject/:id")
      await clienteAxios.put(`/admin/reject/${id}`);

      // Cerramos el modal y refrescamos la lista
      setPedidoSeleccionado(null);
      fetchPedidos();

      alert("Pedido rechazado con éxito.");
    } catch (err) {
      console.error("Error al rechazar:", err);
      alert("No se pudo rechazar el pedido. Revisa la consola.");
    }
  };

  const asignarRepartidor = async () => {
    if (!pedidoSeleccionado || !repartidorSeleccionado) return;
    try {
      await clienteAxios.put(`/admin/assign/${pedidoSeleccionado._id}`, {
        repartidorId: repartidorSeleccionado._id,
      });
      setMostrarAsignar(false);
      setPedidoSeleccionado(null);
      setRepartidorSeleccionado(null);
      fetchPedidos();
    } catch (err) {
      alert("Error al asignar");
    }
  };

  if (loading) {
    return (
      <div className="p-20 text-center font-black animate-pulse text-orange-500">
        BUSCANDO PEDIDOS EN EL SERVIDOR...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#1e293b] p-6 rounded-3xl border border-slate-800">
        <h2 className="text-xl font-black uppercase italic text-orange-500">
          Pedidos por Procesar
        </h2>
        <div className="bg-[#0f172a] px-4 py-2 rounded-full border border-slate-700 text-xs font-bold uppercase">
          Pendientes: <span className="text-orange-500">{pedidos.length}</span>
        </div>
      </div>

      <div className="grid gap-4">
        {pedidos.length === 0 ? (
          <div className="bg-[#1e293b] p-20 rounded-3xl border-2 border-dashed border-slate-800 text-center">
            <p className="text-slate-500 font-black uppercase italic tracking-widest text-sm">
              No hay pedidos pendientes en /admin/pending
            </p>
          </div>
        ) : (
          pedidos.map((pedido) => (
            <div
              key={pedido._id}
              className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 flex justify-between items-center"
            >
              <div>
                <p className="text-[10px] text-slate-500 font-black">
                  FOLIO: {pedido.folio || pedido._id.slice(-6).toUpperCase()}
                </p>
                <h3 className="font-bold text-white uppercase">
                  {pedido.clienteId?.nombre || "Cliente"}
                </h3>
                <p className="text-sm font-black text-green-500">
                  ${pedido.total}.00
                </p>
              </div>
              <button
                onClick={() => {
                  setPedidoSeleccionado(pedido);
                  console.log("Pedido seleccionado:", pedido);
                }}
                className="bg-[#0f172a] hover:bg-orange-600 text-white px-6 py-3 rounded-xl transition-all flex gap-2 items-center text-xs font-black uppercase"
              >
                <Eye size={16} /> Detalles
              </button>
            </div>
          ))
        )}
      </div>

      {pedidoSeleccionado && !mostrarAsignar && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e293b] border border-slate-700 w-full max-w-md rounded-3xl p-8 relative">
            <button
              onClick={() => setPedidoSeleccionado(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-black uppercase italic mb-6 text-orange-500 text-center">
              Detalle del Pedido
            </h2>

            <div className="bg-[#0f172a] p-5 rounded-2xl border border-slate-800 mb-6 space-y-4">
              <div className="space-y-2 border-b border-slate-800 pb-3">
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-black">
                  Cliente:
                </div>
                <div className="text-sm text-white font-bold uppercase">
                  {pedidoSeleccionado.clienteId?.nombre || "No disponible"}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-black pt-1">
                  Teléfono:
                </div>
                <div className="text-sm text-white font-bold">
                  {pedidoSeleccionado.clienteId?.telefono || "Sin teléfono"}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-black pt-1">
                  Dirección:
                </div>
                <div className="text-sm text-slate-400">
                  {pedidoSeleccionado.clienteId?.direcciones?.find(
                    (d) => d.principal,
                  )
                    ? `${pedidoSeleccionado.clienteId.direcciones.find((d) => d.principal).calle}, ${pedidoSeleccionado.clienteId.direcciones.find((d) => d.principal).colonia} (${pedidoSeleccionado.clienteId.direcciones.find((d) => d.principal).referencia})`
                    : "Sin dirección"}
                </div>

                {pedidoSeleccionado.direccion?.referencia && (
                  <div className="text-[10px] text-orange-400 italic">
                    Ref: {pedidoSeleccionado.direccion.referencia}
                  </div>
                )}
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-3">
                  Productos:
                </div>
                <div className="space-y-2">
                  {pedidoSeleccionado.productos?.map((p, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-slate-900/50 p-2 rounded-lg border border-slate-800/50"
                    >
                      <span className="text-xs text-white uppercase font-bold">
                        {p.nombre}
                      </span>
                      <span className="text-xs bg-orange-600/20 text-orange-500 px-2 py-0.5 rounded font-black">
                        x{p.cantidad}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                <div className="text-[9px] uppercase tracking-widest text-slate-500 font-black">
                  Registro:
                </div>
                <div className="text-[10px] text-slate-300 font-bold">
                  {new Date(pedidoSeleccionado.fechaPedido).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleRechazar(pedidoSeleccionado._id)}
                className="bg-red-600/10 text-red-500 border border-red-600/20 py-4 rounded-xl font-black uppercase text-[10px] hover:bg-red-600 hover:text-white transition-all"
              >
                Rechazar
              </button>
              <button
                onClick={() => setMostrarAsignar(true)}
                className="bg-green-600 text-white py-4 rounded-xl font-black uppercase text-[10px] hover:bg-green-700 transition-all shadow-lg shadow-green-900/20"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarAsignar && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e293b] border border-slate-700 w-full max-w-md rounded-3xl p-8 relative">
            <button
              onClick={() => {
                setMostrarAsignar(false);
                setRepartidorSeleccionado(null);
              }}
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-black uppercase italic mb-6 text-orange-500 text-center">
              Asignar Repartidor
            </h2>

            <div className="bg-[#0f172a] p-5 rounded-2xl border border-slate-800 mb-6 space-y-4">
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-3">
                Selecciona un Repartidor:
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {repartidores.length === 0 ? (
                  <p className="text-slate-500 text-sm">
                    No hay repartidores disponibles
                  </p>
                ) : (
                  repartidores.map((repartidor) => (
                    <div
                      key={repartidor._id}
                      onClick={() => setRepartidorSeleccionado(repartidor)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        repartidorSeleccionado?._id === repartidor._id
                          ? "border-orange-500 bg-orange-500/10"
                          : "border-slate-800 bg-slate-900/50 hover:border-slate-600"
                      }`}
                    >
                      <div className="text-sm text-white font-bold uppercase">
                        {repartidor.nombre}
                      </div>
                      <div className="text-xs text-slate-400">
                        {repartidor.telefono || "Sin teléfono"}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setMostrarAsignar(false);
                  setRepartidorSeleccionado(null);
                }}
                className="bg-slate-600 text-white py-4 rounded-xl font-black uppercase text-[10px] hover:bg-slate-700 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={asignarRepartidor}
                disabled={!repartidorSeleccionado}
                className="bg-green-600 text-white py-4 rounded-xl font-black uppercase text-[10px] hover:bg-green-700 transition-all shadow-lg shadow-green-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Asignar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PedidosManager;
