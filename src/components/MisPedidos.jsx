import { useState, useEffect } from "react";
import clienteAxios from "../api/axios";

const MisPedidos = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const fetchMisPedidos = async () => {
      try {
        const res = await clienteAxios.get("/api/orders/user"); // Ruta de tus pedidos
        setPedidos(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchMisPedidos();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-black italic mb-8 text-center uppercase">
        Mis <span className="text-orange-500">Pedidos</span>
      </h2>
      <div className="space-y-6">
        {pedidos.map((p) => (
          <div
            key={p._id}
            className="bg-white p-6 rounded-3xl shadow-md border-l-8 border-slate-900 relative"
          >
            <div className="absolute top-4 right-4 font-mono font-black text-orange-500">
              #{p.folio}
            </div>
            <p className="text-xs text-slate-400 uppercase font-bold">
              Estado:
            </p>
            <span
              className={`px-4 py-1 rounded-full text-xs font-black uppercase ${p.status === "pendiente" ? "bg-yellow-100 text-yellow-600" : "bg-green-100 text-green-600"}`}
            >
              {p.status === "pendiente"
                ? "Esperando confirmación ⏳"
                : "Confirmado y en camino ✅"}
            </span>
            <div className="mt-4 border-t pt-4">
              {p.productos.map((prod, idx) => (
                <p key={idx} className="text-sm font-medium">
                  {prod.nombre} x{prod.cantidad}
                </p>
              ))}
            </div>
            <p className="mt-4 font-black text-xl text-right">${p.total}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MisPedidos;
