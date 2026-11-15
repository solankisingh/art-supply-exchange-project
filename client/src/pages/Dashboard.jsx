import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useSearchParams } from 'react-router-dom';

const CATEGORIES = [
  'Paints & Colors',
  'Brushes & Palettes',
  'Canvases & Boards',
  'Sketchbooks & Paper',
  'Drawing & Pens',
  'Easels & Stands',
  'Clay & Modeling'
];

const CONDITIONS = ['Brand New', 'Like New', 'Used - Good', 'Used - Fair'];

export default function Dashboard() {
  const { user, token } = useAuth();
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get('action') === 'new' ? 'new' : 'my_items');

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [condition, setCondition] = useState(CONDITIONS[1]);
  const [price, setPrice] = useState('');
  const [isSwapAvailable, setIsSwapAvailable] = useState(true);
  const [swapPreferences, setSwapPreferences] = useState('');
  const [location, setLocation] = useState(user?.location || '');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/items');
      const all = await res.json();
      setItems(all.filter(i => i.sellerId === user?.id));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          category,
          condition,
          price: Number(price),
          isSwapAvailable,
          swapPreferences,
          location,
          imageUrl,
          description
        })
      });

      if (res.ok) {
        alert('Material listed successfully!');
        setTitle('');
        setPrice('');
        setDescription('');
        setSwapPreferences('');
        setImageUrl('');
        fetchMyListings();
        setTab('my_items');
      } else {
        const err = await res.json();
        alert(err.message || 'Error creating listing');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await fetch(`/api/items/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      fetchMyListings();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Delete this listing?')) return;
    try {
      await fetch(`/api/items/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* User profile brief */}
      <div className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{user?.name}'s Dashboard</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {user?.email} &bull; Location: {user?.location || 'Not set'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTab('my_items')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              tab === 'my_items' ? 'bg-slate-800 dark:bg-slate-900 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
            }`}
          >
            My Supplies ({items.length})
          </button>
          <button
            onClick={() => setTab('new')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              tab === 'new' ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
            }`}
          >
            + Post Supply
          </button>
        </div>
      </div>

      {/* TAB 1: LISTINGS */}
      {tab === 'my_items' && (
        <div className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm p-4 space-y-4 transition-colors">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm border-b border-slate-200 dark:border-slate-700 pb-2">
            My Listed Art Supplies
          </h3>

          {loading ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-xs">Loading listings...</div>
          ) : items.length === 0 ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-xs space-y-2">
              <p>You have not posted any art supplies yet.</p>
              <button
                onClick={() => setTab('new')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg font-medium shadow-sm transition-colors cursor-pointer"
              >
                Post Your First Supply
              </button>
            </div>
          ) : (
            <div className="w-full overflow-x-auto rounded-lg">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-700/80 border-b border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-200 uppercase font-semibold tracking-wider">
                    <th className="p-3">Title</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Swap Eligible</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {items.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                      <td className="p-3 font-semibold text-slate-800 dark:text-slate-100">
                        <Link to={`/item/${item.id}`} className="hover:underline text-emerald-600 dark:text-emerald-400">
                          {item.title}
                        </Link>
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-300">{item.category}</td>
                      <td className="p-3 font-bold text-slate-900 dark:text-emerald-400">${Number(item.price).toFixed(2)}</td>
                      <td className="p-3">
                        {item.isSwapAvailable ? (
                          <span className="text-emerald-700 dark:text-emerald-400 font-bold">Yes</span>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500">No</span>
                        )}
                      </td>
                      <td className="p-3">
                        <select
                          value={item.status}
                          onChange={(e) => updateStatus(item.id, e.target.value)}
                          className="border border-slate-300 dark:border-slate-600 rounded-lg px-2 py-1 text-xs text-slate-700 dark:text-slate-100 bg-white dark:bg-slate-700 focus:outline-none cursor-pointer"
                        >
                          <option value="available">available</option>
                          <option value="reserved">reserved</option>
                          <option value="sold">sold</option>
                          <option value="swapped">swapped</option>
                        </select>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="bg-rose-100 dark:bg-rose-950/60 hover:bg-rose-200 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 px-2 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: POST NEW ITEM */}
      {tab === 'new' && (
        <div className="w-full max-w-3xl mx-auto bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm p-6 space-y-4 transition-colors">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base border-b border-slate-200 dark:border-slate-700 pb-2">
            Post an Art Supply Listing
          </h3>

          <form onSubmit={handleCreate} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Item Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Acrylic Paint Set 12 Colors, Canvas 16x20, etc."
                className="w-full border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-600 cursor-pointer"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Condition *</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-600 cursor-pointer"
                >
                  {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Price ($) *</label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Pickup Location *</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Fine Arts Lab / North Campus"
                  className="w-full border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Image URL (Optional)</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Direct image link (https://...)"
                  className="w-full border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-700/60 border border-slate-300 dark:border-slate-600 rounded-lg space-y-2 transition-colors">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={isSwapAvailable}
                  onChange={(e) => setIsSwapAvailable(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 dark:border-slate-500"
                />
                Accept swap / exchange offers for this item
              </label>

              {isSwapAvailable && (
                <div className="pt-1">
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">What would you like to swap for?</label>
                  <input
                    type="text"
                    value={swapPreferences}
                    onChange={(e) => setSwapPreferences(e.target.value)}
                    placeholder="e.g. Looking for oil paints, sketchbooks, or charcoal"
                    className="w-full border border-slate-300 dark:border-slate-500 rounded-lg p-2.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Detailed Description *</label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mention how much is left, condition of brushes/canvases, brand name..."
                className="w-full border border-slate-300 dark:border-slate-600 rounded-lg p-2.5 text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                {saving ? 'Publishing...' : 'Save & Publish Listing'}
              </button>
              <button
                type="button"
                onClick={() => setTab('my_items')}
                className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
