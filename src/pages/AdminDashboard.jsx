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

  // Carga de productos desde /api/products (Ruta de tu Postman)
  const fetchInventario = async () => {
    try {
      const res = await clienteAxios.get("/products");
      setInventario(res.data);
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

          {/* 2. CATÁLOGO (Solo visualización de lo que hay en el backend) */}
          {activeTab === "catalogo" && <CatalogoStock productos={inventario} />}

          {/* 3. GESTIÓN DE STOCK (Editor para subir nuevos productos como en Postman) */}
          {activeTab === "stock" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <InventarioEditor onSuccess={fetchInventario} />
              <div className="bg-[#1e293b] p-6 rounded-3xl border border-slate-800 text-center flex flex-col justify-center">
                <p className="text-slate-500 uppercase font-black italic">
                  Vista previa de carga activa
                </p>
              </div>
            </div>
          )}

          {/* 4. PERSONAL (Alta de Repartidores y Administradores) */}
          {activeTab === "personal" && <UsuariosManager />}

          {/* 5. REPORTE DIARIO (Espacio para tus métricas de ventas) */}
          {activeTab === "reporte" && (
            <div className="bg-[#1e293b] p-20 rounded-3xl border border-slate-800 text-center">
              <h2 className="text-2xl font-black uppercase italic">
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
