import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { MisBovinos } from './pages/bovinos/MisBovinos';
import { DetalleBovino } from './pages/bovinos/DetalleBovino';
import { Marketplace } from './pages/marketplace/Marketplace';
import { DetallePublicacion } from './pages/marketplace/DetallePublicacion';
import { MisPublicaciones } from './pages/marketplace/MisPublicaciones';

function App() {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/marketplace"
          element={
            <ProtectedRoute>
              <Marketplace />
            </ProtectedRoute>
          }
        />

        <Route
          path="/marketplace/:id"
          element={
            <ProtectedRoute>
              <DetallePublicacion />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mis-publicaciones"
          element={
            <ProtectedRoute>
              <MisPublicaciones />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bovinos"
          element={
            <ProtectedRoute>
              <MisBovinos />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bovinos/:id"
          element={
            <ProtectedRoute>
              <DetalleBovino />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
