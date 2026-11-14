import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, MapPin, FileText, Eye, EyeOff, AlertCircle } from 'lucide-react';
import authBg from '../assets/auth-bg.jpg';

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
    <div
      className="w-full min-h-[calc(100vh-140px)] relative flex items-center justify-center py-10 px-4 sm:px-6 bg-cover bg-center bg-no-repeat rounded-2xl overflow-hidden shadow-xl"
      style={{ backgroundImage: `url(${authBg})` }}
    >
      {/* Subtle Dark Gradient Overlay across full artistic background */}
      <div className="absolute inset-0 bg-slate-950/45 backdrop-brightness-[0.8] pointer-events-none" />

      {/* Transparent Glassmorphism Card */}
      <div
        className={`relative z-10 w-full max-w-[460px] bg-[#1e1e23]/55 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-7 sm:p-8 flex flex-col justify-between ${
          isRegister ? 'min-h-[620px]' : 'min-h-[490px]'
        }`}
      >
        <div>
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {isRegister ? 'Create New Account' : 'User Login'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-200/85 mt-1.5 leading-relaxed">
              {isRegister
                ? 'Join Art Supply Exchange and start buying, selling, swapping or donating art materials.'
                : 'Welcome back! Please login to your account.'}
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-red-950/80 border border-red-500/50 text-red-200 text-xs px-3.5 py-2.5 rounded-lg mb-5 flex items-center gap-2 backdrop-blur-sm">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            {isRegister && (
              <>
                <div>
                  <label className="block text-white font-medium mb-1.5">
                    Your Full Name <span className="text-emerald-400">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <User className="w-4 h-4 text-slate-300 absolute left-3.5 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      className="w-full h-12 pl-10 pr-3.5 bg-white/10 hover:bg-white/15 focus:bg-white/15 border border-white/25 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 rounded-lg text-white placeholder-slate-300/60 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-1.5">
                    City / College Campus <span className="text-emerald-400">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <MapPin className="w-4 h-4 text-slate-300 absolute left-3.5 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. North Campus / Studio Block"
                      className="w-full h-12 pl-10 pr-3.5 bg-white/10 hover:bg-white/15 focus:bg-white/15 border border-white/25 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 rounded-lg text-white placeholder-slate-300/60 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-1.5">
                    About / Art Mediums <span className="text-slate-300 font-normal">(Optional)</span>
                  </label>
                  <div className="relative flex items-center">
                    <FileText className="w-4 h-4 text-slate-300 absolute left-3.5 pointer-events-none" />
                    <input
                      type="text"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="e.g. Oil painting, acrylics, or ceramic clay"
                      className="w-full h-12 pl-10 pr-3.5 bg-white/10 hover:bg-white/15 focus:bg-white/15 border border-white/25 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 rounded-lg text-white placeholder-slate-300/60 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-white font-medium mb-1.5">
                Email Address <span className="text-emerald-400">*</span>
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-300 absolute left-3.5 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full h-12 pl-10 pr-3.5 bg-white/10 hover:bg-white/15 focus:bg-white/15 border border-white/25 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 rounded-lg text-white placeholder-slate-300/60 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-1.5">
                Password <span className="text-emerald-400">*</span>
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-300 absolute left-3.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full h-12 pl-10 pr-10 bg-white/10 hover:bg-white/15 focus:bg-white/15 border border-white/25 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 rounded-lg text-white placeholder-slate-300/60 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-300 hover:text-white focus:outline-none p-1 transition-colors"
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
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold rounded-lg text-sm sm:text-base shadow-lg transition-all flex items-center justify-center cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Login'}
              </button>
            </div>
          </form>
        </div>

        {/* Divider & Switch Mode */}
        <div className="mt-6 pt-5 border-t border-white/15 text-center text-xs sm:text-sm text-slate-300">
          {isRegister ? (
            <span>
              Already have an account?{' '}
              <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold hover:underline">
                Login here
              </Link>
            </span>
          ) : (
            <span>
              Need an account?{' '}
              <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-semibold hover:underline">
                Create new account
              </Link>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
