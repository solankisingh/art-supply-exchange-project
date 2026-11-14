import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  'All',
  'Paints & Colors',
  'Brushes & Palettes',
  'Canvases & Boards',
  'Sketchbooks & Paper',
  'Drawing & Pens',
  'Easels & Stands',
  'Clay & Modeling'
];

const CONDITIONS = ['All', 'Brand New', 'Like New', 'Used - Good', 'Used - Fair'];

export default function Marketplace() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [condition, setCondition] = useState('All');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    fetchItems();
  }, [category, condition, sort]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category !== 'All') params.append('category', category);
      if (condition !== 'All') params.append('condition', condition);
      if (sort) params.append('sort', sort);

      const res = await fetch(`/api/items?${params.toString()}`);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems();
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Banner */}
      <div className="w-full bg-slate-800 text-white p-5 rounded shadow">
        <h1 className="text-2xl font-bold">Art Supply Exchange & Marketplace</h1>
        <p className="text-slate-300 text-sm mt-1">
          Buy, sell, or swap second-hand and unused artist materials locally.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="w-full bg-white p-4 rounded border border-slate-300 shadow-sm space-y-3">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by material title, brand, or details..."
            className="flex-1 border border-slate-300 rounded px-3 py-2 text-sm text-slate-800"
          />
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded text-sm font-medium"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-4 text-xs pt-2 border-t border-slate-200">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-600">Category:</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-slate-300 rounded px-2 py-1 bg-white text-slate-700"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-600">Condition:</span>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="border border-slate-300 rounded px-2 py-1 bg-white text-slate-700"
            >
              {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-600">Sort:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border border-slate-300 rounded px-2 py-1 bg-white text-slate-700"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          <span className="text-slate-500 ml-auto font-medium">
            Found {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
        </div>
      </div>

      {/* Grid of Items */}
      {loading ? (
        <div className="w-full text-center py-12 text-slate-500 text-sm bg-white rounded border border-slate-200">
          Loading marketplace items...
        </div>
      ) : items.length === 0 ? (
        <div className="w-full text-center py-16 bg-white rounded border border-slate-300 p-6 space-y-2">
          <h3 className="text-base font-bold text-slate-700">No Art Supplies Listed Yet</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Be the first to list art materials! Login or register to post unused paints, brushes, canvases, or tools.
          </p>
          <div className="pt-3">
            <Link
              to="/dashboard?action=new"
              className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white text-sm px-4 py-2 rounded font-medium"
            >
              Post First Supply
            </Link>
          </div>
        </div>
      ) : (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {items.map(item => (
            <div
              key={item.id}
              className="bg-white border border-slate-300 rounded shadow-sm hover:shadow transition-shadow flex flex-col justify-between overflow-hidden"
            >
              <div>
                {/* Image or Placeholder Box */}
                <div className="w-full h-44 bg-slate-200 relative flex items-center justify-center overflow-hidden">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="text-xs text-slate-500 font-medium">[ No Image Provided ]</span>
                  )}
                  {item.isSwapAvailable && (
                    <span className="absolute top-2 right-2 bg-emerald-700 text-white text-[11px] px-2 py-0.5 rounded font-bold">
                      Open to Swap
                    </span>
                  )}
                </div>

                <div className="p-3.5 space-y-1.5">
                  <div className="text-[11px] text-emerald-700 font-bold uppercase">{item.category}</div>
                  <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{item.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2">{item.description}</p>
                </div>
              </div>

              <div className="p-3.5 pt-0 border-t border-slate-100 mt-2 space-y-2">
                <div className="flex items-center justify-between text-xs pt-2">
                  <span className="text-base font-bold text-slate-900">
                    ${Number(item.price).toFixed(2)}
                  </span>
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                    {item.condition}
                  </span>
                </div>

                <div className="text-xs text-slate-500 flex justify-between">
                  <span>Location: {item.location}</span>
                  <span>Seller: {item.seller?.name || 'Artist'}</span>
                </div>

                <Link
                  to={`/item/${item.id}`}
                  className="block w-full text-center bg-slate-800 hover:bg-slate-700 text-white text-xs py-2 rounded font-medium mt-1"
                >
                  View Details & Contact
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
