import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Palette, ShoppingCart, Tag, ArrowLeftRight, Gift } from 'lucide-react';

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

const SLIDESHOW_IMAGES = [
  {
    id: 1,
    title: 'Painting Supplies',
    url: '/Painting Supplies.jpg'
  },
  {
    id: 2,
    title: 'Drawing Materials',
    url: '/Drawing Materials.png'
  },
  {
    id: 3,
    title: 'Acrylic Painting Studio',
    url: '/Acrylic Painting Studio.png'
  },
  {
    id: 4,
    title: 'Craft & Paper Workspace',
    url: '/Craft & Paper Workspace.png'
  }
];

export default function Marketplace() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [condition, setCondition] = useState('All');
  const [sort, setSort] = useState('newest');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Preload images into cache to prevent white flashes
  useEffect(() => {
    SLIDESHOW_IMAGES.forEach((slide) => {
      const img = new Image();
      img.src = slide.url;
    });
  }, []);

  // Automatic Background Slideshow with 5-second interval and reduced motion check
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDESHOW_IMAGES.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

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
      {/* =========================================================================
          HERO BANNER WITH AUTOMATIC BACKGROUND IMAGE SLIDESHOW
      ========================================================================== */}
      <div className="w-full relative rounded-2xl overflow-hidden shadow-xl border border-slate-700/60 h-[400px] sm:h-[420px] lg:h-[450px] flex items-center justify-center bg-slate-900">

        {/* Layer 1: Background Images with 1-second crossfade */}
        {SLIDESHOW_IMAGES.map((slide, index) => (
          <img
            key={slide.id}
            src={slide.url}
            alt={slide.title}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out select-none pointer-events-none ${index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
          />
        ))}

        {/* Layer 2: Dark Charcoal/Navy Gradient Overlay for crisp text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/70 to-slate-950/85 pointer-events-none" />

        {/* Layer 3: Completely Stationary Centered Foreground Content */}
        <div className="relative z-10 w-full max-w-4xl px-4 sm:px-8 py-6 flex flex-col items-center justify-center text-center">

          {/* Art Palette Icon with small decorative accents */}
          <div className="relative mb-3 flex items-center justify-center">
            <span className="text-emerald-400 text-lg font-bold select-none absolute -left-5 -top-1">
              &#10022;
            </span>
            <div className="w-12 h-12 rounded-full border border-white/30 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center shadow-md">
              <Palette className="w-7 h-7 text-white stroke-[1.75]" />
            </div>
            <span className="text-emerald-400 text-sm font-bold select-none absolute -right-4 -bottom-1">
              &#10022;
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Art Supply Exchange &amp;{' '}
            <span className="relative inline-block text-emerald-400">
              Marketplace
              {/* Subtle decorative green underline curve */}
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-emerald-400 pointer-events-none overflow-visible"
                viewBox="0 0 100 12"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,8 Q50,0 100,8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          {/* Description */}
          <p className="mt-4 sm:mt-5 text-slate-200 text-xs sm:text-base lg:text-lg max-w-2xl font-normal leading-relaxed drop-shadow-sm">
            Buy, sell, swap, or donate second-hand and unused art materials locally.
          </p>

          {/* Marketplace Mode Pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5">
            <div className="flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-slate-900/65 backdrop-blur-md border border-slate-500/50 text-white text-xs sm:text-sm font-medium shadow-sm">
              <ShoppingCart className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-emerald-400" />
              <span>Buy</span>
            </div>

            <div className="flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-slate-900/65 backdrop-blur-md border border-slate-500/50 text-white text-xs sm:text-sm font-medium shadow-sm">
              <Tag className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-emerald-400" />
              <span>Sell</span>
            </div>

            <div className="flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-slate-900/65 backdrop-blur-md border border-slate-500/50 text-white text-xs sm:text-sm font-medium shadow-sm">
              <ArrowLeftRight className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-emerald-400" />
              <span>Swap</span>
            </div>

            <div className="flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-slate-900/65 backdrop-blur-md border border-slate-500/50 text-white text-xs sm:text-sm font-medium shadow-sm">
              <Gift className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-emerald-400" />
              <span>Donate</span>
            </div>
          </div>

        </div>
      </div>

      {/* =========================================================================
          SEARCH AND FILTERS BAR
      ========================================================================== */}
      <div className="w-full bg-white p-4 rounded border border-slate-300 shadow-sm space-y-3">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by material title, brand, or details..."
            className="flex-1 border border-slate-300 rounded px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
          />
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded text-sm font-medium transition-colors"
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
              className="border border-slate-300 rounded px-2 py-1 bg-white text-slate-700 focus:outline-none focus:border-emerald-600"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-600">Condition:</span>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="border border-slate-300 rounded px-2 py-1 bg-white text-slate-700 focus:outline-none focus:border-emerald-600"
            >
              {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-600">Sort:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border border-slate-300 rounded px-2 py-1 bg-white text-slate-700 focus:outline-none focus:border-emerald-600"
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

      {/* =========================================================================
          GRID OF ITEMS
      ========================================================================== */}
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
