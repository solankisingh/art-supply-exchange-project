import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

  return (
    <div className="w-full flex items-center justify-center py-8">
      <div className="w-full max-w-md bg-white border border-slate-300 rounded shadow p-6">
        <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">
          {isRegister ? 'Register Account' : 'User Login'}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 text-sm px-3 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {isRegister && (
            <>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full border border-slate-300 rounded px-3 py-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">City / College Campus *</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Design Block / Main Campus"
                  className="w-full border border-slate-300 rounded px-3 py-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">About / Bio (Optional)</label>
                <input
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Short note about what art mediums you work with"
                  className="w-full border border-slate-300 rounded px-3 py-2 text-slate-800"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-slate-700 font-medium mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full border border-slate-300 rounded px-3 py-2 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Password *</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full border border-slate-300 rounded px-3 py-2 text-slate-800"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 rounded mt-2 transition-colors"
          >
            {loading ? 'Please wait...' : isRegister ? 'Register' : 'Login'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-600 mt-4 pt-3 border-t border-slate-200">
          {isRegister ? (
            <span>
              Already registered?{' '}
              <Link to="/login" className="text-blue-600 hover:underline font-medium">
                Go to Login
              </Link>
            </span>
          ) : (
            <span>
              Need an account?{' '}
              <Link to="/register" className="text-blue-600 hover:underline font-medium">
                Create new account
              </Link>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
