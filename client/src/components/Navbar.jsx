import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Palette, Repeat, MessageSquare, LayoutDashboard, ShieldCheck, LogIn, LogOut, PlusCircle, User } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'text-amber-600 font-semibold border-b-2 border-amber-600' : 'text-stone-600 hover:text-stone-900';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-rose-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-stone-900 group-hover:text-amber-600 transition-colors">
                Art<span className="text-amber-600">Exchange</span>
              </span>
              <span className="block text-[10px] tracking-widest uppercase font-medium text-stone-400">Second-hand Materials</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/" className={`py-5 transition-colors ${isActive('/')}`}>
              Marketplace
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/swaps" className={`py-5 flex items-center gap-1.5 transition-colors ${isActive('/swaps')}`}>
                  <Repeat className="w-4 h-4 text-emerald-600" />
                  Swap Hub
                </Link>
                <Link to="/chat" className={`py-5 flex items-center gap-1.5 transition-colors ${isActive('/chat')}`}>
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  Messages
                </Link>
                <Link to="/dashboard" className={`py-5 flex items-center gap-1.5 transition-colors ${isActive('/dashboard')}`}>
                  <LayoutDashboard className="w-4 h-4 text-amber-600" />
                  Dashboard
                </Link>
              </>
            )}
            {isAdmin && (
              <Link to="/admin" className={`py-5 flex items-center gap-1.5 text-rose-600 transition-colors ${isActive('/admin')}`}>
                <ShieldCheck className="w-4 h-4" />
                Admin
              </Link>
            )}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard?tab=add"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium rounded-lg text-white bg-amber-600 hover:bg-amber-700 shadow-sm transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  List Material
                </Link>

                <div className="flex items-center gap-3 pl-2 border-l border-stone-200">
                  <div className="flex items-center gap-2">
                    <img
                      src={user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.name}`}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full border border-stone-200 object-cover"
                    />
                    <div className="hidden lg:block text-left">
                      <div className="text-xs font-semibold text-stone-800 line-clamp-1">{user?.name}</div>
                      <div className="text-[10px] text-stone-500 capitalize">{user?.role}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                    title="Log out"
                    className="p-1.5 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium text-stone-700 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1 px-3.5 py-1.5 text-sm font-medium rounded-lg text-white bg-stone-900 hover:bg-stone-800 shadow-sm transition-all"
                >
                  Join Community
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
