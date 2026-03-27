import { useState } from "react";
import clienteAxios from "../../api/axios";

const InventarioEditor = ({ refresh }) => {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    stock: "",
    descripcion: "",
    categoria: "Dulce",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    if (file) data.append("imagen", file);
    data.append("nombre", formData.nombre);
    data.append("precio", formData.precio);
    data.append("stock", formData.stock);
    data.append("descripcion", formData.descripcion);
    data.append("categoria", formData.categoria);

    try {
      await clienteAxios.post("/products", data);
      alert("¡Leño guardado con éxito! 🪵");
      setFormData({
        nombre: "",
        precio: "",
        stock: "",
        descripcion: "",
        categoria: "Dulce",
      });
      setFile(null);
      refresh(); // <--- Esto actualiza la lista de al lado automáticamente
    } catch (error) {
      alert("Error al guardar el producto");
    }
  };

  return (
    <div className="bg-[#1e293b] p-8 rounded-3xl border border-slate-800 shadow-2xl">
      <h2 className="text-xl font-black uppercase italic mb-6 text-center">
        Nuevo Producto
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full bg-[#0f172a] border border-slate-800 p-4 rounded-2xl"
          placeholder="Nombre (Ej: Leño Nutella)"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            className="bg-[#0f172a] border border-slate-800 p-4 rounded-2xl"
            placeholder="Precio ($)"
            value={formData.precio}
            onChange={(e) =>
              setFormData({ ...formData, precio: e.target.value })
            }
            required
          />
          <input
            type="number"
            className="bg-[#0f172a] border border-slate-800 p-4 rounded-2xl"
            placeholder="Stock Inicial"
            value={formData.stock}
            onChange={(e) =>
              setFormData({ ...formData, stock: e.target.value })
            }
            required
          />
        </div>
        <select
          className="w-full bg-[#0f172a] border border-slate-800 p-4 rounded-2xl"
          value={formData.categoria}
          onChange={(e) =>
            setFormData({ ...formData, categoria: e.target.value })
          }
        >
          <option value="Dulce">Dulce</option>
          <option value="Salado">Salado</option>
        </select>
        <textarea
          className="w-full bg-[#0f172a] border border-slate-800 p-4 rounded-2xl h-32"
          placeholder="Descripción deliciosa..."
          value={formData.descripcion}
          onChange={(e) =>
            setFormData({ ...formData, descripcion: e.target.value })
          }
        />
        <input
          type="file"
          className="block w-full text-sm text-slate-500"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button className="w-full bg-orange-600 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-orange-700 transition-all">
          Guardar en Inventario
        </button>
      </form>
    </div>
  );
};

export default InventarioEditor;
