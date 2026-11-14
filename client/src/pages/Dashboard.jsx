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
      <div className="w-full bg-white border border-slate-300 rounded shadow-sm p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">{user?.name}'s Dashboard</h2>
          <p className="text-xs text-slate-500">
            {user?.email} &bull; Location: {user?.location || 'Not set'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTab('my_items')}
            className={`px-4 py-1.5 rounded text-xs font-semibold ${
              tab === 'my_items' ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-700'
            }`}
          >
            My Supplies ({items.length})
          </button>
          <button
            onClick={() => setTab('new')}
            className={`px-4 py-1.5 rounded text-xs font-semibold ${
              tab === 'new' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
            }`}
          >
            + Post Supply
          </button>
        </div>
      </div>

      {/* TAB 1: LISTINGS */}
      {tab === 'my_items' && (
        <div className="w-full bg-white border border-slate-300 rounded shadow-sm p-4 space-y-4">
          <h3 className="font-bold text-slate-800 text-sm border-b border-slate-200 pb-2">
            My Listed Art Supplies
          </h3>

          {loading ? (
            <div className="p-8 text-center text-slate-500 text-xs">Loading listings...</div>
          ) : items.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs space-y-2">
              <p>You have not posted any art supplies yet.</p>
              <button
                onClick={() => setTab('new')}
                className="bg-emerald-600 text-white px-3 py-1.5 rounded font-medium"
              >
                Post Your First Supply
              </button>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-slate-600 uppercase">
                    <th className="p-2.5">Title</th>
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5">Price</th>
                    <th className="p-2.5">Swap Eligible</th>
                    <th className="p-2.5">Status</th>
                    <th className="p-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {items.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="p-2.5 font-semibold text-slate-800">
                        <Link to={`/item/${item.id}`} className="hover:underline text-blue-600">
                          {item.title}
                        </Link>
                      </td>
                      <td className="p-2.5 text-slate-600">{item.category}</td>
                      <td className="p-2.5 font-bold text-slate-900">${Number(item.price).toFixed(2)}</td>
                      <td className="p-2.5">
                        {item.isSwapAvailable ? (
                          <span className="text-emerald-700 font-bold">Yes</span>
                        ) : (
                          <span className="text-slate-400">No</span>
                        )}
                      </td>
                      <td className="p-2.5">
                        <select
                          value={item.status}
                          onChange={(e) => updateStatus(item.id, e.target.value)}
                          className="border border-slate-300 rounded px-1.5 py-0.5 text-xs text-slate-700 bg-white"
                        >
                          <option value="available">available</option>
                          <option value="reserved">reserved</option>
                          <option value="sold">sold</option>
                          <option value="swapped">swapped</option>
                        </select>
                      </td>
                      <td className="p-2.5 text-right">
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="bg-rose-100 hover:bg-rose-200 text-rose-700 px-2 py-1 rounded text-[11px] font-medium"
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
        <div className="w-full bg-white border border-slate-300 rounded shadow-sm p-6 max-w-3xl space-y-4">
          <h3 className="font-bold text-slate-800 text-base border-b border-slate-200 pb-2">
            Post an Art Supply Listing
          </h3>

          <form onSubmit={handleCreate} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Item Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Acrylic Paint Set 12 Colors, Canvas 16x20, etc."
                className="w-full border border-slate-300 rounded p-2 text-slate-800"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-slate-300 rounded p-2 bg-white text-slate-800"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Condition *</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full border border-slate-300 rounded p-2 bg-white text-slate-800"
                >
                  {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Price ($) *</label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full border border-slate-300 rounded p-2 text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Pickup Location *</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Fine Arts Lab / North Campus"
                  className="w-full border border-slate-300 rounded p-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Image URL (Optional)</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Direct image link (https://...)"
                  className="w-full border border-slate-300 rounded p-2 text-slate-800"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-300 rounded space-y-2">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={isSwapAvailable}
                  onChange={(e) => setIsSwapAvailable(e.target.checked)}
                />
                Accept swap / exchange offers for this item
              </label>

              {isSwapAvailable && (
                <div>
                  <label className="block text-slate-600 mb-1">What would you like to swap for?</label>
                  <input
                    type="text"
                    value={swapPreferences}
                    onChange={(e) => setSwapPreferences(e.target.value)}
                    placeholder="e.g. Looking for oil paints, sketchbooks, or charcoal"
                    className="w-full border border-slate-300 rounded p-2 bg-white text-slate-800"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Detailed Description *</label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mention how much is left, condition of brushes/canvases, brand name..."
                className="w-full border border-slate-300 rounded p-2 text-slate-800"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-2 rounded"
              >
                {saving ? 'Publishing...' : 'Save & Publish Listing'}
              </button>
              <button
                type="button"
                onClick={() => setTab('my_items')}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium px-4 py-2 rounded"
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
