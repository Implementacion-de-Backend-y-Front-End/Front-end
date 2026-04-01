import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import clienteAxios from "../api/axios";

const Checkout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // --- ESTADO DEL CARRITO (Cargado de LocalStorage) ---
  const [carrito, setCarrito] = useState([]);
  const [paso, setPaso] = useState(1);
  const [loading, setLoading] = useState(false);

  // Datos del formulario
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [direccion, setDireccion] = useState({
    calle: "",
    colonia: "",
    referencia: "",
  });
  const [pedidoFinalizado, setPedidoFinalizado] = useState(null);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("carrito")) || [];
    setCarrito(items);
  }, []);

  const totalProductos = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const totalDinero = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0,
  );

  // --- FUNCIONES DE NAVEGACIÓN ---
  const irAlPaso2 = () => {
    if (totalProductos < 3) return alert("Mínimo 3 leños para entrega.");
    setPaso(2);
  };

  const irAlPaso3 = () => {
    if (!fechaEntrega) return alert("Selecciona una hora.");

    // Validación 7am - 2pm (Frontend)
    const hora = parseInt(fechaEntrega.split(":")[0]);
    if (hora < 7 || hora >= 14) {
      return alert("Horario de servicio: 7:00 AM a 2:00 PM");
    }
    setPaso(3);
  };

  // --- ENVIAR PEDIDO AL BACKEND ---
  const confirmarPedido = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Adaptamos el carrito al formato que pide tu orderSchema
      const productosFormateados = carrito.map((item) => ({
        productoId: item._id,
        nombre: item.nombre,
        cantidad: item.cantidad,
        precioUnitario: item.precio,
        subtotal: item.precio * item.cantidad,
      }));

      const datosPedido = {
        productos: productosFormateados,
        total: totalDinero,
        fechaEntrega: new Date().setHours(
          fechaEntrega.split(":")[0],
          fechaEntrega.split(":")[1],
        ),
        direccion: direccion,
        telefono: user.telefono, // Lo toma del login
        nombre: user.nombre,
      };

      const res = await clienteAxios.post("/api/orders", datosPedido, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPedidoFinalizado(res.data.pedido);
      localStorage.removeItem("carrito"); // Limpiamos
      setPaso(4);
    } catch (error) {
      alert(error.response?.data?.message || "Error al crear pedido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 p-4 pb-20 font-sans">
      {/* PASO 1: RESUMEN Y MÍNIMO */}
      {paso === 1 && (
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl p-6 border-t-8 border-orange-500">
          <h2 className="text-2xl font-black mb-4 italic">TU PEDIDO</h2>
          <div className="space-y-3 mb-6">
            {carrito.map((item) => (
              <div
                key={item._id}
                className="flex justify-between border-b pb-2"
              >
                <span>
                  {item.nombre} x{item.cantidad}
                </span>
                <span className="font-bold">
                  ${item.precio * item.cantidad}
                </span>
              </div>
            ))}
          </div>
          <div
            className={`p-4 rounded-xl mb-6 font-bold text-center ${totalProductos < 3 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}
          >
            {totalProductos < 3
              ? `¡FALTA ${3 - totalProductos} LEÑO(S)!`
              : "¡MÍNIMO ALCANZADO! ✅"}
          </div>
          <button
            onClick={irAlPaso2}
            disabled={totalProductos < 3}
            className={`w-full py-4 rounded-2xl font-black ${totalProductos < 3 ? "bg-gray-300" : "bg-orange-500 text-white shadow-lg active:scale-95"}`}
          >
            CONTINUAR CON EL PEDIDO
          </button>
        </div>
      )}

      {/* PASO 2: HORARIO */}
      {paso === 2 && (
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl p-6">
          <h2 className="text-2xl font-black mb-2 italic text-orange-600 text-center uppercase">
            Horario
          </h2>
          <p className="text-center text-sm text-gray-500 mb-6">
            Servicio: 7:00 AM - 2:00 PM
          </p>
          <input
            type="time"
            className="w-full p-4 border-2 rounded-2xl mb-6 text-center text-2xl font-bold border-orange-200 focus:border-orange-500 outline-none"
            onChange={(e) => setFechaEntrega(e.target.value)}
          />
          <button
            onClick={irAlPaso3}
            className="w-full bg-orange-500 text-white py-4 rounded-2xl font-black shadow-lg"
          >
            SIGUIENTE
          </button>
        </div>
      )}

      {/* PASO 3: ENCUESTA DIRECCIÓN */}
      {paso === 3 && (
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl p-6">
          <h2 className="text-xl font-black mb-4 uppercase">Datos de Envío</h2>
          <div className="space-y-4">
            <input
              placeholder="Calle y Número"
              className="w-full p-3 border-2 rounded-xl"
              onChange={(e) =>
                setDireccion({ ...direccion, calle: e.target.value })
              }
            />
            <input
              placeholder="Colonia"
              className="w-full p-3 border-2 rounded-xl"
              onChange={(e) =>
                setDireccion({ ...direccion, colonia: e.target.value })
              }
            />
            <textarea
              placeholder="Referencias de tu casa..."
              className="w-full p-3 border-2 rounded-xl h-24"
              onChange={(e) =>
                setDireccion({ ...direccion, referencia: e.target.value })
              }
            />
          </div>
          <button
            onClick={confirmarPedido}
            disabled={loading}
            className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black mt-6 shadow-xl"
          >
            {loading ? "PROCESANDO..." : "PEDIR MIS LEÑOS 🔥"}
          </button>
        </div>
      )}

      {/* PASO 4: TICKET */}
      {paso === 4 && (
        <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl p-8 text-center border-dashed border-4 border-gray-100">
          <h2 className="text-orange-600 font-black text-3xl mb-2 italic">
            ¡RECIBIDO!
          </h2>
          <div className="bg-gray-50 py-6 my-6 rounded-2xl border-2 border-dashed border-gray-300 font-mono">
            <p className="text-gray-500 text-xs uppercase tracking-widest">
              Folio de seguimiento
            </p>
            <p className="text-4xl font-black">{pedidoFinalizado?.folio}</p>
          </div>
          <p className="text-gray-600 text-sm mb-8 italic">
            "Pronto te confirmaremos por teléfono. ¡Gracias!"
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-orange-500 text-white py-4 rounded-2xl font-black mb-3"
          >
            HACER OTRO PEDIDO
          </button>
          <button
            onClick={() => navigate("/mis-pedidos")}
            className="w-full border-2 border-black py-4 rounded-2xl font-black"
          >
            IR A MIS PEDIDOS
          </button>
        </div>
      )}
    </div>
  );
};

export default Checkout;
