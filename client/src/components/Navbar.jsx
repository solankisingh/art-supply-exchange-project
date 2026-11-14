import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isCurrent = (p) => location.pathname === p;

  return (
    <nav className="w-full bg-slate-800 text-white shadow-md border-b border-slate-700">
      <div className="w-full px-4 sm:px-8 py-3 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold tracking-wide text-emerald-400 hover:text-emerald-300">
            ArtSupplyExchange
          </Link>

          {/* Main Links */}
          <div className="hidden md:flex items-center gap-4 text-sm font-medium">
            <Link 
              to="/" 
              className={`px-3 py-1.5 rounded ${isCurrent('/') ? 'bg-slate-900 text-emerald-400' : 'hover:bg-slate-700 text-slate-200'}`}
            >
              Browse Supplies
            </Link>

            {isAuthenticated && (
              <>
                <Link 
                  to="/dashboard" 
                  className={`px-3 py-1.5 rounded ${isCurrent('/dashboard') ? 'bg-slate-900 text-emerald-400' : 'hover:bg-slate-700 text-slate-200'}`}
                >
                  My Dashboard
                </Link>
                <Link 
                  to="/swaps" 
                  className={`px-3 py-1.5 rounded ${isCurrent('/swaps') ? 'bg-slate-900 text-emerald-400' : 'hover:bg-slate-700 text-slate-200'}`}
                >
                  Swap Requests
                </Link>
                <Link 
                  to="/chat" 
                  className={`px-3 py-1.5 rounded ${isCurrent('/chat') ? 'bg-slate-900 text-emerald-400' : 'hover:bg-slate-700 text-slate-200'}`}
                >
                  Messages
                </Link>
              </>
            )}

            {isAdmin && (
              <Link 
                to="/admin" 
                className={`px-3 py-1.5 rounded text-amber-300 ${isCurrent('/admin') ? 'bg-slate-900 font-bold' : 'hover:bg-slate-700'}`}
              >
                Admin Panel
              </Link>
            )}
          </div>
        </div>

        {/* Right side user actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-4 text-sm">
              <span className="hidden sm:inline-block text-slate-300">
                Hi, <strong className="text-white">{user?.name}</strong> {isAdmin && <span className="text-xs bg-amber-500 text-black px-1.5 py-0.5 rounded ml-1 font-bold">Admin</span>}
              </span>
              <Link 
                to="/dashboard?action=new" 
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded font-medium text-xs sm:text-sm"
              >
                + Post Supply
              </Link>
              <button 
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="bg-rose-700 hover:bg-rose-600 text-white px-3 py-1.5 rounded text-xs sm:text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm">
              <Link 
                to="/login" 
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-1.5 rounded"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded font-medium"
              >
                Register
              </Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}
