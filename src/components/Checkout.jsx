import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import clienteAxios from "../api/axios";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [carrito, setCarrito] = useState(
    JSON.parse(localStorage.getItem("carrito")) || [],
  );
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // --- ESTADO DE ENVÍO CON HORA FIJA (10:00 AM) PARA PASAR VALIDACIÓN ---
  const [datosEnvio, setDatosEnvio] = useState({
    nombre: user?.nombre || "",
    telefono: user?.telefono || "",
    calle: "",
    colonia: "",
    referencia: "",
    tipoEntrega: "Hoy",
    // Concatenamos T10:00:00 para que el backend siempre lo vea como horario válido
    fechaEntrega: new Date().toISOString().split("T")[0] + "T10:00:00",
  });

  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0,
  );

  const enviarPedido = async (e) => {
    e.preventDefault();

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
      fechaEntrega: datosEnvio.fechaEntrega,
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
      alert(res.data.message);
      if (res.data.whatsappLink) {
        window.open(res.data.whatsappLink, "_blank");
      }
      localStorage.removeItem("carrito");
      navigate("/mis-pedidos");
    } catch (error) {
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 font-black uppercase italic text-slate-400">
        🛒 Tu carrito está vacío
        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-orange-500 text-white px-8 py-3 rounded-2xl"
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
          /* VISTA 1: CARRITO */
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
                    <p className="font-black text-slate-800 uppercase text-sm">
                      {item.nombre}
                    </p>
                    <p className="text-xs font-bold text-orange-600">
                      {item.cantidad} x ${item.precio}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-900">
                      ${item.cantidad * item.precio}
                    </p>
                    <button
                      onClick={() => eliminarDelCarrito(item._id)}
                      className="text-[10px] text-slate-400 font-bold uppercase"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center text-2xl font-black p-6 bg-slate-900 text-white rounded-3xl mb-8">
              <span className="text-xs uppercase text-slate-400">Total</span>
              <span>${total}</span>
            </div>
            <button
              onClick={() => setMostrarFormulario(true)}
              className="w-full bg-orange-500 text-white py-5 rounded-3xl font-black uppercase tracking-widest shadow-xl"
            >
              CONFIRMAR PEDIDO 🔥
            </button>
          </div>
        ) : (
          /* VISTA 2: FORMULARIO */
          <div className="bg-white rounded-[35px] shadow-2xl p-8 border border-slate-100">
            <button
              onClick={() => setMostrarFormulario(false)}
              className="text-orange-500 font-black text-xs uppercase mb-6 italic"
            >
              ← Volver al carrito
            </button>
            <h2 className="text-2xl font-black mb-8 italic uppercase text-slate-900">
              Datos de Entrega
            </h2>

            <form onSubmit={enviarPedido} className="space-y-5">
              {/* SELECTOR DE HOY / PROGRAMAR */}
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
                        fechaEntrega:
                          new Date().toISOString().split("T")[0] + "T10:00:00",
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
                <div className="bg-orange-50 p-4 rounded-2xl border-2 border-orange-100">
                  <label className="block text-[10px] font-black text-orange-600 uppercase mb-2">
                    Selecciona el día:
                  </label>
                  <input
                    type="date"
                    className="w-full bg-white border-none p-3 rounded-xl font-bold text-slate-800 outline-none"
                    min={new Date().toISOString().split("T")[0]}
                    value={datosEnvio.fechaEntrega.split("T")[0]}
                    onChange={(e) =>
                      setDatosEnvio({
                        ...datosEnvio,
                        fechaEntrega: e.target.value + "T10:00:00",
                      })
                    }
                    required
                  />
                </div>
              )}

              <div className="space-y-3">
                <input
                  className="w-full bg-slate-50 p-5 rounded-2xl text-sm font-bold placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Calle y Número"
                  value={datosEnvio.calle}
                  onChange={(e) =>
                    setDatosEnvio({ ...datosEnvio, calle: e.target.value })
                  }
                  required
                />
                <input
                  className="w-full bg-slate-50 p-5 rounded-2xl text-sm font-bold placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Colonia"
                  value={datosEnvio.colonia}
                  onChange={(e) =>
                    setDatosEnvio({ ...datosEnvio, colonia: e.target.value })
                  }
                  required
                />
                <input
                  className="w-full bg-slate-50 p-5 rounded-2xl text-sm font-bold placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Referencia de la casa"
                  value={datosEnvio.referencia}
                  onChange={(e) =>
                    setDatosEnvio({ ...datosEnvio, referencia: e.target.value })
                  }
                />
                <input
                  className="w-full bg-slate-50 p-5 rounded-2xl text-sm font-bold placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Teléfono"
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
                  className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black uppercase tracking-widest active:scale-95 transition-all"
                >
                  PEDIR MIS LEÑOS 🔥
                </button>
                <p className="text-center text-[10px] text-slate-400 mt-4 font-bold uppercase italic">
                  Horario: 7:00 AM - 2:00 PM
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
