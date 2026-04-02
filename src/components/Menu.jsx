import { useState, useEffect } from "react";
import clienteAxios from "../api/axios";

const Menu = () => {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const BACKEND_URL = "https://backend-production-0532.up.railway.app";

  useEffect(() => {
    // Cargar productos del backend
    const fetchProductos = async () => {
      try {
        const res = await clienteAxios.get("/api/products");
        setProductos(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchProductos();

    // Sincronizar carrito local
    const savedCart = JSON.parse(localStorage.getItem("carrito")) || [];
    setCarrito(savedCart);
  }, []);

  const agregarAlCarrito = (producto) => {
    let nuevoCarrito = [...carrito];
    const index = nuevoCarrito.findIndex((i) => i._id === producto._id);

    if (index >= 0) {
      nuevoCarrito[index].cantidad += 1;
    } else {
      nuevoCarrito.push({ ...producto, cantidad: 1 });
    }

    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    alert(`${producto.nombre} añadido! 🛒`);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="bg-white p-8 text-center shadow-sm border-b-4 border-orange-500">
        <h1 className="text-3xl font-black italic uppercase">
          Menú <span className="text-orange-500">Leños</span>
        </h1>
        <p className="text-slate-500 text-sm">Elige tus sabores favoritos</p>
      </div>

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {productos.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-3xl shadow-lg overflow-hidden border border-slate-100"
          >
            <img
              /* 🔥 CORRECCIÓN AQUÍ: Usamos imagenUrl y quitamos /uploads/ manual */
              src={`${BACKEND_URL}${item.imagenUrl}`}
              className="h-48 w-full object-cover"
              alt={item.nombre}
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/400x300?text=Sin+Imagen";
              }}
            />
            <div className="p-5 text-center">
              <span className="text-[10px] bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-black uppercase">
                {item.categoria}
              </span>
              <h3 className="text-xl font-bold mt-2 uppercase">
                {item.nombre}
              </h3>
              <p className="text-2xl font-black text-slate-800 my-2">
                ${item.precio}
              </p>
              <button
                onClick={() => agregarAlCarrito(item)}
                className="w-full bg-orange-500 text-white py-3 rounded-2xl font-black hover:bg-slate-900 transition-all uppercase"
              >
                Agregar 🔥
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
