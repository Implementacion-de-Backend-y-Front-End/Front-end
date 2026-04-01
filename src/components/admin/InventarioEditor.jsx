import { useState, useEffect } from "react";
import clienteAxios from "../../api/axios";

const InventarioEditor = ({ refresh }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null); // 🔥 Estado para la vista previa
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    stock: "",
    descripcion: "",
    categoria: "Dulce",
  });

  // Generar vista previa cuando cambie el archivo
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    if (file) data.append("imagen", file);
    data.append("nombre", formData.nombre);
    data.append("precio", formData.precio);
    data.append("stock", formData.stock);
    data.append("descripcion", formData.descripcion);
    data.append("categoria", formData.categoria);

    try {
      // Ajustado a /api/products para que coincida con tu server
      await clienteAxios.post("/api/products", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("¡Leño guardado con éxito! 🪵🔥");

      setFormData({
        nombre: "",
        precio: "",
        stock: "",
        descripcion: "",
        categoria: "Dulce",
      });
      setFile(null);
      if (refresh) refresh();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error al guardar el producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-[#1e293b] p-8 rounded-3xl border border-slate-800 shadow-2xl text-white">
      {/* --- FORMULARIO --- */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-black uppercase italic mb-6 text-orange-500">
          Nuevo Producto
        </h2>

        <input
          className="w-full bg-[#0f172a] border border-slate-800 p-4 rounded-2xl outline-none focus:border-orange-500 transition-all"
          placeholder="Nombre (Ej: Leño Nutella)"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            className="bg-[#0f172a] border border-slate-800 p-4 rounded-2xl outline-none focus:border-orange-500"
            placeholder="Precio ($)"
            value={formData.precio}
            onChange={(e) =>
              setFormData({ ...formData, precio: e.target.value })
            }
            required
          />
          <input
            type="number"
            className="bg-[#0f172a] border border-slate-800 p-4 rounded-2xl outline-none focus:border-orange-500"
            placeholder="Stock Inicial"
            value={formData.stock}
            onChange={(e) =>
              setFormData({ ...formData, stock: e.target.value })
            }
            required
          />
        </div>

        <select
          className="w-full bg-[#0f172a] border border-slate-800 p-4 rounded-2xl outline-none focus:border-orange-500 cursor-pointer"
          value={formData.categoria}
          onChange={(e) =>
            setFormData({ ...formData, categoria: e.target.value })
          }
        >
          <option value="Dulce">🍩 Dulce</option>
          <option value="Salado">🥓 Salado</option>
          <option value="Especial">✨ Especial</option>
        </select>

        <textarea
          className="w-full bg-[#0f172a] border border-slate-800 p-4 rounded-2xl h-32 outline-none focus:border-orange-500 resize-none"
          placeholder="Descripción deliciosa..."
          value={formData.descripcion}
          onChange={(e) =>
            setFormData({ ...formData, descripcion: e.target.value })
          }
        />

        <div className="relative">
          <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">
            Foto del Producto
          </label>
          <input
            type="file"
            accept="image/*"
            className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-600 file:text-white hover:file:bg-orange-700 cursor-pointer"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <button
          disabled={loading}
          className={`w-full ${loading ? "bg-slate-600" : "bg-orange-600 hover:bg-orange-700"} py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg active:scale-95`}
        >
          {loading ? "GUARDANDO..." : "GUARDAR EN INVENTARIO"}
        </button>
      </form>

      {/* --- VISTA PREVIA (LADO DERECHO) --- */}
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-3xl p-6 bg-[#0f172a]/50">
        <p className="text-slate-500 font-bold mb-4 uppercase text-xs tracking-widest">
          Vista Previa
        </p>

        {preview ? (
          <div className="w-full max-w-[280px] bg-[#1e293b] rounded-3xl overflow-hidden shadow-2xl border border-slate-700">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-black italic uppercase text-lg truncate">
                {formData.nombre || "Nombre del Leño"}
              </h3>
              <p className="text-orange-500 font-black text-xl">
                ${formData.precio || "0.00"}
              </p>
              <p className="text-slate-400 text-xs mt-2 line-clamp-2">
                {formData.descripcion || "Aquí se verá la descripción..."}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <span className="text-6xl mb-4 block opacity-20">📸</span>
            <p className="text-slate-600 text-sm italic">
              Selecciona una imagen para ver el resultado
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventarioEditor;
