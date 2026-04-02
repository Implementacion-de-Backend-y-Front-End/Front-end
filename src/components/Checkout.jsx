import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import clienteAxios from "../api/axios";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Estado para el carrito y control de vista
  const [carrito, setCarrito] = useState(
    JSON.parse(localStorage.getItem("carrito")) || [],
  );
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // --- ESTADOS PARA EL ENVÍO ---
  const [datosEnvio, setDatosEnvio] = useState({
    nombre: user?.nombre || "",
    telefono: user?.telefono || "",
    calle: "",
    colonia: "",
    referencia: "",
    tipoEntrega: "Hoy",
    fechaEntrega: new Date().toISOString().split("T")[0], // Formato YYYY-MM-DD
  });

  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0,
  );

  // Función para enviar el pedido al Backend
  const enviarPedido = async (e) => {
    e.preventDefault();

    // Construimos el objeto para el controlador 'createOrder'
    const pedido = {
      nombre: datosEnvio.nombre,
      telefono: datosEnvio.telefono,
      productos: carrito.map((item) => ({
        productoId: item._id,
        nombre: item.nombre,
        cantidad: item.cantidad,
        precioUnitario: item.precio,
        subtotal: item.precio * item.cantidad,
      })),
      total: total,
      fechaEntrega: datosEnvio.fechaEntrega, // El Backend validará que sea entre 7am y 2pm
      tipoEntrega: datosEnvio.tipoEntrega,
      direccion: {
        calle: datosEnvio.calle,
        colonia: datosEnvio.colonia,
        referencia: datosEnvio.referencia,
      },
      nota: `Pedido vía Web - Entrega ${datosEnvio.tipoEntrega}`,
    };

    try {
      const res = await clienteAxios.post("/api/orders", pedido);

      alert(res.data.message); // Muestra el folio generado #XXXX

      // Si el helper de WhatsApp generó un link, lo abrimos
      if (res.data.whatsappLink) {
        window.open(res.data.whatsappLink, "_blank");
      }

      localStorage.removeItem("carrito");
      navigate("/mis-pedidos");
    } catch (error) {
      console.error(error);
      // Muestra errores de stock o de horario del backend
      alert(error.response?.data?.message || "Error al procesar el pedido");
    }
  };

  const eliminarDelCarrito = (id) => {
    const nuevo = carrito.filter((i) => i._id !== id);
    setCarrito(nuevo);
    localStorage.setItem("carrito", JSON.stringify(nuevo));
  };

  if (carrito.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <span className="text-6xl mb-4">🛒</span>
        <h2 className="text-xl font-black uppercase italic text-slate-400">
          Tu carrito está vacío
        </h2>
        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-orange-500 text-white px-8 py-3 rounded-2xl font-black uppercase"
        >
          Ir al Menú
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24 p-4 md:p-10">
      <div className="max-w-md mx-auto">
        {!mostrarFormulario ? (
          /* ==========================================
             VISTA 1: RESUMEN DE COMPRA
             ========================================== */
          <div className="bg-white rounded-[35px] shadow-2xl p-8 border border-slate-100">
            <h2 className="text-2xl font-black uppercase italic mb-8 border-b-4 border-orange-500 inline-block">
              Tu Carrito
            </h2>

            <div className="space-y-4 mb-10">
              {carrito.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center bg-slate-50 p-4 rounded-3xl border border-slate-100"
                >
                  <div className="flex-1">
                    <p className="font-black text-slate-800 uppercase text-sm leading-none mb-1">
                      {item.nombre}
                    </p>
                    <p className="text-xs font-bold text-orange-600">
                      {item.cantidad} x ${item.precio}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="font-black text-slate-900 mb-1">
                      ${item.cantidad * item.precio}
                    </p>
                    <button
                      onClick={() => eliminarDelCarrito(item._id)}
                      className="text-[10px] text-slate-400 font-bold uppercase hover:text-red-500 transition-colors"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-2xl font-black p-6 bg-slate-900 text-white rounded-3xl mb-8">
              <span className="text-xs uppercase text-slate-400 tracking-widest">
                Total
              </span>
              <span>${total}</span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => setMostrarFormulario(true)}
                className="w-full bg-orange-500 text-white py-5 rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-orange-200 active:scale-95 transition-all"
              >
                CONFIRMAR PEDIDO 🔥
              </button>
              <button
                onClick={() => navigate("/")}
                className="w-full py-4 text-slate-400 font-bold uppercase text-xs"
              >
                Añadir más cosas
              </button>
            </div>
          </div>
        ) : (
          /* ==========================================
             VISTA 2: DATOS DE ENVÍO
             ========================================== */
          <div className="bg-white rounded-[35px] shadow-2xl p-8 border border-slate-100 animate-in fade-in duration-500">
            <button
              onClick={() => setMostrarFormulario(false)}
              className="text-orange-500 font-black text-xs uppercase mb-6 flex items-center gap-2"
            >
              ← Volver al carrito
            </button>

            <h2 className="text-2xl font-black mb-8 italic uppercase text-slate-900">
              Datos de Entrega
            </h2>

            <form onSubmit={enviarPedido} className="space-y-5">
              {/* SELECTOR HOY / PROGRAMAR */}
              <div className="space-y-3">
                <p className="font-black italic text-slate-400 uppercase text-[10px] ml-2">
                  ¿Cuándo quieres tus leños?
                </p>
                <div className="flex bg-slate-100 p-1 rounded-2xl">
                  <button
                    type="button"
                    onClick={() =>
                      setDatosEnvio({
                        ...datosEnvio,
                        tipoEntrega: "Hoy",
                        fechaEntrega: new Date().toISOString().split("T")[0],
                      })
                    }
                    className={`flex-1 py-3 rounded-xl font-black text-xs uppercase transition-all ${datosEnvio.tipoEntrega === "Hoy" ? "bg-orange-500 text-white shadow-md" : "text-slate-400"}`}
                  >
                    🕒 Hoy
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setDatosEnvio({ ...datosEnvio, tipoEntrega: "Programar" })
                    }
                    className={`flex-1 py-3 rounded-xl font-black text-xs uppercase transition-all ${datosEnvio.tipoEntrega === "Programar" ? "bg-orange-500 text-white shadow-md" : "text-slate-400"}`}
                  >
                    📅 Programar
                  </button>
                </div>
              </div>

              {/* CALENDARIO CONDICIONAL */}
              {datosEnvio.tipoEntrega === "Programar" && (
                <div className="bg-orange-50 p-4 rounded-2xl border-2 border-orange-100 animate-in slide-in-from-top-2 duration-300">
                  <label className="block text-[10px] font-black text-orange-600 uppercase mb-2">
                    Selecciona el día:
                  </label>
                  <input
                    type="date"
                    className="w-full bg-white border-none p-3 rounded-xl font-bold text-slate-800 outline-none"
                    min={new Date().toISOString().split("T")[0]}
                    value={datosEnvio.fechaEntrega}
                    onChange={(e) =>
                      setDatosEnvio({
                        ...datosEnvio,
                        fechaEntrega: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              )}

              {/* CAMPOS DE TEXTO */}
              <div className="space-y-3">
                <input
                  className="w-full bg-slate-50 border-none p-5 rounded-2xl text-sm font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="Calle y Número"
                  value={datosEnvio.calle}
                  onChange={(e) =>
                    setDatosEnvio({ ...datosEnvio, calle: e.target.value })
                  }
                  required
                />
                <input
                  className="w-full bg-slate-50 border-none p-5 rounded-2xl text-sm font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="Colonia"
                  value={datosEnvio.colonia}
                  onChange={(e) =>
                    setDatosEnvio({ ...datosEnvio, colonia: e.target.value })
                  }
                  required
                />
                <input
                  className="w-full bg-slate-50 border-none p-5 rounded-2xl text-sm font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="Referencia de la casa"
                  value={datosEnvio.referencia}
                  onChange={(e) =>
                    setDatosEnvio({ ...datosEnvio, referencia: e.target.value })
                  }
                />
                <input
                  className="w-full bg-slate-50 border-none p-5 rounded-2xl text-sm font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="Tu Teléfono"
                  type="tel"
                  value={datosEnvio.telefono}
                  onChange={(e) =>
                    setDatosEnvio({ ...datosEnvio, telefono: e.target.value })
                  }
                  required
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all"
                >
                  PEDIR MIS LEÑOS 🔥
                </button>
                <p className="text-center text-[10px] text-slate-400 mt-4 font-bold uppercase tracking-tighter">
                  Horario de entrega: 7:00 AM - 2:00 PM
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
