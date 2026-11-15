import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Palette,
  Home,
  Store,
  Info,
  ShoppingCart,
  Tag,
  ArrowLeftRight,
  Heart,
  Mail,
  BookOpen,
  AlertTriangle,
  ShieldCheck,
  FileText,
  Shield,
  RotateCcw,
  Leaf,
  Users
} from 'lucide-react';

export default function Footer() {
  const location = useLocation();
  const [modalContent, setModalContent] = useState(null);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isChatPage = location.pathname === '/chat';

  // Informational modals for pending non-routed links
  const openInfoModal = (title, text) => {
    setModalContent({ title, text });
  };

  // Compact footer for authentication and active chat pages to preserve layout & avoid double scrollbars
  if (isAuthPage || isChatPage) {
    return (
      <footer className="w-full bg-[#102039] text-[#AEB9C8] text-xs py-3 px-6 text-center border-t border-[#3A4556]/60">
        <div className="w-full px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} Art Supply Exchange. All rights reserved.</span>
          <span className="text-[#FFC247] font-medium flex items-center gap-1">
            <Leaf className="w-3.5 h-3.5 text-emerald-400 inline" /> Share Creativity. Support Sustainability.
          </span>
        </div>
      </footer>
    );
  }

  return (
    <>
      <footer className="w-full relative bg-[#102039] text-[#F5F5F5] border-t border-[#3A4556]/60 pt-14 pb-8 overflow-hidden select-none">
        
        {/* =========================================================================
            DECORATIVE ART ELEMENTS (Matching Target Reference Image 2)
        ========================================================================== */}
        {/* Top-Left Corner: Colorful diagonal paintbrush strokes (Pink, Purple, Cyan, Teal) */}
        <div className="absolute -top-6 -left-6 w-56 h-36 pointer-events-none opacity-80 z-0">
          <svg viewBox="0 0 200 120" className="w-full h-full fill-none overflow-visible">
            <path d="M-10,10 Q60,30 110,-5" stroke="#EC4899" strokeWidth="22" strokeLinecap="round" opacity="0.9" />
            <path d="M-5,35 Q70,55 130,10" stroke="#8B5CF6" strokeWidth="20" strokeLinecap="round" opacity="0.85" />
            <path d="M0,60 Q80,75 150,25" stroke="#06B6D4" strokeWidth="18" strokeLinecap="round" opacity="0.9" />
            <path d="M5,85 Q90,95 160,45" stroke="#10B981" strokeWidth="16" strokeLinecap="round" opacity="0.85" />
          </svg>
        </div>

        {/* Bottom-Right Corner: Colorful diagonal paint strokes (Orange, Pink, Purple, Blue) */}
        <div className="absolute -bottom-6 -right-6 w-64 h-36 pointer-events-none opacity-85 z-0">
          <svg viewBox="0 0 220 120" className="w-full h-full fill-none overflow-visible">
            <path d="M70,125 Q130,75 220,105" stroke="#F97316" strokeWidth="24" strokeLinecap="round" opacity="0.9" />
            <path d="M85,145 Q150,90 230,120" stroke="#EC4899" strokeWidth="22" strokeLinecap="round" opacity="0.85" />
            <path d="M100,165 Q170,105 240,135" stroke="#8B5CF6" strokeWidth="20" strokeLinecap="round" opacity="0.85" />
            <path d="M120,185 Q190,125 250,150" stroke="#3B82F6" strokeWidth="18" strokeLinecap="round" opacity="0.9" />
          </svg>
        </div>

        {/* Bottom-Left Corner: Subtle white line-art illustration of brushes in jar & sketchbook */}
        <div className="absolute bottom-2 left-6 pointer-events-none opacity-25 hidden sm:block z-0">
          <svg width="140" height="90" viewBox="0 0 140 90" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
            {/* Brushes jar */}
            <rect x="15" y="45" width="28" height="40" rx="3" stroke="white" />
            <line x1="22" y1="45" x2="10" y2="10" stroke="white" />
            <polygon points="10,10 7,6 12,5" fill="white" />
            <line x1="29" y1="45" x2="29" y2="5" stroke="white" />
            <polygon points="29,5 26,2 32,2" fill="white" />
            <line x1="36" y1="45" x2="48" y2="15" stroke="white" />
            <polygon points="48,15 52,12 49,18" fill="white" />
            {/* Paint tube */}
            <rect x="52" y="55" width="18" height="30" rx="2" stroke="white" />
            <rect x="56" y="50" width="10" height="5" stroke="white" />
            {/* Sketchbook spine */}
            <path d="M78,65 Q95,60 115,65 L115,88 Q95,83 78,88 Z" stroke="white" />
            <circle cx="82" cy="68" r="1.5" fill="white" />
            <circle cx="82" cy="74" r="1.5" fill="white" />
            <circle cx="82" cy="80" r="1.5" fill="white" />
            <circle cx="82" cy="86" r="1.5" fill="white" />
          </svg>
        </div>

        {/* =========================================================================
            MAIN 5-COLUMN FULL-WIDTH CONTENT GRID (Occupies ~95% screen width)
        ========================================================================== */}
        <div className="w-full px-6 sm:px-10 lg:px-12 relative z-10 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* -------------------------------------------------------------
                COLUMN 1: BRAND INFORMATION & SUSTAINABILITY (Spans ~32%)
            -------------------------------------------------------------- */}
            <div className="lg:col-span-4 space-y-4 pr-0 lg:pr-6 border-b lg:border-b-0 lg:border-r border-[#3A4556]/60 pb-6 lg:pb-0">
              
              {/* Brand Logo & Name */}
              <div className="flex items-center gap-3.5">
                {/* Logo: Palette with brushes */}
                <div className="w-14 h-14 rounded-2xl bg-amber-100/10 border border-amber-400/30 flex items-center justify-center p-2 shadow-inner">
                  <Palette className="w-9 h-9 text-amber-400 stroke-[1.75]" />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-white flex items-baseline gap-1.5">
                    <span>Art Supply</span>
                    <span className="text-[#FFC247]">Exchange</span>
                  </h2>
                  <div className="relative inline-block">
                    <p className="text-xs sm:text-sm italic font-medium text-white tracking-wide">
                      Create More. Waste Less.
                    </p>
                    {/* Pink Paintbrush Underline curve beneath tagline */}
                    <svg className="absolute -bottom-1 left-0 w-full h-2 text-pink-500 overflow-visible" viewBox="0 0 100 8" preserveAspectRatio="none">
                      <path d="M0,5 Q50,0 100,5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#D3D8E0] leading-relaxed pt-1">
                A creative community where art supplies find new purpose. Buy, sell, swap, or donate materials and help reduce waste.
              </p>

              {/* Three Sustainability Badges */}
              <div className="flex items-center gap-3 pt-2 text-xs font-semibold">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                    <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span>Reuse</span>
                </div>

                <div className="h-4 w-px bg-slate-700/80" />

                <div className="flex items-center gap-1.5 text-emerald-400">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                    <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span>Sustain</span>
                </div>

                <div className="h-4 w-px bg-slate-700/80" />

                <div className="flex items-center gap-1.5 text-cyan-400">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <span>Create Together</span>
                </div>
              </div>

            </div>

            {/* -------------------------------------------------------------
                COLUMN 2: QUICK LINKS (Spans ~17%)
            -------------------------------------------------------------- */}
            <div className="lg:col-span-2 space-y-3.5">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#FFC247] tracking-wide">
                  Quick Links
                </h3>
                {/* Golden Underline */}
                <div className="w-8 h-0.5 bg-[#FFC247] rounded-full" />
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#F5F5F5]">
                <li>
                  <Link to="/" className="flex items-center gap-2 hover:text-[#FFC247] transition-colors">
                    <Home className="w-4 h-4 text-white shrink-0" />
                    <span>Home</span>
                  </Link>
                </li>
                <li>
                  <Link to="/" className="flex items-center gap-2 hover:text-[#FFC247] transition-colors">
                    <Store className="w-4 h-4 text-white shrink-0" />
                    <span>Marketplace</span>
                  </Link>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => openInfoModal('About Us', 'Art Supply Exchange is a student and community-driven initiative connecting local artists, hobbyists, and educators to share, trade, and reuse fine arts materials.')}
                    className="flex items-center gap-2 hover:text-[#FFC247] transition-colors cursor-pointer text-left"
                  >
                    <Info className="w-4 h-4 text-white shrink-0" />
                    <span>About Us</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* -------------------------------------------------------------
                COLUMN 3: EXPLORE (Spans ~17%)
            -------------------------------------------------------------- */}
            <div className="lg:col-span-2 space-y-3.5">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#FFC247] tracking-wide">
                  Explore
                </h3>
                {/* Golden Underline */}
                <div className="w-8 h-0.5 bg-[#FFC247] rounded-full" />
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#F5F5F5]">
                <li>
                  <Link to="/" className="flex items-center gap-2 hover:text-[#FFC247] transition-colors">
                    <ShoppingCart className="w-4 h-4 text-white shrink-0" />
                    <span>Buy Supplies</span>
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard?action=new" className="flex items-center gap-2 hover:text-[#FFC247] transition-colors">
                    <Tag className="w-4 h-4 text-white shrink-0" />
                    <span>Sell Supplies</span>
                  </Link>
                </li>
                <li>
                  <Link to="/swaps" className="flex items-center gap-2 hover:text-[#FFC247] transition-colors">
                    <ArrowLeftRight className="w-4 h-4 text-white shrink-0" />
                    <span>Swap Supplies</span>
                  </Link>
                </li>
                <li>
                  <Link to="/" className="flex items-center gap-2 hover:text-[#FFC247] transition-colors">
                    <Heart className="w-4 h-4 text-white shrink-0" />
                    <span>Donate Supplies</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* -------------------------------------------------------------
                COLUMN 4: HELP & SUPPORT (Spans ~17%)
            -------------------------------------------------------------- */}
            <div className="lg:col-span-2 space-y-3.5">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#FFC247] tracking-wide">
                  Help &amp; Support
                </h3>
                {/* Golden Underline */}
                <div className="w-8 h-0.5 bg-[#FFC247] rounded-full" />
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#F5F5F5]">
                <li>
                  <button 
                    type="button"
                    onClick={() => openInfoModal('Contact Us', 'Need assistance? Reach out to our community volunteer team at support@artsupplyexchange.local or post an inquiry directly to sellers.')}
                    className="flex items-center gap-2 hover:text-[#FFC247] transition-colors cursor-pointer text-left"
                  >
                    <Mail className="w-4 h-4 text-white shrink-0" />
                    <span>Contact Us</span>
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => openInfoModal('Help Center', 'Browse our quick tips on exchanging materials, inspecting gently-used brushes, arranging local studio drop-offs, and negotiating swaps.')}
                    className="flex items-center gap-2 hover:text-[#FFC247] transition-colors cursor-pointer text-left"
                  >
                    <BookOpen className="w-4 h-4 text-white shrink-0" />
                    <span>Help Center</span>
                  </button>
                </li>
                <li>
                  <Link to="/chat" className="flex items-center gap-2 hover:text-[#FFC247] transition-colors">
                    <AlertTriangle className="w-4 h-4 text-white shrink-0" />
                    <span>Report an Issue</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* -------------------------------------------------------------
                COLUMN 5: LEGAL & SAFETY (Spans ~17%)
            -------------------------------------------------------------- */}
            <div className="lg:col-span-2 space-y-3.5">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#FFC247] tracking-wide">
                  Legal &amp; Safety
                </h3>
                {/* Golden Underline */}
                <div className="w-8 h-0.5 bg-[#FFC247] rounded-full" />
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#F5F5F5]">
                <li>
                  <button 
                    type="button"
                    onClick={() => openInfoModal('Privacy Policy', 'We value artist privacy. Your contact details are shared exclusively with confirmed exchange partners for safe local trade coordination.')}
                    className="flex items-center gap-2 hover:text-[#FFC247] transition-colors cursor-pointer text-left"
                  >
                    <ShieldCheck className="w-4 h-4 text-white shrink-0" />
                    <span>Privacy Policy</span>
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => openInfoModal('Terms of Service', 'All listings must be authentic fine art and craft materials. Community members agree to respectful communication and fair barter exchanges.')}
                    className="flex items-center gap-2 hover:text-[#FFC247] transition-colors cursor-pointer text-left"
                  >
                    <FileText className="w-4 h-4 text-white shrink-0" />
                    <span>Terms of Service</span>
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => openInfoModal('Safety Guidelines', 'Always meet in public campus locations or well-lit art centers for supply pickups. Verify paint tubes and canvas condition prior to completing swaps.')}
                    className="flex items-center gap-2 hover:text-[#FFC247] transition-colors cursor-pointer text-left"
                  >
                    <Shield className="w-4 h-4 text-white shrink-0" />
                    <span>Safety Guidelines</span>
                  </button>
                </li>
              </ul>
            </div>

          </div>

          {/* =========================================================================
              FOOTER BOTTOM SECTION (Matching Image 2 Full-Width Divided Bar)
          ========================================================================== */}
          <div className="w-full border-t border-[#3A4556] pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs sm:text-sm">
            <span className="text-[#D3D8E0]">
              &copy; {new Date().getFullYear()} Art Supply Exchange. All rights reserved.
            </span>

            <span className="hidden sm:inline-block text-slate-500 font-bold">|</span>

            <span className="text-[#FFC247] italic font-medium flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-emerald-400 not-italic shrink-0" />
              <span>Share Creativity. Support Sustainability.</span>
            </span>
          </div>

        </div>
      </footer>

      {/* Reusable Clean Info Modal for pending non-routed links */}
      {modalContent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#102039] border border-[#3A4556] text-[#D3D8E0] rounded-xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#3A4556] pb-3">
              <h4 className="text-lg font-bold text-[#FFC247]">{modalContent.title}</h4>
              <button 
                type="button" 
                onClick={() => setModalContent(null)}
                className="text-slate-400 hover:text-white text-xl font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>
            <p className="text-sm text-[#D3D8E0] leading-relaxed">
              {modalContent.text}
            </p>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setModalContent(null)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
