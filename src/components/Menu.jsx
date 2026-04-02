import { useState, useEffect } from "react";
import clienteAxios from "../api/axios";

const Menu = () => {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  // Estado para manejar las cantidades individuales de cada tarjeta
  const [cantidades, setCantidades] = useState({});
  const BACKEND_URL = "https://backend-production-0532.up.railway.app";

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await clienteAxios.get("/api/products");
        setProductos(res.data);

        // Inicializamos el estado de cantidades (todos en 1)
        const initialQtys = {};
        res.data.forEach((p) => {
          initialQtys[p._id] = 1;
        });
        setCantidades(initialQtys);
      } catch (e) {
        console.error("Error al cargar productos:", e);
      }
    };
    fetchProductos();

    const savedCart = JSON.parse(localStorage.getItem("carrito")) || [];
    setCarrito(savedCart);
  }, []);

  const modificarCantidadLocal = (id, accion) => {
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
    alert(`¡${cantidadSeleccionada}x ${producto.nombre} añadido(s)! 🔥`);

    // Opcional: resetear a 1 después de agregar
    setCantidades((prev) => ({ ...prev, [producto._id]: 1 }));
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Encabezado */}
      <div className="bg-white p-8 text-center shadow-sm border-b-4 border-orange-500">
        <h1 className="text-4xl font-black italic uppercase">
          MENÚ <span className="text-orange-500">LEÑOS</span>
        </h1>
        <p className="text-slate-500 text-sm mt-2">
          El sabor artesanal en tu mesa
        </p>
      </div>

      {/* Grid de Productos */}
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {productos.length > 0 ? (
          productos.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-[35px] shadow-xl overflow-hidden border border-slate-100 flex flex-col transition-transform hover:scale-[1.02]"
            >
              {/* Imagen y Categoría */}
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
                <span className="absolute top-4 right-4 bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-[10px] font-black uppercase shadow-sm">
                  {item.categoria}
                </span>
              </div>

              {/* Contenido de la Card */}
              <div className="p-6 flex flex-col flex-grow items-center text-center">
                <h3 className="text-xl font-black uppercase italic text-slate-800">
                  {item.nombre}
                </h3>

                <p className="text-slate-400 text-xs mt-2 mb-4 leading-tight italic">
                  {item.descripcion || "Relleno artesanal cocinado a la leña."}
                </p>

                <p className="text-3xl font-black text-slate-900 mb-6">
                  ${item.precio}
                </p>

                {/* Selector de Cantidad */}
                <div className="flex items-center gap-6 bg-orange-50 px-4 py-2 rounded-2xl border border-orange-100 mb-6">
                  <button
                    onClick={() => modificarCantidadLocal(item._id, "menos")}
                    className="text-2xl font-bold text-orange-500 hover:text-orange-700 w-8"
                  >
                    {" "}
                    –{" "}
                  </button>
                  <span className="text-xl font-black text-slate-800 w-4">
                    {cantidades[item._id] || 1}
                  </span>
                  <button
                    onClick={() => modificarCantidadLocal(item._id, "mas")}
                    className="text-2xl font-bold text-orange-500 hover:text-orange-700 w-8"
                  >
                    {" "}
                    +{" "}
                  </button>
                </div>

                <button
                  onClick={() => agregarAlCarrito(item)}
                  className="w-full bg-orange-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-900 transition-colors shadow-lg shadow-orange-100"
                >
                  AGREGAR 🔥
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20">
            <p className="text-slate-400 font-bold uppercase italic">
              Cargando el menú de Doña María...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
