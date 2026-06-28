import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next';
import { logout } from '../redux/actions/userActions';
import { ShoppingBag, Search } from "lucide-react";

import {
  Package, LogOut, Heart, ShoppingCart,
  Settings, Phone, Flame, ShieldCheck, ChevronDown, User
} from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  // --- USER LOGIC (UNCHANGED) ---
  const userLogin = useSelector((state) => state.userLogin) || {};
  const { userInfo: reduxUserInfo } = userLogin;

  const userRaw = localStorage.getItem("userInfo");
  let localUserInfo = null;
  try { localUserInfo = userRaw ? JSON.parse(userRaw) : null; } catch (e) {}

  const userInfo = reduxUserInfo || localUserInfo;
  const userName = userInfo?.name || userInfo?.user?.name || "";
  const userEmail = userInfo?.email || userInfo?.user?.email || "";
  const isAdmin = (userInfo?.role === 'admin' || userInfo?.user?.role === 'admin' || userInfo?.isAdmin);
  const firstName = userName ? userName.split(' ')[0] : '';

  const avatarSrc = (userInfo?.image && userInfo.image !== "")
    ? userInfo.image
    : `https://ui-avatars.com/api/?name=${userName || 'Guest'}&background=000000&color=fff`;

  // --- CART & WISHLIST LOGIC (UNCHANGED) ---
  const cart = useSelector((state) => state.cart) || {};
  
  const cartItems = cart.cartItems && cart.cartItems.length > 0 
    ? cart.cartItems 
    : (localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []);

  const { wishlistItems } = useSelector((state) => state.wishlist) || { wishlistItems: [] };
  
  const cartCount = cartItems && Array.isArray(cartItems) 
    ? cartItems.reduce((acc, item) => acc + Number(item.qty || item.quantity || 0), 0) 
    : 0;

  // --- EFFECTS ---
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logoutHandler = () => {
    setIsDropdownOpen(false);
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="fixed top-0 w-full z-[100]">

      {/* 🔥 SMOOTH MARQUEE */}
      <div className="bg-neutral-950 text-white/70 h-9 flex items-center overflow-hidden relative border-b border-white/5">
        <div className="flex w-max animate-marquee-smooth">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-20 px-10 text-[9px] font-medium uppercase tracking-[0.3em] whitespace-nowrap">
              <span className="flex items-center gap-1.5 opacity-70">
                <Phone size={11}/> +92 300 1234567
              </span>
              <span className="opacity-90 tracking-[0.35em]">
                ✨ FLASH SALE: 20% OFF — MYSTORE20
              </span>
              <span className="flex items-center gap-1.5 text-amber-500 font-semibold">
                <Flame size={11} className="fill-amber-500/10"/> LIMITED DROP
              </span>
              <span className="opacity-60">
                FREE SHIPPING OVER $50
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 💎 MAIN NAV */}
      <nav
        className={`transition-all duration-500 ease-out py-3.5 ${
          scrolled
            ? "bg-white/40 backdrop-blur-xl border-b border-white/40 shadow-lg shadow-black/[0.03]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2.5 group bg-black/20 backdrop-blur-sm px-3 py-1 rounded-lg">
  {/* Premium 3D Box Minimalized */}
  <div className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-neutral-900 text-white font-serif text-base shadow-sm transition-all duration-500 group-hover:scale-105 group-hover:bg-black overflow-hidden">
    V
    <span className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rotate-12"></span>
    <span className="absolute inset-0 rounded-xl ring-1 ring-white/10 group-hover:ring-white/20 transition"></span>
  </div>

  {/* Brand Text with White Glow/Shadow */}
  <span className="text-base font-serif tracking-tight text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all duration-300">
    Veloura<span className="ml-0.5 text-amber-500 inline-block text-[10px] transform align-super">✦</span>
  </span>
</Link>

          {/* ACTIONS */}
          <div className="flex items-center gap-2.5">

            {/* ❤️ Wishlist Icon Polished */}
            <Link 
              to="/wishlist" 
              className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-black/5 transition-all duration-300 group"
            >
              <Heart 
                size={16} 
                className={`transition duration-300 ${
                  wishlistItems.length > 0 
                    ? "fill-red-500 text-red-500 scale-105" 
                    : "text-zinc-600 group-hover:text-black"
                }`} 
              />
              {wishlistItems.length > 0 && (
                <span className="absolute top-1.5 right-1.5 text-[8px] font-black bg-black text-white w-3.5 h-3.5 flex items-center justify-center rounded-lg shadow-xs">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* 🛒 Cart Icon Polished */}
            <Link
              to="/cart"
              className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-black/5 transition-all duration-300 group"
            >
              <ShoppingCart size={16} className="text-zinc-600 group-hover:text-black transition-transform duration-300 group-hover:rotate-3" />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-black text-white text-[8px] font-black w-3.5 h-3.5 flex items-center justify-center rounded-lg shadow-xs">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* 👤 USER ACCORDION PROFILE LINK */}
            <div className="relative ml-1" ref={dropdownRef}>
              {userInfo ? (
                <>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-1.5 p-0.5 pr-2 rounded-full border border-black/5 bg-white/30 backdrop-blur-md hover:bg-white/60 transition duration-300"
                  >
                    <img
                      src={avatarSrc}
                      className="w-7 h-7 rounded-full object-cover border border-black/5"
                      alt="Avatar"
                    />
                    <ChevronDown
                      size={10}
                      className={`text-zinc-500 transition-transform duration-300 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* ✨ DROPDOWN STYLING UPGRADED */}
                  <div
                    className={`absolute right-0 mt-3 w-56 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/60 p-1.5
                    transition-all duration-300 origin-top-right ${
                      isDropdownOpen
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                    }`}
                  >
                    <div className="px-3.5 py-3 border-b border-black/5 mb-1 text-center md:text-left">
                      <p className="text-xs font-bold text-zinc-900 tracking-tight truncate">{userName}</p>
                      <p className="text-[10px] text-zinc-400 truncate mt-0.5">{userEmail}</p>
                    </div>

                    <div className="space-y-0.5">
                      <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-black/5 rounded-xl transition">
                        <Settings size={13} className="text-zinc-400" /> Settings
                      </Link>

                      <Link to="/my-orders" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-black/5 rounded-xl transition">
                        <Package size={13} className="text-zinc-400" /> My Orders
                      </Link>

                      {isAdmin && (
                        <Link to="/admin/dashboard" onClick={() => setIsDropdownOpen(false)} className="flex items-center justify-center gap-1.5 px-3 py-2 text-[10px] font-bold uppercase tracking-wider bg-zinc-950 text-white rounded-xl mt-1.5 hover:bg-zinc-800 transition shadow-sm">
                          <ShieldCheck size={12} /> Admin Panel
                        </Link>
                      )}

                      <button
                        onClick={logoutHandler}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50/50 rounded-xl mt-1 transition"
                      >
                        <LogOut size={13} /> Sign Out
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 bg-black text-white rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all duration-300"
                >
                  Sign In
                </Link>
              )}
            </div>

          </div>
        </div>
      </nav>

    </header>
  );
};

export default Navbar;