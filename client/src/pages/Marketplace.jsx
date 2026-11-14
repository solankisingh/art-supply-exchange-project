import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Repeat, Tag, MapPin, Sparkles, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Paints & Mediums',
  'Brushes & Tools',
  'Canvases & Surfaces',
  'Drawing & Illustration',
  'Easels & Furniture',
  'Ceramics & Sculpting'
];

const CONDITIONS = ['All', 'Brand New', 'Like New', 'Gently Used', 'Well Used'];

export default function Marketplace() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [condition, setCondition] = useState('All');
  const [sort, setSort] = useState('newest');
  const [onlySwappable, setOnlySwappable] = useState(false);

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
      console.error('Failed to load items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchItems();
  };

  const displayedItems = onlySwappable
    ? items.filter(it => it.isSwapAvailable)
    : items;

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-rose-600 to-indigo-700 text-white p-8 md:p-12 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Sustainable & Circular Art Ecosystem
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Exchange, Buy & Sell Quality Second-Hand Art Materials
          </h1>
          <p className="text-stone-100 text-sm md:text-base leading-relaxed">
            Support fellow artists, reduce material waste, and discover professional grade paints, brushes, and surfaces at student-friendly prices.
          </p>
        </div>

        {/* Decorative backdrop shapes */}
        <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search acrylic paints, Princeton brushes, stretched canvas, easels..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-xl shadow-sm transition-all"
          >
            Search
          </button>
        </form>

        {/* Filter Badges & Sort Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-stone-100 text-sm">
          {/* Categories Horizontal Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  category === cat
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Additional Filter Selects */}
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Condition Filter */}
            <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-xl text-xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500" />
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="bg-transparent text-stone-700 focus:outline-none cursor-pointer"
              >
                {CONDITIONS.map((cond) => (
                  <option key={cond} value={cond}>
                    Condition: {cond}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-xl text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-transparent text-stone-700 focus:outline-none cursor-pointer"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>

            {/* Only Swappable Checkbox */}
            <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlySwappable}
                onChange={(e) => setOnlySwappable(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500"
              />
              <span className="flex items-center gap-1 text-emerald-700">
                <Repeat className="w-3.5 h-3.5" /> Swap Eligible Only
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3 animate-pulse">
              <div className="h-48 bg-stone-200 rounded-xl" />
              <div className="h-4 bg-stone-200 rounded w-3/4" />
              <div className="h-3 bg-stone-200 rounded w-1/2" />
              <div className="h-6 bg-stone-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : displayedItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-stone-300 p-8 space-y-4">
          <div className="w-16 h-16 mx-auto bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
            <Tag className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-stone-800">No matching art materials found</h3>
          <p className="text-sm text-stone-500 max-w-md mx-auto">
            Try adjusting your search keywords, clearing selected filters, or check back later as community members list new supplies!
          </p>
          <button
            onClick={() => {
              setSearch('');
              setCategory('All');
              setCondition('All');
              setOnlySwappable(false);
            }}
            className="px-4 py-2 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedItems.map((item) => (
            <Link
              key={item.id}
              to={`/item/${item.id}`}
              className="group bg-white rounded-2xl border border-stone-200 hover:border-amber-300 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col"
            >
              {/* Product Image & Badges */}
              <div className="relative h-48 w-full bg-stone-100 overflow-hidden">
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Condition Tag */}
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/90 backdrop-blur-sm text-stone-800 shadow-sm">
                  {item.condition}
                </span>

                {/* Swap Available Tag */}
                {item.isSwapAvailable && (
                  <span className="absolute top-3 right-3 px-2 py-1 rounded-full text-[11px] font-semibold bg-emerald-600 text-white shadow-sm flex items-center gap-1">
                    <Repeat className="w-3 h-3" /> Swap
                  </span>
                )}
              </div>

              {/* Item Info */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-medium text-amber-600 uppercase tracking-wider block">
                    {item.category}
                  </span>
                  <h3 className="font-semibold text-stone-900 group-hover:text-amber-600 transition-colors line-clamp-2 text-sm leading-snug">
                    {item.title}
                  </h3>
                </div>

                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-stone-900">
                      ${item.price.toFixed(2)}
                    </div>
                    <div className="flex items-center text-xs text-stone-500 gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span className="truncate max-w-[110px]">{item.location}</span>
                    </div>
                  </div>

                  {item.seller && (
                    <div className="flex items-center gap-2 pt-1 text-xs text-stone-600">
                      <img
                        src={item.seller.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${item.seller.name}`}
                        alt={item.seller.name}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="truncate">{item.seller.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
