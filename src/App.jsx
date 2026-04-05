import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import AuthProvider from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import Landing from "./pages/Landing";
// Importamos los nuevos componentes
import Menu from "./components/Menu";
import MisPedidos from "./components/MisPedidos";
import Checkout from "./components/Checkout";
import AdminDashboard from "./pages/AdminDashboard";
import RepartidorDashboard from "./pages/RepartidorDashboard";

// --- COMPONENTE PARA EL MENÚ INFERIOR ---
const BarraNavegacionInferior = () => {
  const { user } = useContext(AuthContext);

  // Solo se muestra si el usuario está logueado y es un CLIENTE
  if (!user || user.rol === "admin" || user.rol === "repartidor") return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#FDF6E3] border-t-2 border-[#E8D5B7] flex justify-around p-3 shadow-[0_-5px_15px_rgba(0,0,0,0.1)] z-50">
      <Link
        to="/menu"
        className="flex flex-col items-center text-[#8B4513] hover:text-[#5D3A1A] transition-colors"
      >
        <span className="text-2xl">🪵</span>
        <span className="text-[10px] font-black uppercase">Menú</span>
      </Link>

      <Link
        to="/checkout"
        className="flex flex-col items-center text-[#8B4513] hover:text-[#5D3A1A] transition-colors"
      >
        <span className="text-2xl">🛒</span>
        <span className="text-[10px] font-black uppercase">Carrito</span>
      </Link>

      <Link
        to="/mis-pedidos"
        className="flex flex-col items-center text-[#8B4513] hover:text-[#5D3A1A] transition-colors"
      >
        <span className="text-2xl">📋</span>
        <span className="text-[10px] font-black uppercase">Pedidos</span>
      </Link>
    </nav>
  );
};

// --- PROTECCIÓN DE RUTAS ---
const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading)
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">
        Cargando...
      </div>
    );
  if (!user || user.rol !== "admin") return <Navigate to="/" />;
  return children;
};

const ClienteRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading)
    return (
      <div className="min-h-screen bg-[#FDF6E3] flex items-center justify-center text-[#5D3A1A]">
        Cargando...
      </div>
    );
  if (!user) return <Navigate to="/" />; // Si no hay usuario, al landing
  if (user.rol === "admin") return <Navigate to="/admin" />;
  if (user.rol === "repartidor") return <Navigate to="/repartidor" />;
  return children;
};

const RepartidorRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading)
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">
        Cargando...
      </div>
    );
  if (!user || user.rol !== "repartidor") return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />

        <div className="pb-20">
          <Routes>
            {/* 🏠 LANDING PAGE (Bienvenida) */}
            <Route path="/" element={<Landing />} />

            {/* 🍽️ MENÚ DE PRODUCTOS (Solo clientes logueados) */}
            <Route
              path="/menu"
              element={
                <ClienteRoute>
                  <Menu />
                </ClienteRoute>
              }
            />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* 🛒 RUTA DEL CARRITO */}
            <Route
              path="/checkout"
              element={
                <ClienteRoute>
                  <Checkout />
                </ClienteRoute>
              }
            />

            {/* 📋 RUTA DE MIS PEDIDOS */}
            <Route
              path="/mis-pedidos"
              element={
                <ClienteRoute>
                  <MisPedidos />
                </ClienteRoute>
              }
            />

            {/* 👤 PERFIL (Solo clientes) */}
            <Route
              path="/perfil"
              element={
                <ClienteRoute>
                  <Profile />
                </ClienteRoute>
              }
            />

            {/* ⚙️ PANEL DE ADMINISTRADOR */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

            {/* 🚚 PANEL DE REPARTIDOR */}
            <Route
              path="/repartidor"
              element={
                <RepartidorRoute>
                  <RepartidorDashboard />
                </RepartidorRoute>
              }
            />
          </Routes>
        </div>

        <BarraNavegacionInferior />
      </Router>
    </AuthProvider>
  );
}

export default App;
