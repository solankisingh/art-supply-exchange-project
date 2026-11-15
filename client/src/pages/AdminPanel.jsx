import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AdminPanel() {
  const { user, token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/overview', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const removeListing = async (itemId) => {
    if (!window.confirm('Admin action: Delete this listing?')) return;
    try {
      const res = await fetch(`/api/items/${itemId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-xs">Loading Admin Panel...</div>;
  }

  if (!data) {
    return <div className="p-8 text-center text-red-600 dark:text-red-400 text-sm">Access Denied: Admins Only.</div>;
  }

  return (
    <div className="w-full space-y-6">
      <div className="w-full bg-slate-800 dark:bg-slate-950 text-white p-4 rounded-xl shadow border border-slate-700 dark:border-slate-800">
        <h2 className="text-xl font-bold">Admin Management Panel</h2>
        <p className="text-xs text-slate-300 dark:text-slate-400 mt-0.5">
          Platform statistics, registered users list, and listing moderation.
        </p>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
        <div className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 p-3.5 rounded-xl text-center shadow-sm transition-colors">
          <span className="text-slate-500 dark:text-slate-400 block uppercase font-semibold text-[10px]">Total Users</span>
          <span className="text-xl font-bold text-slate-800 dark:text-slate-100">{data.stats.totalUsers}</span>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 p-3.5 rounded-xl text-center shadow-sm transition-colors">
          <span className="text-slate-500 dark:text-slate-400 block uppercase font-semibold text-[10px]">Total Items</span>
          <span className="text-xl font-bold text-slate-800 dark:text-slate-100">{data.stats.totalItems}</span>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 p-3.5 rounded-xl text-center shadow-sm transition-colors">
          <span className="text-slate-500 dark:text-slate-400 block uppercase font-semibold text-[10px]">Active Items</span>
          <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{data.stats.activeListings}</span>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 p-3.5 rounded-xl text-center shadow-sm transition-colors">
          <span className="text-slate-500 dark:text-slate-400 block uppercase font-semibold text-[10px]">Swaps Total</span>
          <span className="text-xl font-bold text-slate-800 dark:text-slate-100">{data.stats.totalSwaps}</span>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 p-3.5 rounded-xl text-center shadow-sm transition-colors">
          <span className="text-slate-500 dark:text-slate-400 block uppercase font-semibold text-[10px]">Swaps Done</span>
          <span className="text-xl font-bold text-teal-600 dark:text-teal-400">{data.stats.completedSwaps}</span>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 p-3.5 rounded-xl text-center shadow-sm transition-colors">
          <span className="text-slate-500 dark:text-slate-400 block uppercase font-semibold text-[10px]">Messages</span>
          <span className="text-xl font-bold text-slate-800 dark:text-slate-100">{data.stats.totalMessages}</span>
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm p-4 space-y-3 transition-colors">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm border-b border-slate-200 dark:border-slate-700 pb-2">
          Registered Users ({data.users.length})
        </h3>
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-700/80 border-b border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-200 uppercase font-semibold tracking-wider">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Location</th>
                <th className="p-3">Role</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {data.users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                  <td className="p-3 font-bold text-slate-800 dark:text-slate-100">{u.name}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{u.email}</td>
                  <td className="p-3 text-slate-500 dark:text-slate-400">{u.location}</td>
                  <td className="p-3 font-semibold text-slate-700 dark:text-slate-300 uppercase">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      u.role === 'admin' 
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700' 
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    {u.id !== user.id && (
                      <button
                        onClick={() => toggleUserRole(u.id, u.role)}
                        className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
                      >
                        Make {u.role === 'admin' ? 'User' : 'Admin'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* LISTINGS MODERATION TABLE */}
      <div className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm p-4 space-y-3 transition-colors">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm border-b border-slate-200 dark:border-slate-700 pb-2">
          Listing Moderation ({data.items.length})
        </h3>
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-700/80 border-b border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-200 uppercase font-semibold tracking-wider">
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Condition</th>
                <th className="p-3">Price</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Moderate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {data.items.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                  <td className="p-3 font-semibold text-slate-800 dark:text-slate-100">{item.title}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{item.category}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{item.condition}</td>
                  <td className="p-3 font-bold text-slate-900 dark:text-emerald-400">${Number(item.price).toFixed(2)}</td>
                  <td className="p-3 uppercase font-medium text-slate-600 dark:text-slate-400">{item.status}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => removeListing(item.id)}
                      className="bg-rose-100 dark:bg-rose-950/60 hover:bg-rose-200 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
