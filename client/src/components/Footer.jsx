import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();
  const [modalContent, setModalContent] = useState(null);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isChatPage = location.pathname === '/chat';

  // Informational modals for pending non-routed anchors (About, Privacy, Terms, Help, Safety, Contact)
  const openInfoModal = (title, text) => {
    setModalContent({ title, text });
  };

  // Compact footer for authentication and active chat pages to preserve layout & avoid double scrollbars
  if (isAuthPage || isChatPage) {
    return (
      <footer className="w-full bg-[#182130] text-[#AEB9C8] text-xs py-3 px-6 text-center border-t border-[#3A4556]/60">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} Art Supply Exchange. All rights reserved.</span>
          <span className="text-[#F4BF72] font-medium">Share Creativity. Support Sustainability.</span>
        </div>
      </footer>
    );
  }

  return (
    <>
      <footer className="w-full bg-[#182130] text-[#D3D8E0] border-t border-[#3A4556]/60 pt-12 pb-8 transition-colors duration-200">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
          
          {/* Top Description Banner */}
          <div className="w-full text-center sm:text-left">
            <p className="text-sm sm:text-base text-[#D3D8E0] leading-relaxed max-w-4xl">
              A creative community where art supplies find new purpose. Buy, sell, swap, or donate materials and help reduce waste.
            </p>
          </div>

          {/* 4 Navigation Columns (Matching the Reference Image) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-2">
            
            {/* Column 1: Quick Links */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-[#F4BF72] tracking-wide">
                Quick Links
              </h3>
              <ul className="space-y-2.5 text-sm text-[#D3D8E0]">
                <li>
                  <Link to="/" className="hover:text-emerald-400 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-emerald-400 transition-colors">
                    Marketplace
                  </Link>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => openInfoModal('About Us', 'Art Supply Exchange is a student and community-driven initiative connecting local artists, hobbyists, and educators to share, trade, and reuse fine arts materials.')}
                    className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                  >
                    About Us
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 2: Explore */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-[#F4BF72] tracking-wide">
                Explore
              </h3>
              <ul className="space-y-2.5 text-sm text-[#D3D8E0]">
                <li>
                  <Link to="/" className="hover:text-emerald-400 transition-colors">
                    Buy Supplies
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard?action=new" className="hover:text-emerald-400 transition-colors">
                    Sell Supplies
                  </Link>
                </li>
                <li>
                  <Link to="/swaps" className="hover:text-emerald-400 transition-colors">
                    Swap Supplies
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-emerald-400 transition-colors">
                    Donate Supplies
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Help & Support */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-[#F4BF72] tracking-wide">
                Help &amp; Support
              </h3>
              <ul className="space-y-2.5 text-sm text-[#D3D8E0]">
                <li>
                  <button 
                    type="button"
                    onClick={() => openInfoModal('Contact Us', 'Need assistance? Reach out to our community volunteer team at support@artsupplyexchange.local or post a message in your dashboard.')}
                    className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                  >
                    Contact Us
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => openInfoModal('Help Center', 'Browse our quick tips on exchanging materials, inspecting gently-used brushes, arranging local studio drop-offs, and negotiating swaps.')}
                    className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                  >
                    Help Center
                  </button>
                </li>
                <li>
                  <Link to="/chat" className="hover:text-emerald-400 transition-colors">
                    Report an Issue
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Legal & Safety */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-[#F4BF72] tracking-wide">
                Legal &amp; Safety
              </h3>
              <ul className="space-y-2.5 text-sm text-[#D3D8E0]">
                <li>
                  <button 
                    type="button"
                    onClick={() => openInfoModal('Privacy Policy', 'We value artist privacy. Your contact details are shared exclusively with confirmed exchange partners for safe local trade coordination.')}
                    className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => openInfoModal('Terms of Service', 'All listings must be authentic fine art and craft materials. Community members agree to respectful communication and fair barter exchanges.')}
                    className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    onClick={() => openInfoModal('Safety Guidelines', 'Always meet in public campus locations or well-lit art centers for supply pickups. Verify paint tubes and canvas condition prior to completing swaps.')}
                    className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                  >
                    Safety Guidelines
                  </button>
                </li>
              </ul>
            </div>

          </div>

          {/* Subtle Horizontal Divider */}
          <div className="w-full border-t border-[#3A4556] pt-6" />

          {/* Centered Copyright & Sub-tagline */}
          <div className="text-center space-y-2 pb-2">
            <p className="text-xs sm:text-sm text-[#D3D8E0]">
              &copy; {new Date().getFullYear()} Art Supply Exchange. All rights reserved.
            </p>
            <p className="text-xs sm:text-sm font-medium text-[#F4BF72]">
              Share Creativity. Support Sustainability.
            </p>
          </div>

        </div>
      </footer>

      {/* Reusable Clean Info Modal for pending non-routed links */}
      {modalContent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#182130] border border-[#3A4556] text-[#D3D8E0] rounded-xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#3A4556] pb-3">
              <h4 className="text-lg font-bold text-[#F4BF72]">{modalContent.title}</h4>
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
