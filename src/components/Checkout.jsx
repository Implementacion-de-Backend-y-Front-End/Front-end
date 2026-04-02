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

  // --- ESTADO CORREGIDO PARA TU BACKEND ---
  const [datosEnvio, setDatosEnvio] = useState({
    nombre: user?.nombre || "",
    telefono: user?.telefono || "",
    calle: "",
    colonia: "",
    referencia: "",
    tipoEntrega: "Hoy",
    fechaEntrega: new Date().toISOString(), // Formato ISO para el validador de horario
  });

  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0,
  );

  const enviarPedido = async (e) => {
    e.preventDefault();

    // Armamos el objeto exactamente como lo espera tu createOrder
    const pedido = {
      nombre: datosEnvio.nombre,
      telefono: datosEnvio.telefono,
      // Mapeamos a productoId, precioUnitario y subtotal como dice tu Schema
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
      // Objeto direccion anidado {calle, colonia, referencia}
      direccion: {
        calle: datosEnvio.calle,
        colonia: datosEnvio.colonia,
        referencia: datosEnvio.referencia,
      },
      nota: `Pedido realizado por app - Entrega: ${datosEnvio.tipoEntrega}`,
    };

    try {
      const res = await clienteAxios.post("/api/orders", pedido);

      alert(res.data.message); // Muestra el folio generado (#1234)

      // Si el backend generó link de WhatsApp, lo abrimos opcionalmente
      if (res.data.whatsappLink) {
        window.open(res.data.whatsappLink, "_blank");
      }

      localStorage.removeItem("carrito");
      navigate("/mis-pedidos");
    } catch (error) {
      console.error(error);
      // Mostramos el error específico del backend (ej. Horario no disponible o Stock)
      alert(error.response?.data?.message || "Error al procesar el pedido");
    }
  };

  if (carrito.length === 0)
    return (
      <div className="p-10 text-center font-black italic">
        EL CARRITO ESTÁ VACÍO 🛒
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 pb-24 p-4">
      {!mostrarFormulario ? (
        /* VISTA 1: RESUMEN */
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl p-6 border border-slate-100">
          <h2 className="text-2xl font-black uppercase italic mb-6 border-b-4 border-orange-500 inline-block">
            Tu Carrito
          </h2>
          <div className="space-y-4 mb-8">
            {carrito.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl"
              >
                <div>
                  <p className="font-black text-slate-800 uppercase text-sm">
                    {item.nombre}
                  </p>
                  <p className="text-xs font-bold text-orange-600">
                    {item.cantidad} x ${item.precio}
                  </p>
                </div>
                <p className="font-black">${item.cantidad * item.precio}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center text-xl font-black p-4 bg-slate-900 text-white rounded-2xl mb-6">
            <span>TOTAL:</span>
            <span>${total}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate("/")}
              className="bg-slate-200 py-4 rounded-2xl font-black uppercase text-xs"
            >
              Añadir más
            </button>
            <button
              onClick={() => setMostrarFormulario(true)}
              className="bg-orange-500 text-white py-4 rounded-2xl font-black uppercase text-xs shadow-lg shadow-orange-200"
            >
              Confirmar
            </button>
          </div>
        </div>
      ) : (
        /* VISTA 2: FORMULARIO (Datos de Entrega) */
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl p-6">
          <h2 className="text-xl font-black mb-6 italic uppercase text-orange-600">
            Datos de Entrega
          </h2>
          <form onSubmit={enviarPedido} className="space-y-4">
            <div className="bg-slate-100 p-1 rounded-2xl flex">
              <button
                type="button"
                onClick={() =>
                  setDatosEnvio({ ...datosEnvio, tipoEntrega: "Hoy" })
                }
                className={`flex-1 py-3 rounded-xl font-black text-xs uppercase ${datosEnvio.tipoEntrega === "Hoy" ? "bg-orange-500 text-white shadow-md" : "text-slate-400"}`}
              >
                🕒 Hoy
              </button>
              <button
                type="button"
                onClick={() =>
                  setDatosEnvio({ ...datosEnvio, tipoEntrega: "Programar" })
                }
                className={`flex-1 py-3 rounded-xl font-black text-xs uppercase ${datosEnvio.tipoEntrega === "Programar" ? "bg-orange-500 text-white shadow-md" : "text-slate-400"}`}
              >
                📅 Programar
              </button>
            </div>

            <input
              className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm font-bold"
              placeholder="Calle y Número"
              value={datosEnvio.calle}
              onChange={(e) =>
                setDatosEnvio({ ...datosEnvio, calle: e.target.value })
              }
              required
            />
            <input
              className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm font-bold"
              placeholder="Colonia"
              value={datosEnvio.colonia}
              onChange={(e) =>
                setDatosEnvio({ ...datosEnvio, colonia: e.target.value })
              }
              required
            />
            <input
              className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm font-bold"
              placeholder="Referencia (casa azul, frente a...)"
              value={datosEnvio.referencia}
              onChange={(e) =>
                setDatosEnvio({ ...datosEnvio, referencia: e.target.value })
              }
            />
            <input
              className="w-full bg-slate-50 border-none p-4 rounded-2xl text-sm font-bold"
              placeholder="Teléfono"
              value={datosEnvio.telefono}
              onChange={(e) =>
                setDatosEnvio({ ...datosEnvio, telefono: e.target.value })
              }
              required
            />

            <button
              type="submit"
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
            >
              PEDIR MIS LEÑOS 🔥
            </button>
            <button
              type="button"
              onClick={() => setMostrarFormulario(false)}
              className="w-full text-slate-400 font-bold text-xs uppercase"
            >
              Cancelar
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Checkout;
