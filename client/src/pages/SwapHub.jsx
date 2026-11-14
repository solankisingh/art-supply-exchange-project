import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function SwapHub() {
  const { user, token } = useAuth();
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSwaps();
  }, []);

  const fetchSwaps = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/swaps', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSwaps(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/swaps/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchSwaps();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="w-full bg-white border border-slate-300 rounded shadow-sm p-4">
        <h2 className="text-xl font-bold text-slate-800">Material Swap Requests</h2>
        <p className="text-xs text-slate-500">
          Review incoming swap requests for your items and see outgoing trade proposals you sent.
        </p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-500 text-xs bg-white rounded border border-slate-200">
          Loading swaps...
        </div>
      ) : swaps.length === 0 ? (
        <div className="p-10 text-center text-slate-500 text-xs bg-white rounded border border-slate-300 space-y-2">
          <p className="font-semibold text-slate-700">No Swap Requests Yet</p>
          <p>Find items with "Open to Swap" in the marketplace and click "Propose Swap".</p>
          <Link to="/" className="inline-block bg-slate-800 text-white px-3 py-1.5 rounded mt-2">
            Browse Marketplace
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {swaps.map(swap => (
            <div key={swap.id} className="w-full bg-white border border-slate-300 rounded shadow-sm p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2 text-xs">
                <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                  swap.isIncoming ? 'bg-indigo-100 text-indigo-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {swap.isIncoming ? 'Incoming Request for You' : 'Outgoing Proposal Sent by You'}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold uppercase text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {swap.status}
                  </span>
                </div>
              </div>

              {/* Grid with requested and offered item */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                  <span className="font-bold text-slate-500 block mb-1">Target Item:</span>
                  <p className="font-bold text-slate-900">{swap.targetItem?.title || 'Unknown Item'}</p>
                  <p className="text-slate-600">${Number(swap.targetItem?.price || 0).toFixed(2)}</p>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded">
                  <span className="font-bold text-emerald-800 block mb-1">Offered in Exchange:</span>
                  {swap.offeredItem ? (
                    <>
                      <p className="font-bold text-slate-900">{swap.offeredItem.title}</p>
                      <p className="text-slate-600">${Number(swap.offeredItem.price).toFixed(2)}</p>
                    </>
                  ) : (
                    <p className="text-slate-800 italic">"{swap.offeredDescription}"</p>
                  )}
                </div>
              </div>

              {swap.offeredItem && swap.offeredDescription && (
                <div className="text-xs bg-slate-50 p-2 rounded text-slate-700">
                  <strong>Note:</strong> {swap.offeredDescription}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 text-xs">
                <Link to="/chat" className="text-blue-600 hover:underline font-medium">
                  Open Chat to Discuss
                </Link>

                <div className="flex gap-2">
                  {swap.isIncoming && swap.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateStatus(swap.id, 'rejected')}
                        className="bg-rose-100 hover:bg-rose-200 text-rose-700 px-3 py-1 rounded font-medium"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => updateStatus(swap.id, 'accepted')}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded font-medium"
                      >
                        Accept Swap
                      </button>
                    </>
                  )}

                  {swap.status === 'accepted' && (
                    <button
                      onClick={() => updateStatus(swap.id, 'completed')}
                      className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1 rounded font-medium"
                    >
                      Mark Swap as Completed
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
