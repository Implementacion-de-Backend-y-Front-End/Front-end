import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link, // 🔥 Agregado para el menú
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

// --- COMPONENTE DE PROTECCIÓN CLIENTE 🔥 ---
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
  const { user } = useContext(AuthContext); // 🔥 Para mostrar el menú solo a clientes

  return (
    <AuthProvider>
      <Router>
        <Navbar />

        {/* Contenedor con padding inferior para que el menú no tape el contenido */}
        <div className={user && user.rol !== "admin" ? "pb-24" : ""}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/perfil" element={<Profile />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* 🔥 Ruta Protegida Checkout */}
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
        </div>

        {/* 🔥 MENÚ INFERIOR (TAB BAR) 🔥 */}
        {user && user.rol !== "admin" && (
          <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-3 shadow-[0_-5px_15px_rgba(0,0,0,0.1)] z-50">
            <Link
              to="/"
              className="flex flex-col items-center text-gray-500 hover:text-orange-600 transition-colors"
            >
              <span className="text-2xl">🏠</span>
              <span className="text-[10px] font-black uppercase italic">
                Menú
              </span>
            </Link>

            <Link
              to="/checkout"
              className="flex flex-col items-center text-orange-600"
            >
              <span className="text-2xl">🛒</span>
              <span className="text-[10px] font-black uppercase italic">
                Carrito
              </span>
            </Link>

            <Link
              to="/mis-pedidos"
              className="flex flex-col items-center text-gray-500 hover:text-orange-600 transition-colors"
            >
              <span className="text-2xl">📋</span>
              <span className="text-[10px] font-black uppercase italic">
                Pedidos
              </span>
            </Link>
          </nav>
        )}
      </Router>
    </AuthProvider>
  );
}

export default App;
