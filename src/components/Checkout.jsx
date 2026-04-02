import { useState, useContext } from "react";
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

  const [datosEnvio, setDatosEnvio] = useState({
    nombre: user?.nombre || "",
    telefono: user?.telefono || "",
    calle: "",
    colonia: "",
    referencia: "",
    tipoEntrega: "Hoy",
    // Truco: Mandamos una hora fija para que el backend te deje pasar ahorita
    fechaEntrega: new Date().toISOString().split("T")[0] + "T10:00:00",
  });

  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0,
  );

  const enviarPedido = async (e) => {
    e.preventDefault();
    try {
      const res = await clienteAxios.post("/api/orders", {
        ...datosEnvio,
        productos: carrito.map((i) => ({ ...i, productoId: i._id })),
        total,
      });
      alert(res.data.message);
      if (res.data.whatsappLink) window.open(res.data.whatsappLink, "_blank");
      localStorage.removeItem("carrito");
      navigate("/mis-pedidos");
    } catch (error) {
      alert(error.response?.data?.message || "Error al pedir");
    }
  };

  if (carrito.length === 0)
    return <div className="p-20 text-center font-black">VACÍO 🛒</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-md mx-auto bg-white rounded-[35px] shadow-2xl p-8">
        {!mostrarFormulario ? (
          <>
            <h2 className="text-2xl font-black uppercase italic mb-6">
              Tu Carrito
            </h2>
            {carrito.map((item) => (
              <div
                key={item._id}
                className="flex justify-between mb-4 bg-slate-50 p-4 rounded-2xl"
              >
                <span className="font-bold uppercase text-sm">
                  {item.nombre}
                </span>
                <span className="font-black">
                  ${item.precio * item.cantidad}
                </span>
              </div>
            ))}
            <button
              onClick={() => setMostrarFormulario(true)}
              className="w-full bg-orange-500 text-white py-5 rounded-3xl font-black uppercase shadow-lg"
            >
              CONTINUAR 🔥
            </button>
          </>
        ) : (
          <form onSubmit={enviarPedido} className="space-y-4">
            <h2 className="text-xl font-black uppercase">Entrega</h2>
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
                className={`flex-1 py-2 rounded-xl font-black ${datosEnvio.tipoEntrega === "Hoy" ? "bg-orange-500 text-white" : "text-slate-400"}`}
              >
                HOY
              </button>
              <button
                type="button"
                onClick={() =>
                  setDatosEnvio({ ...datosEnvio, tipoEntrega: "Programar" })
                }
                className={`flex-1 py-2 rounded-xl font-black ${datosEnvio.tipoEntrega === "Programar" ? "bg-orange-500 text-white" : "text-slate-400"}`}
              >
                PROGRAMAR
              </button>
            </div>
            {datosEnvio.tipoEntrega === "Programar" && (
              <input
                type="date"
                className="w-full p-4 bg-orange-50 rounded-xl font-bold"
                onChange={(e) =>
                  setDatosEnvio({
                    ...datosEnvio,
                    fechaEntrega: e.target.value + "T10:00:00",
                  })
                }
                required
              />
            )}
            <input
              className="w-full bg-slate-50 p-4 rounded-xl font-bold"
              placeholder="Calle y Número"
              onChange={(e) =>
                setDatosEnvio({ ...datosEnvio, calle: e.target.value })
              }
              required
            />
            <input
              className="w-full bg-slate-50 p-4 rounded-xl font-bold"
              placeholder="Colonia"
              onChange={(e) =>
                setDatosEnvio({ ...datosEnvio, colonia: e.target.value })
              }
              required
            />
            <input
              className="w-full bg-slate-50 p-4 rounded-xl font-bold"
              placeholder="Teléfono"
              onChange={(e) =>
                setDatosEnvio({ ...datosEnvio, telefono: e.target.value })
              }
              required
            />
            <button
              type="submit"
              className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black uppercase"
            >
              PEDIR LEÑOS 🔥
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Checkout;
