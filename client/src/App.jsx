import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Marketplace from './pages/Marketplace';
import ProductDetail from './pages/ProductDetail';
import Dashboard from './pages/Dashboard';
import SwapHub from './pages/SwapHub';
import Chat from './pages/Chat';
import AdminPanel from './pages/AdminPanel';
import AuthPage from './pages/AuthPage';
import { useAuth } from './context/AuthContext';

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return <div className="p-8 text-center text-slate-600">Checking session...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="w-full min-h-screen flex flex-col bg-slate-100 text-slate-800">
      <Navbar />

      {/* When on Auth pages, remove all container padding and constraints so background covers 100% */}
      <main className={`w-full flex-1 ${isAuthPage ? 'p-0 flex flex-col' : 'px-4 sm:px-8 py-6'}`}>
        <Routes>
          <Route path="/" element={<Marketplace />} />
          <Route path="/item/:id" element={<ProductDetail />} />
          <Route path="/login" element={<AuthPage isRegister={false} />} />
          <Route path="/register" element={<AuthPage isRegister={true} />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/swaps"
            element={
              <ProtectedRoute>
                <SwapHub />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="w-full bg-slate-800 text-slate-400 text-xs py-4 px-6 text-center border-t border-slate-700">
        Art Supply Exchange & Second-Hand Marketplace &bull; Full-Screen Web App
      </footer>
    </div>
  );
}
