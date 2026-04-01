import { useState, useEffect } from "react";
import clienteAxios from "../api/axios";
import Sidebar from "../components/admin/Sidebar";
import PedidosManager from "../components/admin/PedidosManager";
import UsuariosManager from "../components/admin/UsuariosManager";
import InventarioEditor from "../components/admin/InventarioEditor";
import CatalogoStock from "../components/admin/CatalogoStock";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("pedidos");
  const [inventario, setInventario] = useState([]);

  // 1. Función de carga (Asegúrate de usar /api/products si tu backend lo requiere)
  const fetchInventario = async () => {
    try {
      const res = await clienteAxios.get("/api/products");
      // Validamos que sea un array para evitar errores de .map
      setInventario(Array.isArray(res.data) ? res.data : []);
      console.log("Inventario cargado:", res.data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  useEffect(() => {
    fetchInventario();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto animate-in fade-in duration-300">
          {/* 1. PEDIDOS */}
          {activeTab === "pedidos" && <PedidosManager />}

          {/* 2. CATÁLOGO */}
          {activeTab === "catalogo" && (
            <CatalogoStock productos={inventario} refresh={fetchInventario} />
          )}

          {/* 3. GESTIÓN DE STOCK */}
          {activeTab === "stock" && (
            <div className="flex justify-center items-start animate-in zoom-in duration-300">
              <div className="w-full max-w-2xl">
                {/* Pasamos refresh para que cuando guardes, 
          se actualice la lista de la otra pestaña automáticamente */}
                <InventarioEditor refresh={fetchInventario} />
              </div>
            </div>
          )}

          {/* 4. PERSONAL */}
          {activeTab === "personal" && <UsuariosManager />}

          {/* 5. REPORTE */}
          {activeTab === "reporte" && (
            <div className="bg-[#1e293b] p-20 rounded-3xl border border-slate-800 text-center">
              <h2 className="text-2xl font-black uppercase italic text-orange-500">
                Reporte de Ventas
              </h2>
              <p className="text-slate-500 mt-2">
                Próximamente: Gráficas de ingresos diarios.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
