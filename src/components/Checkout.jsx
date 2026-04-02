import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import clienteAxios from "../api/axios";

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [carrito, setCarrito] = useState([]);
  const [paso, setPaso] = useState(1);
  const [hora, setHora] = useState("");
  const [direccion, setDireccion] = useState({
    calle: "",
    colonia: "",
    referencia: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCarrito(JSON.parse(localStorage.getItem("carrito")) || []);
  }, []);

  const total = carrito.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
  const cantTotal = carrito.reduce((acc, i) => acc + i.cantidad, 0);

  const enviarPedido = async () => {
    if (!hora || !direccion.calle) return alert("Completa todos los datos");
    setLoading(true);
    try {
      const datos = {
        productos: carrito.map((i) => ({
          productoId: i._id,
          nombre: i.nombre,
          cantidad: i.cantidad,
          precioUnitario: i.precio,
        })),
        total,
        fechaEntrega: hora,
        direccion,
        telefono: user.telefono,
        nombre: user.nombre,
        status: "pendiente", // 🔥 RECUERDA: Entra como pendiente
      };
      await clienteAxios.post("/api/orders", datos);
      localStorage.removeItem("carrito");
      alert("¡Pedido enviado! Espera la confirmación del Admin.");
      navigate("/mis-pedidos");
    } catch (e) {
      alert("Error al pedir");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 min-h-screen">
      {paso === 1 && (
        <div className="bg-white p-8 rounded-3xl shadow-xl border-t-8 border-orange-500">
          <h2 className="text-2xl font-black italic mb-4">REVISIÓN</h2>
          {carrito.map((i) => (
            <div
              key={i._id}
              className="flex justify-between border-b py-2 italic font-medium"
            >
              <span>
                {i.nombre} x{i.cantidad}
              </span>
              <span>${i.precio * i.cantidad}</span>
            </div>
          ))}
          <div
            className={`mt-6 p-4 rounded-2xl text-center font-black ${cantTotal < 3 ? "bg-red-50 text-red-500" : "bg-green-50 text-green-500"}`}
          >
            {cantTotal < 3
              ? `Faltan ${3 - cantTotal} leños para el mínimo`
              : "Mínimo alcanzado ✅"}
          </div>
          <button
            disabled={cantTotal < 3}
            onClick={() => setPaso(2)}
            className="w-full bg-orange-500 text-white py-4 rounded-2xl mt-4 font-black disabled:bg-slate-200"
          >
            CONTINUAR
          </button>
        </div>
      )}

      {paso === 2 && (
        <div className="bg-white p-8 rounded-3xl shadow-xl">
          <h2 className="font-black text-xl mb-4 uppercase">Datos de Envío</h2>
          <input
            type="time"
            className="w-full p-4 border-2 rounded-2xl mb-4 font-bold"
            onChange={(e) => setHora(e.target.value)}
          />
          <input
            placeholder="Calle y Número"
            className="w-full p-4 border-2 rounded-2xl mb-2"
            onChange={(e) =>
              setDireccion({ ...direccion, calle: e.target.value })
            }
          />
          <input
            placeholder="Colonia"
            className="w-full p-4 border-2 rounded-2xl mb-2"
            onChange={(e) =>
              setDireccion({ ...direccion, colonia: e.target.value })
            }
          />
          <textarea
            placeholder="Referencia (Ej. Portón azul)"
            className="w-full p-4 border-2 rounded-2xl"
            onChange={(e) =>
              setDireccion({ ...direccion, referencia: e.target.value })
            }
          />
          <button
            onClick={enviarPedido}
            className="w-full bg-orange-600 text-white py-4 rounded-2xl mt-6 font-black uppercase"
          >
            {loading ? "PROCESANDO..." : "PEDIR MIS LEÑOS 🔥"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Checkout;
