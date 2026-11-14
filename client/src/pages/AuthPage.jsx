import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, MapPin, FileText, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function AuthPage({ isRegister = false }) {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

  return (
    <div className="w-full min-h-[calc(100vh-160px)] flex items-center justify-center py-6 sm:py-10">
      <div className={`w-full max-w-[460px] bg-white border border-slate-200/90 rounded-xl shadow-lg p-8 flex flex-col justify-between ${isRegister ? 'min-h-[640px]' : 'min-h-[500px]'}`}>
        <div>
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {isRegister ? 'Create New Account' : 'User Login'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
              {isRegister
                ? 'Join Art Supply Exchange and start buying, selling, swapping or donating art supplies.'
                : 'Welcome back! Please login to your account.'}
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3.5 py-2.5 rounded-lg mb-5 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            {isRegister && (
              <>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      className="w-full h-12 pl-10 pr-3.5 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">
                    City / College Campus <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. North Campus / Studio Block"
                      className="w-full h-12 pl-10 pr-3.5 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">
                    About / Art Mediums <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative flex items-center">
                    <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                    <input
                      type="text"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="e.g. Oil painting, acrylics, or ceramic clay"
                      className="w-full h-12 pl-10 pr-3.5 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full h-12 pl-10 pr-3.5 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full h-12 pl-10 pr-10 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 focus:outline-none p-1"
                  tabIndex={-1}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold rounded-lg text-sm sm:text-base shadow-sm transition-all flex items-center justify-center cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Login'}
              </button>
            </div>
          </form>
        </div>

        {/* Divider & Switch Mode */}
        <div className="mt-6 pt-5 border-t border-slate-200 text-center text-xs sm:text-sm text-slate-600">
          {isRegister ? (
            <span>
              Already have an account?{' '}
              <Link to="/login" className="text-emerald-700 hover:text-emerald-800 font-semibold hover:underline">
                Login here
              </Link>
            </span>
          ) : (
            <span>
              Need an account?{' '}
              <Link to="/register" className="text-emerald-700 hover:text-emerald-800 font-semibold hover:underline">
                Create new account
              </Link>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
