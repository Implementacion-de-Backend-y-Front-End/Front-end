import React, { useState, useEffect } from "react";
import {
  DollarSign,
  Package,
  Clock,
  Truck,
  Star,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import clienteAxios from "../../api/axios";

const ReporteDiario = () => {
  const [reporte, setReporte] = useState(null);
  const [stockAlerts, setStockAlerts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reporteRes, stockRes] = await Promise.all([
        clienteAxios.get("/api/reports/daily"),
        clienteAxios.get("/api/reports/stock-alerts"),
      ]);
      setReporte(reporteRes.data);
      setStockAlerts(stockRes.data);
    } catch (error) {
      console.error("Error al cargar reporte:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-20 text-center">
        <RefreshCw className="animate-spin mx-auto text-orange-500" size={32} />
        <p className="mt-4 text-slate-400 font-bold">Generando reporte...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center bg-[#1e293b] p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-xl font-black uppercase italic text-orange-500">
            Reporte Diario
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            {new Date().toLocaleDateString("es-MX", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <button
          onClick={fetchData}
          className="bg-[#0f172a] hover:bg-orange-600 text-white px-4 py-2 rounded-xl transition-all flex gap-2 items-center text-xs font-black uppercase"
        >
          <RefreshCw size={14} /> Actualizar
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Ventas */}
        <div className="bg-gradient-to-br from-green-600/20 to-green-900/20 p-6 rounded-2xl border border-green-600/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
              <DollarSign size={20} className="text-green-500" />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-green-400 font-black">
              Ventas Hoy
            </span>
          </div>
          <p className="text-3xl font-black text-green-500">
            ${reporte?.kpis?.totalVentas || 0}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {reporte?.kpis?.totalPedidosHoy || 0} pedidos
          </p>
        </div>

        {/* Pedidos Completados */}
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 p-6 rounded-2xl border border-blue-600/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Package size={20} className="text-blue-500" />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-blue-400 font-black">
              Entregados
            </span>
          </div>
          <p className="text-3xl font-black text-blue-500">
            {reporte?.kpis?.pedidosCompletados || 0}
          </p>
          <p className="text-xs text-slate-500 mt-1">completados hoy</p>
        </div>

        {/* Pedidos Pendientes */}
        <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-900/20 p-6 rounded-2xl border border-yellow-600/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
              <Clock size={20} className="text-yellow-500" />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-yellow-400 font-black">
              Pendientes
            </span>
          </div>
          <p className="text-3xl font-black text-yellow-500">
            {reporte?.kpis?.pedidosPendientes || 0}
          </p>
          <p className="text-xs text-slate-500 mt-1">por procesar</p>
        </div>

        {/* En Camino */}
        <div className="bg-gradient-to-br from-orange-600/20 to-orange-900/20 p-6 rounded-2xl border border-orange-600/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <Truck size={20} className="text-orange-500" />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-orange-400 font-black">
              En Camino
            </span>
          </div>
          <p className="text-3xl font-black text-orange-500">
            {reporte?.kpis?.pedidosEnCamino || 0}
          </p>
          <p className="text-xs text-slate-500 mt-1">en ruta</p>
        </div>
      </div>

      {/* PRODUCTO ESTRELLA + STOCK CRÍTICO */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Producto Estrella */}
        <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
              <Star size={24} className="text-yellow-500" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase text-yellow-500">
                Producto Estrella
              </h3>
              <p className="text-[10px] text-slate-500">Más vendido hoy</p>
            </div>
          </div>
          <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-800">
            <p className="text-xl font-black text-white">
              {reporte?.kpis?.productoEstrella?.nombre || "Sin ventas"}
            </p>
            <p className="text-sm text-orange-500 font-bold mt-1">
              {reporte?.kpis?.productoEstrella?.cantidad || 0} unidades vendidas
            </p>
          </div>
        </div>

        {/* Alertas de Stock */}
        <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
              <AlertTriangle size={24} className="text-red-500" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase text-red-500">
                Stock Crítico
              </h3>
              <p className="text-[10px] text-slate-500">
                Menos de {stockAlerts?.umbralCritico || 10} unidades
              </p>
            </div>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {stockAlerts?.productosCriticos?.length === 0 ? (
              <div className="bg-green-500/10 border border-green-500/30 p-3 rounded-xl text-center">
                <p className="text-green-500 text-sm font-bold">
                  ✅ Todo el inventario está OK
                </p>
              </div>
            ) : (
              stockAlerts?.productosCriticos?.map((producto) => (
                <div
                  key={producto._id}
                  className={`flex justify-between items-center p-3 rounded-xl border ${
                    producto.stock <= 0
                      ? "bg-red-500/10 border-red-500/30"
                      : "bg-yellow-500/10 border-yellow-500/30"
                  }`}
                >
                  <span className="text-sm text-white font-bold">
                    {producto.nombre}
                  </span>
                  <span
                    className={`text-sm font-black px-2 py-1 rounded ${
                      producto.stock <= 0
                        ? "bg-red-500 text-white"
                        : "bg-yellow-500/20 text-yellow-500"
                    }`}
                  >
                    {producto.stock <= 0 ? "AGOTADO" : `${producto.stock} uds`}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* INVENTARIO COMPLETO */}
      <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp size={20} className="text-orange-500" />
          <h3 className="text-sm font-black uppercase text-orange-500">
            Inventario Completo
          </h3>
        </div>
        <div className="grid gap-2">
          {stockAlerts?.inventarioCompleto?.map((producto) => (
            <div
              key={producto._id}
              className="flex justify-between items-center bg-[#0f172a] p-3 rounded-xl border border-slate-800"
            >
              <div className="flex items-center gap-3">
                {producto.imagen && (
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                )}
                <div>
                  <p className="text-sm text-white font-bold">
                    {producto.nombre}
                  </p>
                  <p className="text-xs text-slate-500">${producto.precio}</p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-lg font-black ${
                    producto.stock <= 0
                      ? "text-red-500"
                      : producto.stock < 10
                        ? "text-yellow-500"
                        : "text-green-500"
                  }`}
                >
                  {producto.stock}
                </p>
                <p className="text-[10px] text-slate-500 uppercase">unidades</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReporteDiario;
