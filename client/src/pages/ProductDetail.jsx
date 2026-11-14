import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapPin, Tag, Repeat, MessageSquare, ShieldAlert, ArrowLeft, CheckCircle2, User, Clock } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, token } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);

  // Swap Proposal Modal State
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [myListings, setMyListings] = useState([]);
  const [selectedOfferedItem, setSelectedOfferedItem] = useState('');
  const [swapNote, setSwapNote] = useState('');
  const [swapSubmitting, setSwapSubmitting] = useState(false);
  const [swapSuccess, setSwapSuccess] = useState(false);

  // Quick Chat State
  const [chatInitiating, setChatInitiating] = useState(false);

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const res = await fetch(`/api/items/${id}`);
      if (!res.ok) throw new Error('Not found');
      const data = await res.json();
      setItem(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openSwapModal = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setIsSwapModalOpen(true);
    // Fetch current user's items to offer
    try {
      const res = await fetch('/api/items');
      const allItems = await res.json();
      const userItems = allItems.filter(i => i.sellerId === user.id && i.status === 'available');
      setMyListings(userItems);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSwapSubmit = async (e) => {
    e.preventDefault();
    setSwapSubmitting(true);
    try {
      const res = await fetch('/api/swaps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          targetItemId: item.id,
          offeredItemId: selectedOfferedItem || null,
          offeredDescription: swapNote
        })
      });

      if (res.ok) {
        setSwapSuccess(true);
        setTimeout(() => {
          setIsSwapModalOpen(false);
          setSwapSuccess(false);
          navigate('/swaps');
        }, 1500);
      } else {
        const error = await res.json();
        alert(error.message || 'Error sending swap offer');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSwapSubmitting(false);
    }
  };

  const handleStartChat = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setChatInitiating(true);
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          sellerId: item.sellerId,
          itemId: item.id,
          initialMessage: `Hi ${item.seller?.name || 'there'}, I'm interested in your listing: "${item.title}". Is it still available?`
        })
      });

      if (res.ok) {
        const conv = await res.json();
        navigate(`/chat?id=${conv.id}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setChatInitiating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-4 animate-pulse space-y-6">
        <div className="h-6 bg-stone-200 rounded w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-96 bg-stone-200 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 bg-stone-200 rounded w-3/4" />
            <div className="h-6 bg-stone-200 rounded w-1/3" />
            <div className="h-32 bg-stone-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 max-w-xl mx-auto space-y-4">
        <h2 className="text-2xl font-bold text-stone-800">Art Supply Not Found</h2>
        <p className="text-stone-500">The listing may have been removed or marked as completed.</p>
        <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 text-white rounded-xl font-medium">
          <ArrowLeft className="w-4 h-4" /> Return to Marketplace
        </Link>
      </div>
    );
  }

  const isOwner = user?.id === item.sellerId;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm text-stone-500">
        <Link to="/" className="hover:text-stone-800 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Marketplace
        </Link>
        <span>/</span>
        <span className="text-stone-400">{item.category}</span>
        <span>/</span>
        <span className="text-stone-900 font-medium truncate max-w-xs">{item.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white p-6 md:p-8 rounded-3xl border border-stone-200 shadow-sm">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-4/3 rounded-2xl bg-stone-100 overflow-hidden border border-stone-200">
            <img
              src={item.images[selectedImg] || item.images[0]}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            {item.isSwapAvailable && (
              <span className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-md flex items-center gap-1.5">
                <Repeat className="w-3.5 h-3.5" /> Open to Exchange / Swap
              </span>
            )}
            <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/95 backdrop-blur-md text-stone-800 shadow-sm">
              {item.condition}
            </span>
          </div>

          {/* Thumbnail list if multiple */}
          {item.images.length > 1 && (
            <div className="flex gap-3">
              {item.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImg(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImg === i ? 'border-amber-600 scale-95' : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Listing Details & Actions */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold tracking-wider uppercase text-amber-600">
                {item.category}
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900 mt-1 leading-snug">
                {item.title}
              </h1>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-stone-900">${item.price.toFixed(2)}</span>
              <span className="text-xs text-stone-500 font-medium">USD • Direct Local Price</span>
            </div>

            <div className="flex items-center gap-4 text-xs text-stone-500 py-3 border-y border-stone-100">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-stone-400" />
                <span>{item.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-stone-400" />
                <span>Listed {new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Item Details & Condition</h4>
              <p className="text-sm text-stone-600 whitespace-pre-line leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Swap Preferences Callout */}
            {item.isSwapAvailable && item.swapPreferences && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 space-y-1 text-emerald-900">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800">
                  <Repeat className="w-4 h-4 text-emerald-600" /> Artist's Swap Preferences
                </div>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  {item.swapPreferences}
                </p>
              </div>
            )}
          </div>

          {/* Action CTAs & Seller Box */}
          <div className="space-y-4 pt-4 border-t border-stone-100">
            {/* Seller profile card */}
            {item.seller && (
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                <img
                  src={item.seller.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${item.seller.name}`}
                  alt={item.seller.name}
                  className="w-11 h-11 rounded-full object-cover border border-stone-200"
                />
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-stone-900 leading-tight">{item.seller.name}</h4>
                  <p className="text-xs text-stone-500 line-clamp-1">{item.seller.bio || item.seller.location}</p>
                </div>
              </div>
            )}

            {/* CTAs */}
            {isOwner ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center text-xs font-semibold text-amber-800">
                This is your active listing. Manage it from your <Link to="/dashboard" className="underline font-bold">Dashboard</Link>.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleStartChat}
                  disabled={chatInitiating}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-sm font-semibold shadow-sm transition-all"
                >
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  {chatInitiating ? 'Opening Chat...' : 'Message & Buy'}
                </button>

                {item.isSwapAvailable && (
                  <button
                    onClick={openSwapModal}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all"
                  >
                    <Repeat className="w-4 h-4" />
                    Propose Swap
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SWAP PROPOSAL MODAL */}
      {isSwapModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-stone-200 shadow-2xl">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Repeat className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-stone-900 text-lg">Propose Art Supply Swap</h3>
              </div>
              <button
                onClick={() => setIsSwapModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 text-xl font-bold"
              >
                ×
              </button>
            </div>

            {swapSuccess ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-stone-900 text-lg">Swap Offer Sent!</h4>
                <p className="text-xs text-stone-500">
                  The seller has been notified and a chat thread has been opened in your Swap Hub.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSwapSubmit} className="space-y-4 text-sm">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center gap-3">
                  <img src={item.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  <div>
                    <span className="text-[10px] text-amber-600 uppercase font-bold">You are requesting</span>
                    <h5 className="font-semibold text-stone-900 text-xs line-clamp-1">{item.title}</h5>
                  </div>
                </div>

                {/* Offer from existing listings */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-700">
                    Select an item from your listings (Optional):
                  </label>
                  {myListings.length > 0 ? (
                    <select
                      value={selectedOfferedItem}
                      onChange={(e) => setSelectedOfferedItem(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-200 text-xs bg-white focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">-- Choose an item you own to trade --</option>
                      {myListings.map(ml => (
                        <option key={ml.id} value={ml.id}>
                          {ml.title} (${ml.price}) - {ml.condition}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="text-xs text-stone-500 p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                      You don't have any active listings yet. You can still propose a swap by describing your offer below!
                    </div>
                  )}
                </div>

                {/* Note / Custom Proposal */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-700">
                    Swap Description & Negotiation Note:
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={swapNote}
                    onChange={(e) => setSwapNote(e.target.value)}
                    placeholder="Describe what you would like to offer in exchange (brand, condition, quantity) and your preferred local meetup or drop-off point..."
                    className="w-full p-3 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsSwapModalOpen(false)}
                    className="flex-1 py-2.5 border border-stone-200 text-stone-600 hover:bg-stone-50 rounded-xl font-medium text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={swapSubmitting}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-sm"
                  >
                    {swapSubmitting ? 'Submitting Offer...' : 'Send Swap Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
