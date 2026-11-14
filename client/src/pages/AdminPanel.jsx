import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Users, Package, ArrowRightLeft, MessageSquare, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';

export default function AdminPanel() {
  const { user, token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

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

  const handleToggleRole = async (userId, currentRole) => {
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

  const handleDeleteListing = async (itemId) => {
    if (!window.confirm('Admin action: permanently remove this art supply listing?')) return;
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
    return <div className="p-12 text-center text-sm text-stone-500 animate-pulse">Loading Admin Center...</div>;
  }

  if (!data) {
    return <div className="p-12 text-center text-rose-600 font-bold">Unauthorized or server error.</div>;
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Admin Header */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5" />
            Administrative Control Center
          </div>
          <h1 className="text-2xl font-black">Marketplace Management & Trust</h1>
          <p className="text-stone-400 text-xs">Monitor listings, resolve disputes, and ensure platform safety for creative communities.</p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-stone-800 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-white'}`}
          >
            Metrics
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'users' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-white'}`}
          >
            Users ({data.users.length})
          </button>
          <button
            onClick={() => setActiveTab('items')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'items' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-white'}`}
          >
            Listings ({data.items.length})
          </button>
        </div>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm text-center">
          <Users className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
          <div className="text-2xl font-black text-stone-900">{data.stats.totalUsers}</div>
          <div className="text-[10px] uppercase font-bold text-stone-400">Total Artists</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm text-center">
          <Package className="w-5 h-5 text-amber-600 mx-auto mb-1" />
          <div className="text-2xl font-black text-stone-900">{data.stats.totalItems}</div>
          <div className="text-[10px] uppercase font-bold text-stone-400">Total Listed</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm text-center">
          <CheckCircle className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
          <div className="text-2xl font-black text-stone-900">{data.stats.activeListings}</div>
          <div className="text-[10px] uppercase font-bold text-stone-400">Active Items</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm text-center">
          <ArrowRightLeft className="w-5 h-5 text-blue-600 mx-auto mb-1" />
          <div className="text-2xl font-black text-stone-900">{data.stats.totalSwaps}</div>
          <div className="text-[10px] uppercase font-bold text-stone-400">Swap Requests</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm text-center">
          <CheckCircle className="w-5 h-5 text-teal-600 mx-auto mb-1" />
          <div className="text-2xl font-black text-stone-900">{data.stats.completedSwaps}</div>
          <div className="text-[10px] uppercase font-bold text-stone-400">Completed Swaps</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm text-center">
          <MessageSquare className="w-5 h-5 text-rose-600 mx-auto mb-1" />
          <div className="text-2xl font-black text-stone-900">{data.stats.totalMessages}</div>
          <div className="text-[10px] uppercase font-bold text-stone-400">Negotiations</div>
        </div>
      </div>

      {/* TAB CONTENT: USERS MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-stone-200 font-bold text-stone-800 text-sm">
            Registered Artist Community Accounts
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase">
                <tr>
                  <th className="p-3.5">User</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Location</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5 text-right">Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {data.users.map(u => (
                  <tr key={u.id} className="hover:bg-stone-50/50">
                    <td className="p-3.5 flex items-center gap-2">
                      <img src={u.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.name}`} alt="" className="w-7 h-7 rounded-full object-cover" />
                      <span className="font-semibold text-stone-900">{u.name}</span>
                    </td>
                    <td className="p-3.5 text-stone-600">{u.email}</td>
                    <td className="p-3.5 text-stone-500">{u.location}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${u.role === 'admin' ? 'bg-rose-100 text-rose-800' : 'bg-stone-100 text-stone-700'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      {u.id !== user.id && (
                        <button
                          onClick={() => handleToggleRole(u.id, u.role)}
                          className="px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-[11px]"
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
      )}

      {/* TAB CONTENT: LISTINGS MODERATION */}
      {(activeTab === 'items' || activeTab === 'overview') && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-stone-200 font-bold text-stone-800 text-sm flex justify-between items-center">
            <span>Marketplace Listings Moderation</span>
            <span className="text-xs text-stone-400 font-normal">Review active art items for compliance</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase">
                <tr>
                  <th className="p-3.5">Art Supply Item</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Condition</th>
                  <th className="p-3.5">Price</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {data.items.map(item => (
                  <tr key={item.id} className="hover:bg-stone-50/50">
                    <td className="p-3.5 flex items-center gap-3">
                      <img src={item.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <span className="font-semibold text-stone-900 line-clamp-1 max-w-xs">{item.title}</span>
                    </td>
                    <td className="p-3.5 text-stone-600">{item.category}</td>
                    <td className="p-3.5 text-stone-600">{item.condition}</td>
                    <td className="p-3.5 font-bold text-stone-900">${item.price.toFixed(2)}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-stone-100 text-stone-800">
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleDeleteListing(item.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                        title="Delete listing (Moderation)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
