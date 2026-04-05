// src/components/admin/PedidosManager.jsx
import React, { useState, useEffect } from "react";
import { Eye, X, Check, Truck, Phone } from "lucide-react";
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
      const res = await clienteAxios.get("/api/admin/pending");
      setPedidos(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error al conectar:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRepartidores = async () => {
    try {
      const res = await clienteAxios.get("/api/users");
      const repartidoresFiltrados = res.data.filter(
        (user) => user.rol === "repartidor",
      );
      setRepartidores(repartidoresFiltrados);
    } catch (err) {
      console.error(err);
    }
  };

  // CONFIRMAR PEDIDO - Envía WhatsApp al cliente
  const handleConfirmar = async () => {
    if (!pedidoSeleccionado) return;
    try {
      const res = await clienteAxios.put(
        `/api/admin/accept/${pedidoSeleccionado._id}`,
      );
      // Abrir WhatsApp en nueva pestaña
      if (res.data.whatsappUrl) {
        window.open(res.data.whatsappUrl, "_blank");
      }
      alert(
        "✅ Pedido confirmado. Se abrió WhatsApp para notificar al cliente.",
      );
      setMostrarAsignar(true); // Pasar a asignar repartidor
    } catch (err) {
      console.error("Error al confirmar:", err);
      alert("No se pudo confirmar el pedido.");
    }
  };

  // ASIGNAR REPARTIDOR - Envía WhatsApp al repartidor
  const asignarRepartidor = async () => {
    if (!pedidoSeleccionado || !repartidorSeleccionado) return;
    try {
      const res = await clienteAxios.put(
        `/api/admin/assign/${pedidoSeleccionado._id}`,
        {
          repartidorId: repartidorSeleccionado._id,
        },
      );
      // Abrir WhatsApp para el repartidor
      if (res.data.whatsappUrl) {
        window.open(res.data.whatsappUrl, "_blank");
      }
      alert(
        `✅ Pedido asignado a ${repartidorSeleccionado.nombre}. Se abrió WhatsApp.`,
      );
      setMostrarAsignar(false);
      setPedidoSeleccionado(null);
      setRepartidorSeleccionado(null);
      fetchPedidos();
    } catch (err) {
      alert("Error al asignar: " + (err.response?.data?.message || ""));
    }
  };

  const handleRechazar = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas rechazar este pedido?"))
      return;
    try {
      await clienteAxios.put(`/api/admin/reject/${id}`);
      setPedidoSeleccionado(null);
      fetchPedidos();
      alert("Pedido rechazado.");
    } catch (err) {
      console.error("Error al rechazar:", err);
      alert("No se pudo rechazar el pedido.");
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
              No hay pedidos pendientes
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
                onClick={() => setPedidoSeleccionado(pedido)}
                className="bg-[#0f172a] hover:bg-orange-600 text-white px-6 py-3 rounded-xl transition-all flex gap-2 items-center text-xs font-black uppercase"
              >
                <Eye size={16} /> Detalles
              </button>
            </div>
          ))
        )}
      </div>

      {/* MODAL DE DETALLES */}
      {pedidoSeleccionado && !mostrarAsignar && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e293b] border border-slate-700 w-full max-w-md rounded-3xl p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setPedidoSeleccionado(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-black uppercase italic mb-4 text-orange-500 text-center">
              Detalle del Pedido
            </h2>

            {/* FOLIO DESTACADO */}
            <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-2xl mb-4 text-center">
              <p className="text-[10px] text-orange-400 uppercase font-black">
                Folio
              </p>
              <p className="text-2xl font-black text-orange-500">
                {pedidoSeleccionado.folio}
              </p>
            </div>

            <div className="bg-[#0f172a] p-5 rounded-2xl border border-slate-800 mb-6 space-y-4">
              {/* CLIENTE */}
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
                <div className="text-sm text-white font-bold flex items-center gap-2">
                  <Phone size={14} className="text-green-500" />
                  {pedidoSeleccionado.clienteId?.telefono || "Sin teléfono"}
                </div>
              </div>

              {/* DIRECCIÓN */}
              <div className="border-b border-slate-800 pb-3">
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-black">
                  Dirección de Entrega:
                </div>
                <div className="text-sm text-slate-300 mt-1">
                  {pedidoSeleccionado.direccion?.calle && (
                    <p>📍 {pedidoSeleccionado.direccion.calle}</p>
                  )}
                  {pedidoSeleccionado.direccion?.colonia && (
                    <p className="text-slate-400">
                      {pedidoSeleccionado.direccion.colonia}
                    </p>
                  )}
                  {pedidoSeleccionado.direccion?.referencia && (
                    <p className="text-orange-400 text-xs italic mt-1">
                      Ref: {pedidoSeleccionado.direccion.referencia}
                    </p>
                  )}
                </div>
              </div>

              {/* PRODUCTOS */}
              <div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-3">
                  Productos:
                </div>
                <div className="space-y-2">
                  {pedidoSeleccionado.productos?.map((p, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg border border-slate-800/50"
                    >
                      <span className="text-xs text-white uppercase font-bold">
                        {p.nombre}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs bg-orange-600/20 text-orange-500 px-2 py-0.5 rounded font-black">
                          x{p.cantidad}
                        </span>
                        <span className="text-xs text-green-400 font-bold">
                          ${p.subtotal || p.precioUnitario * p.cantidad}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* TOTAL */}
              <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                <div className="text-sm uppercase text-slate-400 font-black">
                  Total:
                </div>
                <div className="text-2xl text-green-500 font-black">
                  ${pedidoSeleccionado.total}.00
                </div>
              </div>

              {/* FECHA */}
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-500">Fecha del pedido:</span>
                <span className="text-slate-300">
                  {new Date(pedidoSeleccionado.fechaPedido).toLocaleString()}
                </span>
              </div>
            </div>

            {/* BOTONES */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleRechazar(pedidoSeleccionado._id)}
                className="bg-red-600/10 text-red-500 border border-red-600/20 py-4 rounded-xl font-black uppercase text-[10px] hover:bg-red-600 hover:text-white transition-all"
              >
                Rechazar
              </button>
              <button
                onClick={handleConfirmar}
                className="bg-green-600 text-white py-4 rounded-xl font-black uppercase text-[10px] hover:bg-green-700 transition-all shadow-lg shadow-green-900/20 flex items-center justify-center gap-2"
              >
                <Check size={16} /> Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE ASIGNAR REPARTIDOR */}
      {mostrarAsignar && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e293b] border border-slate-700 w-full max-w-md rounded-3xl p-8 relative">
            <button
              onClick={() => {
                setMostrarAsignar(false);
                setPedidoSeleccionado(null);
                setRepartidorSeleccionado(null);
                fetchPedidos();
              }}
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-black uppercase italic mb-2 text-orange-500 text-center">
              Asignar Repartidor
            </h2>
            <p className="text-center text-slate-400 text-xs mb-6">
              Pedido {pedidoSeleccionado?.folio} confirmado ✅
            </p>

            <div className="bg-[#0f172a] p-5 rounded-2xl border border-slate-800 mb-6 space-y-4">
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-3">
                Selecciona un Repartidor:
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {repartidores.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-4">
                    No hay repartidores disponibles
                  </p>
                ) : (
                  repartidores.map((repartidor) => (
                    <div
                      key={repartidor._id}
                      onClick={() => setRepartidorSeleccionado(repartidor)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                        repartidorSeleccionado?._id === repartidor._id
                          ? "border-orange-500 bg-orange-500/10"
                          : "border-slate-800 bg-slate-900/50 hover:border-slate-600"
                      }`}
                    >
                      <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                        <Truck size={18} className="text-orange-500" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-white font-bold uppercase">
                          {repartidor.nombre}
                        </div>
                        <div className="text-xs text-slate-400">
                          {repartidor.telefono || "Sin teléfono"}
                        </div>
                      </div>
                      {repartidorSeleccionado?._id === repartidor._id && (
                        <Check size={18} className="text-orange-500" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setMostrarAsignar(false);
                  setPedidoSeleccionado(null);
                  setRepartidorSeleccionado(null);
                  fetchPedidos();
                }}
                className="bg-slate-600 text-white py-4 rounded-xl font-black uppercase text-[10px] hover:bg-slate-700 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={asignarRepartidor}
                disabled={!repartidorSeleccionado}
                className="bg-green-600 text-white py-4 rounded-xl font-black uppercase text-[10px] hover:bg-green-700 transition-all shadow-lg shadow-green-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Truck size={16} /> Asignar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PedidosManager;
