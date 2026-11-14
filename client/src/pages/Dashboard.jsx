import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useSearchParams } from 'react-router-dom';
import { PlusCircle, Package, Repeat, DollarSign, Trash2, Edit3, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

const CATEGORIES = [
  'Paints & Mediums',
  'Brushes & Tools',
  'Canvases & Surfaces',
  'Drawing & Illustration',
  'Easels & Furniture',
  'Ceramics & Sculpting'
];

const CONDITIONS = ['Brand New', 'Like New', 'Gently Used', 'Well Used'];

export default function Dashboard() {
  const { user, token } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') === 'add' ? 'add' : 'listings');

  const [myItems, setMyItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // New listing form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [condition, setCondition] = useState(CONDITIONS[1]);
  const [price, setPrice] = useState('');
  const [isSwapAvailable, setIsSwapAvailable] = useState(true);
  const [swapPreferences, setSwapPreferences] = useState('');
  const [location, setLocation] = useState(user?.location || 'Seattle, WA');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  useEffect(() => {
    fetchMyItems();
  }, []);

  const fetchMyItems = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/items');
      const allItems = await res.json();
      setMyItems(allItems.filter(i => i.sellerId === user?.id));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateListing = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      const payload = {
        title,
        category,
        condition,
        price: Number(price),
        isSwapAvailable,
        swapPreferences,
        location,
        description,
        images: imageUrl ? [imageUrl] : []
      };

      const res = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setFormSuccess(true);
        // Reset form
        setTitle('');
        setPrice('');
        setDescription('');
        setSwapPreferences('');
        setImageUrl('');
        fetchMyItems();
        setTimeout(() => {
          setFormSuccess(false);
          setActiveTab('listings');
        }, 1200);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleUpdateStatus = async (itemId, newStatus) => {
    try {
      const res = await fetch(`/api/items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchMyItems();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteListing = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      const res = await fetch(`/api/items/${itemId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setMyItems(prev => prev.filter(i => i.id !== itemId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      {/* User Header Profile Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.name}`}
            alt={user?.name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-500/20 shadow-md"
          />
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-stone-900">{user?.name}</h1>
            <p className="text-xs text-stone-500 flex items-center justify-center sm:justify-start gap-2">
              <span>{user?.location}</span> • <span className="text-amber-600 font-semibold">{user?.email}</span>
            </p>
            <p className="text-xs text-stone-600 max-w-lg mt-1 italic">{user?.bio}</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-4">
          <div className="bg-stone-50 border border-stone-200 rounded-2xl px-5 py-3 text-center">
            <div className="text-2xl font-black text-stone-900">{myItems.length}</div>
            <div className="text-[10px] uppercase font-bold text-stone-400">Total Listings</div>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-3 text-center">
            <div className="text-2xl font-black text-emerald-700">
              {myItems.filter(i => i.isSwapAvailable).length}
            </div>
            <div className="text-[10px] uppercase font-bold text-emerald-600">Open to Swap</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('listings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
            activeTab === 'listings'
              ? 'bg-stone-900 text-white'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Package className="w-4 h-4" /> My Art Supplies ({myItems.length})
        </button>
        <button
          onClick={() => setActiveTab('add')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
            activeTab === 'add'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <PlusCircle className="w-4 h-4" /> List New Supply
        </button>
      </div>

      {/* TAB CONTENT: MY LISTINGS */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          {loading ? (
            <div className="p-8 text-center text-sm text-stone-500 animate-pulse">Loading listings...</div>
          ) : myItems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 space-y-4">
              <Package className="w-12 h-12 text-stone-400 mx-auto" />
              <h3 className="text-lg font-bold text-stone-800">You haven't listed any supplies yet</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Got leftover oils, unused sketchbooks, or brushes? Share them with the community to give them a second life.
              </p>
              <button
                onClick={() => setActiveTab('add')}
                className="px-5 py-2.5 bg-amber-600 text-white text-xs font-bold rounded-xl"
              >
                List Your First Material
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myItems.map(item => (
                <div key={item.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="relative h-44 bg-stone-100">
                      <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                      <span className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'available' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-800 text-white'
                      }`}>
                        {item.status.toUpperCase()}
                      </span>
                      {item.isSwapAvailable && (
                        <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                          SWAP READY
                        </span>
                      )}
                    </div>
                    <div className="p-4 space-y-2">
                      <span className="text-[10px] font-bold uppercase text-amber-600">{item.category}</span>
                      <h4 className="font-bold text-stone-900 text-sm line-clamp-1">{item.title}</h4>
                      <p className="text-xs text-stone-500 line-clamp-2">{item.description}</p>
                      <div className="text-base font-black text-stone-900 pt-1">${item.price.toFixed(2)}</div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-4 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between gap-2 text-xs">
                    <select
                      value={item.status}
                      onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                      className="bg-white border border-stone-200 text-stone-700 py-1 px-2 rounded-lg text-xs"
                    >
                      <option value="available">Status: Available</option>
                      <option value="reserved">Status: Reserved</option>
                      <option value="sold">Status: Sold</option>
                      <option value="swapped">Status: Swapped</option>
                    </select>

                    <div className="flex gap-2">
                      <Link
                        to={`/item/${item.id}`}
                        className="p-1.5 text-stone-600 hover:text-amber-600 bg-white border border-stone-200 rounded-lg"
                        title="View item"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteListing(item.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 bg-white border border-stone-200 rounded-lg"
                        title="Delete listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: ADD LISTING FORM */}
      {activeTab === 'add' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 shadow-sm max-w-3xl">
          <div className="mb-6 space-y-1">
            <h2 className="text-xl font-bold text-stone-900">List an Art Supply or Material</h2>
            <p className="text-xs text-stone-500">Provide accurate details and condition to connect with interested artists.</p>
          </div>

          {formSuccess ? (
            <div className="text-center py-12 space-y-3">
              <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-bold text-stone-900">Listing Published Successfully!</h3>
              <p className="text-xs text-stone-500">Your art supply is now live on the community marketplace.</p>
            </div>
          ) : (
            <form onSubmit={handleCreateListing} className="space-y-5 text-sm">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">Listing Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Winsor & Newton Oil Colour Set (10 Tubes, 21ml)"
                  className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-700">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 text-xs bg-white"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-700">Condition *</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 text-xs bg-white"
                  >
                    {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-700">Price ($ USD) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.5"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-700">Local Pickup Location *</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Capitol Hill / Seattle"
                    className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-700">Image URL (Direct photo link)</label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Swap Checkbox & Preferences */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isSwapAvailable}
                    onChange={(e) => setIsSwapAvailable(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-stone-300"
                  />
                  <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <Repeat className="w-4 h-4 text-emerald-600" />
                    Open to material exchange (swap requests)
                  </span>
                </label>

                {isSwapAvailable && (
                  <div className="space-y-1 pl-6">
                    <label className="block text-xs font-semibold text-stone-600">
                      What are you willing to swap this for?
                    </label>
                    <input
                      type="text"
                      value={swapPreferences}
                      onChange={(e) => setSwapPreferences(e.target.value)}
                      placeholder="e.g. Looking for heavy watercolor paper (300gsm) or linocut gouges"
                      className="w-full p-2.5 rounded-xl border border-stone-200 text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">Detailed Description *</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail the remaining amount, brand, pigment grade, any wear, and why you are letting it go..."
                  className="w-full p-3 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={formSubmitting}
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shadow-md transition-all"
              >
                {formSubmitting ? 'Publishing...' : 'Publish Art Supply Listing'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
