import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Palette, Lock, Mail, User, AlertCircle } from 'lucide-react';

export default function AuthPage({ isRegister = false }) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    const payload = isRegister ? { name, email, password, location, bio } : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillQuickAccount = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="max-w-md mx-auto my-8 bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-amber-600 to-rose-500 flex items-center justify-center text-white shadow-md">
          <Palette className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-black text-stone-900">
          {isRegister ? 'Join the Artist Network' : 'Welcome Back'}
        </h2>
        <p className="text-xs text-stone-500">
          {isRegister
            ? 'Trade and purchase second-hand fine art materials locally.'
            : 'Sign in to access your listings, swap hub, and chats.'}
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {isRegister && (
          <>
            <div className="space-y-1">
              <label className="font-bold text-stone-700">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maya Lin"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-stone-700">Neighborhood / City *</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Fremont / Seattle"
                className="w-full p-2.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-stone-700">Artist Bio (Optional)</label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="e.g. Watercolor painter and illustrator"
                className="w-full p-2.5 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </>
        )}

        <div className="space-y-1">
          <label className="font-bold text-stone-700">Email Address *</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="artist@studio.com"
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="font-bold text-stone-700">Password *</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl shadow-md transition-all mt-2"
        >
          {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
        </button>
      </form>

      {/* Demo Credentials Quick-Fill for smooth testing */}
      {!isRegister && (
        <div className="pt-2 border-t border-stone-100 space-y-2">
          <span className="text-[10px] uppercase font-bold text-stone-400 block text-center">
            One-Click Demo Accounts (Password: password123)
          </span>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              onClick={() => fillQuickAccount('sarah@studioart.com')}
              className="p-1.5 rounded-lg border border-stone-200 hover:bg-amber-50 text-stone-700 font-medium"
            >
              Sarah (Artist/User)
            </button>
            <button
              onClick={() => fillQuickAccount('marcus@pleinair.org')}
              className="p-1.5 rounded-lg border border-stone-200 hover:bg-amber-50 text-stone-700 font-medium"
            >
              Marcus (Artist/User)
            </button>
            <button
              onClick={() => fillQuickAccount('admin@artexchange.org')}
              className="col-span-2 p-1.5 rounded-lg border border-rose-200 bg-rose-50/50 hover:bg-rose-50 text-rose-700 font-bold"
            >
              Elena (Platform Admin)
            </button>
          </div>
        </div>
      )}

      <div className="text-center text-xs text-stone-500">
        {isRegister ? (
          <span>
            Already have an account?{' '}
            <Link to="/login" className="text-amber-600 font-bold hover:underline">
              Sign In
            </Link>
          </span>
        ) : (
          <span>
            Don't have an account yet?{' '}
            <Link to="/register" className="text-amber-600 font-bold hover:underline">
              Join for Free
            </Link>
          </span>
        )}
      </div>
    </div>
  );
}
