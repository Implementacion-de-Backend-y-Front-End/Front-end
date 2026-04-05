import { useState, useEffect } from "react";
import clienteAxios from "../api/axios";

const Menu = () => {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const BACKEND_URL = "https://backend-production-0532.up.railway.app";

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await clienteAxios.get("/api/products");
        setProductos(res.data);
        const initialQtys = {};
        res.data.forEach((p) => (initialQtys[p._id] = 1));
        setCantidades(initialQtys);
      } catch (e) {
        console.error(e);
      }
    };
    fetchProductos();

    const savedCart = JSON.parse(localStorage.getItem("carrito")) || [];
    setCarrito(savedCart);
  }, []);

  const manejarCantidad = (id, accion) => {
    setCantidades((prev) => ({
      ...prev,
      [id]: accion === "mas" ? prev[id] + 1 : Math.max(1, prev[id] - 1),
    }));
  };

  const agregarAlCarrito = (producto) => {
    const cantidadSeleccionada = cantidades[producto._id] || 1;
    let nuevoCarrito = [...carrito];
    const index = nuevoCarrito.findIndex((i) => i._id === producto._id);

    if (index >= 0) {
      nuevoCarrito[index].cantidad += cantidadSeleccionada;
    } else {
      nuevoCarrito.push({ ...producto, cantidad: cantidadSeleccionada });
    }

    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    alert(`¡${cantidadSeleccionada}x ${producto.nombre} añadido(s)! 🪵`);

    setCantidades((prev) => ({ ...prev, [producto._id]: 1 }));
  };

  return (
    <div className="min-h-screen bg-[#FDF6E3] pb-24">
      <div className="bg-[#5D3A1A] p-8 text-center shadow-sm">
        <h1 className="text-3xl font-black italic uppercase text-white">
          Menú <span className="text-[#D4A574]">Leños</span>
        </h1>
        <p className="text-[#E8D5B7] text-sm">El sabor artesanal en tu mesa</p>
      </div>

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {productos.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-3xl shadow-xl overflow-hidden border border-[#E8D5B7] flex flex-col"
          >
            <div className="relative">
              <img
                src={`${BACKEND_URL}${item.imagenUrl}`}
                className="h-56 w-full object-cover"
                alt={item.nombre}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/400x300?text=Leño+Relleno";
                }}
              />
              <span className="absolute top-4 right-4 text-[10px] bg-[#8B4513] text-white px-3 py-1 rounded-full font-black uppercase shadow-lg">
                {item.categoria}
              </span>
            </div>

            <div className="p-6 flex-grow flex flex-col">
              <h3 className="text-xl font-black uppercase italic text-[#5D3A1A] text-center">
                {item.nombre}
              </h3>

              <p className="text-[#8B6914] text-xs text-center mt-2 leading-relaxed italic">
                {item.descripcion || "Sin descripción disponible."}
              </p>

              <p className="text-3xl font-black text-[#8B4513] text-center my-4">
                ${item.precio}
              </p>

              {/* SELECTOR DE CANTIDAD */}
              <div className="flex justify-center mb-6">
                <div className="bg-[#F5E6D3] rounded-2xl flex items-center gap-6 px-4 py-2 border border-[#E8D5B7]">
                  <button
                    onClick={() => manejarCantidad(item._id, "menos")}
                    className="text-2xl font-bold text-[#8B4513] hover:text-[#5D3A1A] px-2"
                  >
                    −
                  </button>
                  <span className="text-xl font-black text-[#5D3A1A] w-6 text-center">
                    {cantidades[item._id] || 1}
                  </span>
                  <button
                    onClick={() => manejarCantidad(item._id, "mas")}
                    className="text-2xl font-bold text-[#8B4513] hover:text-[#5D3A1A] px-2"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={() => agregarAlCarrito(item)}
                className="w-full bg-[#5D3A1A] text-white py-4 rounded-2xl font-black hover:bg-[#8B4513] transition-all uppercase shadow-lg active:scale-95"
              >
                Agregar al Carrito 🪵
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
