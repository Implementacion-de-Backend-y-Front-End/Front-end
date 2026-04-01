import { useState, useEffect } from "react";
import clienteAxios from "../../api/axios";

const InventarioEditor = ({ refresh }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    stock: "",
    descripcion: "",
    categoria: "Dulce",
  });

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
      alert(error.response?.data?.message || "Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-[#1e293b] p-8 rounded-3xl border border-slate-800 shadow-2xl text-white">
      <h2 className="text-xl font-black uppercase italic mb-8 text-center text-orange-500 tracking-tighter">
        NUEVO PRODUCTO
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Datos Principales */}
        <input
          className="w-full bg-[#0f172a] border border-slate-800 p-4 rounded-2xl outline-none focus:border-orange-500 transition-all placeholder:text-slate-600"
          placeholder="Nombre (Ej: Leño Nutella)"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            className="bg-[#0f172a] border border-slate-800 p-4 rounded-2xl outline-none focus:border-orange-500 placeholder:text-slate-600"
            placeholder="Precio ($)"
            value={formData.precio}
            onChange={(e) =>
              setFormData({ ...formData, precio: e.target.value })
            }
            required
          />
          <input
            type="number"
            className="bg-[#0f172a] border border-slate-800 p-4 rounded-2xl outline-none focus:border-orange-500 placeholder:text-slate-600"
            placeholder="Stock"
            value={formData.stock}
            onChange={(e) =>
              setFormData({ ...formData, stock: e.target.value })
            }
            required
          />
        </div>

        <select
          className="w-full bg-[#0f172a] border border-slate-800 p-4 rounded-2xl outline-none focus:border-orange-500 cursor-pointer text-slate-300"
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
          className="w-full bg-[#0f172a] border border-slate-800 p-4 rounded-2xl h-28 outline-none focus:border-orange-500 resize-none placeholder:text-slate-600"
          placeholder="Descripción del leño..."
          value={formData.descripcion}
          onChange={(e) =>
            setFormData({ ...formData, descripcion: e.target.value })
          }
        />

        {/* Sección de Carga e Imagen debajo */}
        <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800">
          <label className="block text-xs font-black text-slate-500 mb-4 uppercase tracking-widest text-center">
            Foto del Producto
          </label>

          <div className="flex flex-col items-center space-y-4">
            <input
              type="file"
              accept="image/*"
              id="file-upload"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label
              htmlFor="file-upload"
              className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-full cursor-pointer text-sm font-bold transition-all border border-slate-700"
            >
              {file ? "Cambiar Imagen" : "Seleccionar Archivo"}
            </label>

            {/* VISTA PREVIA INTEGRADA */}
            {preview ? (
              <div className="mt-4 w-full max-w-[200px] aspect-square rounded-2xl overflow-hidden border-2 border-orange-500/50 shadow-lg animate-in fade-in zoom-in duration-300">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="mt-4 w-full max-w-[200px] aspect-square rounded-2xl border-2 border-dashed border-slate-800 flex flex-col items-center justify-center text-slate-700">
                <span className="text-4xl">📸</span>
                <p className="text-[10px] uppercase font-black mt-2">
                  Sin imagen
                </p>
              </div>
            )}
          </div>
        </div>

        <button
          disabled={loading}
          className={`w-full ${loading ? "bg-slate-700" : "bg-orange-600 hover:bg-orange-700"} py-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 text-white`}
        >
          {loading ? "PROCESANDO..." : "GUARDAR EN INVENTARIO"}
        </button>
      </form>
    </div>
  );
};

export default InventarioEditor;
