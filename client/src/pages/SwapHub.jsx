import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Repeat, ArrowRightLeft, Check, X, CheckCheck, Clock, MessageSquare, AlertCircle } from 'lucide-react';

export default function SwapHub() {
  const { user, token } = useAuth();
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'incoming', 'outgoing'

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

  const updateSwapStatus = async (swapId, newStatus) => {
    try {
      const res = await fetch(`/api/swaps/${swapId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchSwaps();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredSwaps = swaps.filter(s => {
    if (filter === 'incoming') return s.isIncoming;
    if (filter === 'outgoing') return !s.isIncoming;
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1"><Clock className="w-3 h-3" /> Pending Review</span>;
      case 'accepted':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 flex items-center gap-1"><Check className="w-3 h-3" /> Offer Accepted</span>;
      case 'completed':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1"><CheckCheck className="w-3 h-3" /> Swap Completed</span>;
      case 'rejected':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 flex items-center gap-1"><X className="w-3 h-3" /> Declined</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-stone-100 text-stone-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
            <Repeat className="w-4 h-4" /> Circular Economy Exchange
          </div>
          <h1 className="text-2xl font-black text-stone-900 mt-1">Material Swap & Trade Hub</h1>
          <p className="text-xs text-stone-500 mt-0.5">Manage trade proposals, accept offers, and arrange supply exchanges.</p>
        </div>

        {/* Filter controls */}
        <div className="flex bg-stone-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${filter === 'all' ? 'bg-white shadow text-stone-900' : 'text-stone-500'}`}
          >
            All Swaps ({swaps.length})
          </button>
          <button
            onClick={() => setFilter('incoming')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${filter === 'incoming' ? 'bg-white shadow text-stone-900' : 'text-stone-500'}`}
          >
            Incoming ({swaps.filter(s => s.isIncoming).length})
          </button>
          <button
            onClick={() => setFilter('outgoing')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${filter === 'outgoing' ? 'bg-white shadow text-stone-900' : 'text-stone-500'}`}
          >
            Outgoing ({swaps.filter(s => !s.isIncoming).length})
          </button>
        </div>
      </div>

      {/* Swaps List */}
      {loading ? (
        <div className="p-8 text-center text-sm text-stone-500 animate-pulse">Loading swap exchanges...</div>
      ) : filteredSwaps.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
          <ArrowRightLeft className="w-12 h-12 text-stone-400 mx-auto" />
          <h3 className="text-lg font-bold text-stone-800">No swap proposals found in this tab</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Browse items in the marketplace marked with the "Swap" badge to propose your first art material trade!
          </p>
          <Link to="/" className="inline-block px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-sm">
            Explore Marketplace Swaps
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSwaps.map(swap => (
            <div
              key={swap.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 md:p-6 shadow-sm space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${swap.isIncoming ? 'bg-indigo-100 text-indigo-800' : 'bg-amber-100 text-amber-800'}`}>
                    {swap.isIncoming ? 'Incoming Request' : 'Your Outgoing Proposal'}
                  </span>
                  <span className="text-stone-400">•</span>
                  <span className="text-stone-500">
                    With {swap.isIncoming ? swap.requester?.name : swap.seller?.name}
                  </span>
                </div>
                {getStatusBadge(swap.status)}
              </div>

              {/* Items Comparison Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                {/* Target Item (What is wanted) */}
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center gap-3">
                  <img
                    src={swap.targetItem?.images[0] || 'https://images.unsplash.com/photo-1513364776144-60967b0f800f'}
                    alt=""
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-stone-400 uppercase">Target Item Requested</span>
                    <h4 className="font-bold text-stone-900 text-xs line-clamp-1">{swap.targetItem?.title}</h4>
                    <span className="text-xs font-semibold text-stone-700">${swap.targetItem?.price.toFixed(2)}</span>
                  </div>
                </div>

                {/* Offered Item / Proposal */}
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80 flex items-center gap-3">
                  {swap.offeredItem ? (
                    <>
                      <img
                        src={swap.offeredItem?.images[0]}
                        alt=""
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                      <div>
                        <span className="text-[10px] font-bold text-emerald-700 uppercase">Offered in Exchange</span>
                        <h4 className="font-bold text-stone-900 text-xs line-clamp-1">{swap.offeredItem?.title}</h4>
                        <span className="text-xs font-semibold text-emerald-800">${swap.offeredItem?.price.toFixed(2)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="w-full">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase">Direct Trade Proposal</span>
                      <p className="text-xs text-stone-700 italic mt-0.5">"{swap.offeredDescription}"</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional notes if both offeredItem & note exist */}
              {swap.offeredItem && swap.offeredDescription && (
                <div className="p-2.5 bg-stone-50 rounded-lg text-xs text-stone-600">
                  <span className="font-semibold text-stone-700">Proposal Note:</span> {swap.offeredDescription}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <Link
                  to="/chat"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  <MessageSquare className="w-4 h-4" /> Open Discussion / Negotiate
                </Link>

                <div className="flex items-center gap-2">
                  {swap.isIncoming && swap.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateSwapStatus(swap.id, 'rejected')}
                        className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => updateSwapStatus(swap.id, 'accepted')}
                        className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors"
                      >
                        Accept Swap Offer
                      </button>
                    </>
                  )}

                  {swap.status === 'accepted' && (
                    <button
                      onClick={() => updateSwapStatus(swap.id, 'completed')}
                      className="px-4 py-1.5 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-sm flex items-center gap-1"
                    >
                      <CheckCheck className="w-4 h-4 text-emerald-400" />
                      Mark Material Exchange as Completed
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
