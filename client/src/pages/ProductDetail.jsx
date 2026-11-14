import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, token } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Swap modal state
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [myItems, setMyItems] = useState([]);
  const [selectedOfferId, setSelectedOfferId] = useState('');
  const [swapNote, setSwapNote] = useState('');
  const [submittingSwap, setSubmittingSwap] = useState(false);

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const res = await fetch(`/api/items/${id}`);
      if (res.ok) {
        const data = await res.json();
        setItem(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSwap = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowSwapModal(true);

    try {
      const res = await fetch('/api/items');
      const all = await res.json();
      setMyItems(all.filter(i => i.sellerId === user.id && i.status === 'available'));
    } catch (err) {
      console.error(err);
    }
  };

  const submitSwapProposal = async (e) => {
    e.preventDefault();
    setSubmittingSwap(true);
    try {
      const res = await fetch('/api/swaps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          targetItemId: item.id,
          offeredItemId: selectedOfferId || null,
          offeredDescription: swapNote
        })
      });

      if (res.ok) {
        alert('Swap request submitted to seller!');
        setShowSwapModal(false);
        navigate('/swaps');
      } else {
        const err = await res.json();
        alert(err.message || 'Error creating swap proposal');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingSwap(false);
    }
  };

  const handleSendMessage = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

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
          initialMessage: `Hi, I am interested in your listing: "${item.title}". Is this still available?`
        })
      });

      if (res.ok) {
        const conv = await res.json();
        navigate(`/chat?id=${conv.id}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading item details...</div>;
  }

  if (!item) {
    return (
      <div className="w-full text-center py-12 bg-white rounded border border-slate-300 space-y-3">
        <h2 className="text-lg font-bold text-slate-800">Item Not Found</h2>
        <Link to="/" className="text-sm text-blue-600 hover:underline">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const isOwner = user?.id === item.sellerId;

  return (
    <div className="w-full space-y-4">
      <Link to="/" className="text-xs text-blue-600 hover:underline inline-block">
        &larr; Back to all listings
      </Link>

      <div className="w-full bg-white border border-slate-300 rounded shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Picture */}
        <div>
          <div className="w-full h-80 bg-slate-200 rounded border border-slate-300 flex items-center justify-center overflow-hidden">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
            ) : (
              <span className="text-slate-500 text-sm font-medium">[ No image uploaded by seller ]</span>
            )}
          </div>
        </div>

        {/* Right: Info */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase">{item.category}</span>
              <h1 className="text-2xl font-bold text-slate-900 mt-0.5">{item.title}</h1>
            </div>

            <div className="text-2xl font-bold text-slate-900">
              ${Number(item.price).toFixed(2)}
            </div>

            <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded border border-slate-200">
              <div><strong>Condition:</strong> {item.condition}</div>
              <div><strong>Location:</strong> {item.location}</div>
              <div><strong>Listed on:</strong> {new Date(item.createdAt).toLocaleDateString()}</div>
              <div><strong>Status:</strong> <span className="font-semibold uppercase text-emerald-700">{item.status}</span></div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase mb-1">Item Description:</h3>
              <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                {item.description}
              </p>
            </div>

            {item.isSwapAvailable && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded text-xs space-y-1">
                <strong>Swap Accepted:</strong>
                <p>{item.swapPreferences || 'Seller is open to swapping for other art materials.'}</p>
              </div>
            )}

            {/* Seller block */}
            <div className="pt-2 border-t border-slate-200 text-xs text-slate-600">
              <div><strong>Seller:</strong> {item.seller?.name || 'Artist'} ({item.seller?.location})</div>
              {item.seller?.bio && <div className="italic text-slate-500 mt-0.5">"{item.seller.bio}"</div>}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-200 flex flex-wrap gap-3">
            {isOwner ? (
              <div className="w-full text-xs font-medium text-slate-500 bg-slate-100 p-2 rounded text-center">
                This is your listing. Manage it from your dashboard.
              </div>
            ) : (
              <>
                <button
                  onClick={handleSendMessage}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-sm py-2 px-4 rounded font-medium"
                >
                  Send Message / Buy
                </button>

                {item.isSwapAvailable && (
                  <button
                    onClick={handleOpenSwap}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-sm py-2 px-4 rounded font-medium"
                  >
                    Propose Swap
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* SWAP MODAL */}
      {showSwapModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-lg bg-white rounded border border-slate-300 shadow p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <h3 className="font-bold text-slate-800 text-base">Propose Material Swap</h3>
              <button onClick={() => setShowSwapModal(false)} className="text-slate-500 font-bold text-lg">
                &times;
              </button>
            </div>

            <form onSubmit={submitSwapProposal} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Target Item You Want:
                </label>
                <div className="p-2 bg-slate-100 rounded border border-slate-200 font-semibold text-slate-800">
                  {item.title} (${Number(item.price).toFixed(2)})
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Choose from your active listings to offer (Optional):
                </label>
                {myItems.length > 0 ? (
                  <select
                    value={selectedOfferId}
                    onChange={(e) => setSelectedOfferId(e.target.value)}
                    className="w-full border border-slate-300 rounded p-2 text-slate-800"
                  >
                    <option value="">-- No item selected / describe below instead --</option>
                    {myItems.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.title} (${m.price})
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-slate-500 italic">
                    You have no active listings. You can still type your proposal description below.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Swap Details & Note for Seller *
                </label>
                <textarea
                  required
                  rows={4}
                  value={swapNote}
                  onChange={(e) => setSwapNote(e.target.value)}
                  placeholder="Describe the supplies you are offering in trade and convenient meetup place..."
                  className="w-full border border-slate-300 rounded p-2 text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowSwapModal(false)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingSwap}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded font-medium"
                >
                  {submittingSwap ? 'Sending...' : 'Send Swap Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
