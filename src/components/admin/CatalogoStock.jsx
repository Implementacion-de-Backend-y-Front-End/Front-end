import { Trash2 } from "lucide-react";
import clienteAxios from "../../api/axios";

const CatalogoStock = ({ productos, refresh }) => {
  const handleEliminar = async (id, nombre) => {
    const confirmar = window.confirm(`¿Seguro que quieres borrar "${nombre}"?`);
    if (!confirmar) return;

    try {
      /**
       * EXPLICACIÓN DEL CAMBIO:
       * En tu server.js usas app.use("/api/products", productRoutes).
       * Si tu clienteAxios ya tiene "/api" como baseURL, solo debes poner "/products".
       * NO agregues "/admin" porque esa es otra ruta distinta en tu server.js.
       */
      await clienteAxios.delete(`/products/${id}`);

      alert("¡Leño eliminado con éxito! 🪵🔥");

      // 4. Recargar la lista para que el producto desaparezca visualmente
      if (refresh) {
        refresh();
      }
    } catch (error) {
      console.error("Error al eliminar:", error.response);

      if (error.response?.status === 404) {
        alert(
          "Error 404: El servidor no encuentra la ruta de borrado. Revisa el archivo de rutas.",
        );
      } else if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        alert("No tienes permisos de administrador o tu sesión expiró.");
      } else {
        alert("Ocurrió un error al intentar eliminar el producto.");
      }
    }
  };

  return (
    <div className="bg-[#1e293b] p-8 rounded-3xl border border-slate-800 shadow-2xl h-full">
      <h2 className="text-xl font-black uppercase italic mb-6 text-center">
        Resumen de <span className="text-orange-500">Stock</span>
      </h2>
      <div className="space-y-4">
        {productos.map((item) => (
          <div
            key={item._id}
            className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800 flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-600/20 rounded-xl flex items-center justify-center font-black text-orange-500">
                {item.nombre ? item.nombre.charAt(0) : "L"}
              </div>
              <div>
                <h3 className="font-bold uppercase text-sm tracking-tight text-white">
                  {item.nombre}
                </h3>
                <p className="text-[10px] text-slate-500 uppercase font-black">
                  Categoría: {item.categoria}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-orange-500 font-black">
                {item.stock} pz
              </span>
              <button
                type="button"
                onClick={() => handleEliminar(item._id, item.nombre)}
                className="text-slate-600 hover:text-red-500 transition-colors p-2"
                title="Eliminar producto"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CatalogoStock;
