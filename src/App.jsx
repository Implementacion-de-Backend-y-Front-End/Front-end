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
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import Checkout from "./components/Checkout";

// --- COMPONENTE PARA EL MENÚ INFERIOR ---
// Lo creamos aparte para que useContext funcione correctamente
const BarraNavegacionInferior = () => {
  const { user } = useContext(AuthContext);

  // Solo lo mostramos si hay usuario y NO es admin
  if (!user || user.rol === "admin") return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-3 shadow-[0_-5px_15px_rgba(0,0,0,0.1)] z-50">
      <Link
        to="/"
        className="flex flex-col items-center text-gray-500 hover:text-orange-600 transition-colors"
      >
        <span className="text-2xl">🏠</span>
        <span className="text-[10px] font-black uppercase italic">Menú</span>
      </Link>

      <Link
        to="/checkout"
        className="flex flex-col items-center text-orange-600"
      >
        <span className="text-2xl">🛒</span>
        <span className="text-[10px] font-black uppercase italic">Carrito</span>
      </Link>

      <Link
        to="/mis-pedidos"
        className="flex flex-col items-center text-gray-500 hover:text-orange-600 transition-colors"
      >
        <span className="text-2xl">📋</span>
        <span className="text-[10px] font-black uppercase italic">Pedidos</span>
      </Link>
    </nav>
  );
};

// --- COMPONENTE DE PROTECCIÓN ADMIN ---
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

// --- COMPONENTE DE PROTECCIÓN CLIENTE ---
const ClienteRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando...
      </div>
    );
  if (!user || user.rol === "admin") return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route
            path="/checkout"
            element={
              <ClienteRoute>
                <Checkout />
              </ClienteRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>

        {/* 🔥 Llamamos al componente del menú aquí abajo */}
        <BarraNavegacionInferior />
      </Router>
    </AuthProvider>
  );
}

export default App;
