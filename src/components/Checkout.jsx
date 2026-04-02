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

  // --- ESTADO PARA FECHA Y HORA ---
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]); // Hoy por defecto
  const [hora, setHora] = useState("09:00"); // Hora sugerida

  const [datosEnvio, setDatosEnvio] = useState({
    nombre: user?.nombre || "",
    telefono: user?.telefono || "",
    calle: "",
    colonia: "",
    referencia: "",
    tipoEntrega: "Hoy",
  });

  const actualizarCantidad = (id, accion) => {
    const nuevoCarrito = carrito.map((item) => {
      if (item._id === id) {
        const nuevaCantidad =
          accion === "sumar" ? item.cantidad + 1 : item.cantidad - 1;
        return { ...item, cantidad: nuevaCantidad > 0 ? nuevaCantidad : 1 };
      }
      return item;
    });
    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
  };

  const totalUnidades = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const faltanLeños = totalUnidades < 3;
  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0,
  );

  const enviarPedido = async (e) => {
    e.preventDefault();

    // Validar Horario de Doña María (7 AM a 2 PM)
    const horaNum = parseInt(hora.split(":")[0]);
    if (horaNum < 7 || horaNum >= 14) {
      alert(
        "🕒 El horario de entrega es de 7:00 AM a 2:00 PM. Por favor ajusta la hora.",
      );
      return;
    }

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
      // Unimos fecha y hora para el backend
      fechaEntrega: `${fecha}T${hora}:00`,
      tipoEntrega: datosEnvio.tipoEntrega,
      direccion: {
        calle: datosEnvio.calle,
        colonia: datosEnvio.colonia,
        referencia: datosEnvio.referencia,
      },
      nota: `Pedido para el ${fecha} a las ${hora}`,
    };

    try {
      const res = await clienteAxios.post("/api/orders", pedido);
      alert(res.data.message);
      if (res.data.whatsappLink) window.open(res.data.whatsappLink, "_blank");
      localStorage.removeItem("carrito");
      navigate("/mis-pedidos");
    } catch (error) {
      alert(error.response?.data?.message || "Error al procesar pedido");
    }
  };

  if (carrito.length === 0)
    return (
      <div className="p-10 text-center font-black italic">
        EL CARRITO ESTÁ VACÍO 🛒
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 pb-24 p-4 font-sans">
      {!mostrarFormulario ? (
        /* VISTA 1: CARRITO (Ya la tienes bien) */
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl p-6 border border-slate-100">
          <h2 className="text-2xl font-black uppercase italic mb-6 border-b-4 border-orange-500 inline-block">
            Tu Carrito
          </h2>
          <div className="space-y-4 mb-8">
            {carrito.map((item) => (
              <div
                key={item._id}
                className="bg-slate-50 p-4 rounded-3xl flex flex-col gap-2"
              >
                <div className="flex justify-between font-black text-sm uppercase">
                  <span>{item.nombre}</span>
                  <button
                    onClick={() =>
                      setCarrito(carrito.filter((i) => i._id !== item._id))
                    }
                    className="text-red-400 text-xs"
                  >
                    Quitar
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center bg-orange-100 rounded-xl px-3 py-1 gap-4">
                    <button
                      onClick={() => actualizarCantidad(item._id, "restar")}
                      className="font-black text-orange-600"
                    >
                      −
                    </button>
                    <span className="font-black text-sm">{item.cantidad}</span>
                    <button
                      onClick={() => actualizarCantidad(item._id, "sumar")}
                      className="font-black text-orange-600"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-black text-slate-700">
                    ${item.cantidad * item.precio}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-slate-900 text-white p-4 rounded-2xl flex justify-between font-black mb-6">
            <span>TOTAL:</span>
            <span>${total}</span>
          </div>
          <button
            disabled={faltanLeños}
            onClick={() => setMostrarFormulario(true)}
            className={`w-full py-4 rounded-2xl font-black uppercase text-xs ${faltanLeños ? "bg-slate-200 text-slate-400" : "bg-orange-500 text-white shadow-lg shadow-orange-200"}`}
          >
            {faltanLeños
              ? `Faltan ${3 - totalUnidades} leños`
              : "Continuar a Entrega"}
          </button>
        </div>
      ) : (
        /* VISTA 2: FORMULARIO CON FECHA Y HORA */
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl p-6 border border-slate-100">
          <h2 className="text-xl font-black mb-6 italic uppercase text-orange-600 text-center">
            Agenda tu Entrega
          </h2>

          <form onSubmit={enviarPedido} className="space-y-4">
            {/* SELECTOR DE FECHA */}
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                ¿Qué día quieres tus leños?
              </label>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                className="w-full bg-slate-50 p-4 rounded-2xl text-sm font-bold border-none"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
              />
            </div>

            {/* SELECTOR DE HORA (Limitado por lógica en enviarPedido) */}
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                ¿A qué hora? (7 AM - 2 PM)
              </label>
              <input
                type="time"
                className="w-full bg-slate-50 p-4 rounded-2xl text-sm font-bold border-none"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                required
              />
            </div>

            <hr className="border-slate-100 my-2" />

            <input
              className="w-full bg-slate-50 p-4 rounded-2xl text-sm font-bold border-none"
              placeholder="Calle y Número"
              value={datosEnvio.calle}
              onChange={(e) =>
                setDatosEnvio({ ...datosEnvio, calle: e.target.value })
              }
              required
            />
            <input
              className="w-full bg-slate-50 p-4 rounded-2xl text-sm font-bold border-none"
              placeholder="Colonia"
              value={datosEnvio.colonia}
              onChange={(e) =>
                setDatosEnvio({ ...datosEnvio, colonia: e.target.value })
              }
              required
            />
            <input
              className="w-full bg-slate-50 p-4 rounded-2xl text-sm font-bold border-none"
              placeholder="Referencia"
              value={datosEnvio.referencia}
              onChange={(e) =>
                setDatosEnvio({ ...datosEnvio, referencia: e.target.value })
              }
            />
            <input
              className="w-full bg-slate-50 p-4 rounded-2xl text-sm font-bold border-none"
              placeholder="Teléfono"
              value={datosEnvio.telefono}
              onChange={(e) =>
                setDatosEnvio({ ...datosEnvio, telefono: e.target.value })
              }
              required
            />

            <button
              type="submit"
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all mt-4"
            >
              FINALIZAR PEDIDO 🔥
            </button>
            <button
              type="button"
              onClick={() => setMostrarFormulario(false)}
              className="w-full text-slate-400 font-bold text-[10px] uppercase pt-2"
            >
              Volver al carrito
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Checkout;
