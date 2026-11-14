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
    return <div className="p-8 text-center text-slate-500 text-xs">Loading Admin Panel...</div>;
  }

  if (!data) {
    return <div className="p-8 text-center text-red-600 text-sm">Access Denied: Admins Only.</div>;
  }

  return (
    <div className="w-full space-y-6">
      <div className="w-full bg-slate-800 text-white p-4 rounded shadow">
        <h2 className="text-xl font-bold">Admin Management Panel</h2>
        <p className="text-xs text-slate-300">
          Platform statistics, registered users list, and listing moderation.
        </p>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
        <div className="bg-white border border-slate-300 p-3 rounded text-center">
          <span className="text-slate-500 block uppercase font-semibold">Total Users</span>
          <span className="text-xl font-bold text-slate-800">{data.stats.totalUsers}</span>
        </div>
        <div className="bg-white border border-slate-300 p-3 rounded text-center">
          <span className="text-slate-500 block uppercase font-semibold">Total Items</span>
          <span className="text-xl font-bold text-slate-800">{data.stats.totalItems}</span>
        </div>
        <div className="bg-white border border-slate-300 p-3 rounded text-center">
          <span className="text-slate-500 block uppercase font-semibold">Active Items</span>
          <span className="text-xl font-bold text-slate-800">{data.stats.activeListings}</span>
        </div>
        <div className="bg-white border border-slate-300 p-3 rounded text-center">
          <span className="text-slate-500 block uppercase font-semibold">Swaps Total</span>
          <span className="text-xl font-bold text-slate-800">{data.stats.totalSwaps}</span>
        </div>
        <div className="bg-white border border-slate-300 p-3 rounded text-center">
          <span className="text-slate-500 block uppercase font-semibold">Swaps Done</span>
          <span className="text-xl font-bold text-slate-800">{data.stats.completedSwaps}</span>
        </div>
        <div className="bg-white border border-slate-300 p-3 rounded text-center">
          <span className="text-slate-500 block uppercase font-semibold">Messages</span>
          <span className="text-xl font-bold text-slate-800">{data.stats.totalMessages}</span>
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="w-full bg-white border border-slate-300 rounded shadow-sm p-4 space-y-3">
        <h3 className="font-bold text-slate-800 text-sm border-b border-slate-200 pb-2">
          Registered Users ({data.users.length})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 text-slate-600 uppercase">
                <th className="p-2.5">Name</th>
                <th className="p-2.5">Email</th>
                <th className="p-2.5">Location</th>
                <th className="p-2.5">Role</th>
                <th className="p-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data.users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="p-2.5 font-bold text-slate-800">{u.name}</td>
                  <td className="p-2.5 text-slate-600">{u.email}</td>
                  <td className="p-2.5 text-slate-500">{u.location}</td>
                  <td className="p-2.5 font-semibold text-slate-700 uppercase">{u.role}</td>
                  <td className="p-2.5 text-right">
                    {u.id !== user.id && (
                      <button
                        onClick={() => toggleUserRole(u.id, u.role)}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-2 py-1 rounded text-[11px]"
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
      <div className="w-full bg-white border border-slate-300 rounded shadow-sm p-4 space-y-3">
        <h3 className="font-bold text-slate-800 text-sm border-b border-slate-200 pb-2">
          Listing Moderation ({data.items.length})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 text-slate-600 uppercase">
                <th className="p-2.5">Title</th>
                <th className="p-2.5">Category</th>
                <th className="p-2.5">Condition</th>
                <th className="p-2.5">Price</th>
                <th className="p-2.5">Status</th>
                <th className="p-2.5 text-right">Moderate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data.items.map(item => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="p-2.5 font-semibold text-slate-800">{item.title}</td>
                  <td className="p-2.5 text-slate-600">{item.category}</td>
                  <td className="p-2.5 text-slate-600">{item.condition}</td>
                  <td className="p-2.5 font-bold text-slate-900">${Number(item.price).toFixed(2)}</td>
                  <td className="p-2.5 uppercase font-medium text-slate-600">{item.status}</td>
                  <td className="p-2.5 text-right">
                    <button
                      onClick={() => removeListing(item.id)}
                      className="bg-rose-100 hover:bg-rose-200 text-rose-700 px-2 py-1 rounded text-[11px]"
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
