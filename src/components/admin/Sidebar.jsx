import { ShoppingBag, BookOpen, Package, Users, BarChart3 } from "lucide-react";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: "pedidos", label: "Pedidos", icon: <ShoppingBag size={20} /> },
    { id: "catalogo", label: "Catálogo", icon: <BookOpen size={20} /> },
    { id: "stock", label: "Gestión de Stock", icon: <Package size={20} /> },
    { id: "personal", label: "Personal", icon: <Users size={20} /> },
    { id: "reporte", label: "Reporte Diario", icon: <BarChart3 size={20} /> },
  ];

  return (
    <aside className="w-64 bg-[#1e293b] border-r border-slate-800 p-6 flex flex-col min-h-screen">
      <div className="mb-10 px-2 text-center">
        <h2 className="text-orange-500 font-black uppercase italic tracking-tighter text-xl">
          Leños <span className="text-white">Panel</span>
        </h2>
      </div>

      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all uppercase text-[11px] tracking-wider ${
              activeTab === item.id
                ? "bg-orange-600 text-white shadow-lg shadow-orange-900/40"
                : "text-slate-400 hover:bg-[#0f172a] hover:text-white"
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
