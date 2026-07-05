import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  ArrowLeft, 
  HeartOff,
  Sparkles,
  ChevronRight
} from 'lucide-react';

const WishlistScreen = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  // Local Redux state se wishlist items nikalna
  const { wishlistItems } = useSelector((state) => state.wishlist);
  
  // Authentication state se user login verification (taaki database se filter ho sake)
  const { userInfo } = useSelector((state) => state.userLogin || state.auth || {});

  // 🔄 DATABASE SYNC: Chatbot ya backend ke updates ko React UI par fetch karna
  useEffect(() => {
    // ✨ FIXED FETCH METHOD: Dynamic userId aur sahi port ke sath call
    const fetchLiveWishlist = async () => {
      try {
        // LocalStorage se userInfo nikalna safely
        const userInfoStr = localStorage.getItem('userInfo');
        if (!userInfoStr) return;

        const user = JSON.parse(userInfoStr);
        const userId = user._id || user.user?._id; // Har qism ke user object format ka fallback
        const token = user.token;

        if (userId) {
          const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
          
          // 🚀 Sahi port (5000) aur dynamic userId append kiya
          const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/wishlist/${userId}`, config);
          
          // Agar backend response de toh use Redux ya local state me set karein
          if (data && data.items) {
            dispatch(setWishlist(data.items));
          } else if (Array.isArray(data)) {
            dispatch(setWishlist(data));
          }
        }
      } catch (error) {
        console.error("Wishlist database sync error:", error);
      }
    };

    if (userInfo) {
       fetchLiveWishlist();
    }
  }, [dispatch, userInfo]);

  // 🛒 HANDLER: Item ko cart mein bhej kar wishlist se remove karna
  const addToCartHandler = async (item) => {
    // 1. Redux actions handle karein
    dispatch(addToCart({ ...item, qty: 1 }));
    const targetId = item.productId || item._id || item.product;
    dispatch(removeFromWishlist(targetId));

    // 2. 🚀 DATABASE SYNC: MongoDB se remove karne ka push call
    try {
      const userId = userInfo?._id || userInfo?.user?._id || JSON.parse(localStorage.getItem('userInfo'))?._id;
      
      if (userId && targetId) {
        const config = userInfo?.token ? { headers: { Authorization: `Bearer ${userInfo.token}` } } : {};
        // Delete request hitting server route directly
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/wishlist/${userId}/${targetId}`, config);
      }
    } catch (error) {
      console.error("Failed to delete item from DB on Move-To-Bag:", error);
    }
  };

  return (
    /* 🛠️ FIXED: Added pt-28 and min-h-screen to perfectly sit beneath your global navbar without blank white sections */
    <div className="min-h-screen pt-28 relative overflow-hidden bg-gradient-to-br from-[#f7f2ec] via-[#efe7dd] to-[#ffffff] text-[#1f1f1f] antialiased pb-24">

      {/* ✨ HERO STYLE BACKGROUND RINGS */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="absolute w-[600px] h-[600px] border border-black/5 rounded-full animate-spin-slow"></div>
        <div className="absolute w-[800px] h-[800px] border border-black/5 rounded-full animate-spin-reverse"></div>
      </div>

      {/* 🛠️ FIXED: Cleaned duplicate glass bar elements to prevent layout clipping */}

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">

        {/* HEADER */}
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-black/5 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/40 backdrop-blur-md border border-white/40 rounded-2xl shadow-sm">
              <Heart size={22} className="text-red-500 fill-red-500/20" />
            </div>

            <div>
              <h1 className="text-2xl font-serif tracking-tight text-[#1f1f1f]">
                {t('wishlist')}<span className="text-amber-600/60">.</span>
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-black/40 font-medium mt-1">
                {t('continue_shopping')} / Luxury Curated Vault
              </p>
            </div>
          </div>

          <div className="bg-white/40 border border-white/50 px-4 py-2 rounded-xl shadow-xs text-[10px] font-bold uppercase tracking-wider text-black/60">
            Items: <span className="text-sm font-black text-zinc-900">{wishlistItems.length}</span>
          </div>
        </header>

        {/* EMPTY STATE */}
        {wishlistItems.length === 0 ? (
          <div className="text-center bg-white/30 backdrop-blur-md border border-white/40 p-16 rounded-[2.5rem] shadow-xl max-w-xl mx-auto mt-10">
            <HeartOff size={40} className="mx-auto text-black/20 mb-5" />
            <h2 className="text-2xl font-serif mb-2">{t('wishlist_empty')}</h2>
            <p className="text-black/50 text-sm max-w-xs mx-auto mb-8">
              Your luxury vault is empty. Start exploring curated collections to store your favorites.
            </p>

            <Link
              to="/"
              className="inline-flex items-center justify-center bg-black text-white px-8 py-3.5 rounded-xl text-[10px] uppercase tracking-[0.25em] hover:bg-white hover:text-black border border-black transition-all duration-300 gap-2"
            >
              <span>{t('all_products')}</span>
              <ChevronRight size={12} className="shrink-0" />
            </Link>
          </div>
        ) : (
          /* GRID LAYOUT - Added scrollbar utility configurations matching the clean flow */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

            {wishlistItems.map((item) => {
              const itemId = item._id || item.productId || item.product;
              return (
                <div
                  key={itemId}
                  className="group bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-4 transition-all duration-300 hover:shadow-xl hover:border-white/60 flex flex-col h-full justify-between"
                >

                  {/* IMAGE FRAME */}
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-white/40 flex items-center justify-center p-4 border border-white/30 shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain transition duration-500 group-hover:scale-105"
                    />

                    {/* Trash Action Overlay Button */}
                    <button
                      onClick={() => dispatch(removeFromWishlist(itemId))}
                      className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-white/60 backdrop-blur-md border border-white/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 text-zinc-500 hover:text-red-500 hover:bg-white"
                    >
                      <Trash2 size={14} />
                    </button>

                    <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-white/50 border border-white/40 rounded-lg text-[9px] uppercase tracking-widest text-black/40 font-medium flex items-center gap-1">
                      <Sparkles size={10} className="text-amber-500/60" /> Premium Stock
                    </div>
                  </div>

                  {/* INFO CONTAINER */}
                  <div className="flex flex-col flex-grow justify-between pt-5">
                    <div className="text-center">
                      <h3 className="font-serif text-base text-zinc-800 tracking-tight leading-snug group-hover:text-amber-700/80 transition duration-300 min-h-[50px] flex items-center justify-center line-clamp-2 px-1">
                        {item.name}
                      </h3>

                      <p className="font-bold text-lg text-zinc-900 mt-3 mb-5">
                        ${item.price ? Number(item.price).toFixed(2) : "0.00"}
                      </p>
                    </div>

                    {/* Move to Bag Button - Perfectly locked alignment */}
                    <button
                      onClick={() => addToCartHandler(item)}
                      className="w-full bg-black text-white py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-neutral-800 transition-all duration-300 flex items-center justify-center gap-2 mt-auto shadow-md shadow-black/5"
                    >
                      <ShoppingCart size={13} />
                      Move to Bag
                    </button>
                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
};

export default WishlistScreen;