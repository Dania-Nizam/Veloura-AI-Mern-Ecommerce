import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

// ⚡ Notice: Humne saare imports hata diye hain taake Webpack loop break ho jaye!
import {
  Trash2,
  ShoppingCart,
  Sparkles,
  ShoppingBag
} from 'lucide-react';

const CartScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 📦 LAYER 1: Redux Global State Elements extraction
  const cart = useSelector((state) => state.cart) || {};
  const reduxCartItems = cart.cartItems || [];
  const userInfo = useSelector((state) => state.userLogin?.userInfo || state.auth?.userInfo);

  // 💾 LAYER 2: Dual-Fallback Synchronous State Initialization (Fixes the immediate empty UI)
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  });

  // Keep internal state updated whenever Redux state successfully hydrates
  useEffect(() => {
    if (reduxCartItems && reduxCartItems.length > 0) {
      setCartItems(reduxCartItems);
    }
  }, [reduxCartItems]);

  /* ================= FETCH DATA ON LOAD (BYPASSING IMPORT) ================= */
  useEffect(() => {
    if (userInfo?._id) {
      // 🚀 Webpack-Safe Async Thunk Dispatch
      dispatch({
        type: 'cart/fetchCartFromDB/pending' 
      });
      
      dispatch({
        type: 'cart/fetchCartFromDB',
        payload: userInfo._id
      });
    }
  }, [dispatch, userInfo?._id]);

  /* ================= REMOVE HANDLER (BYPASSING IMPORT) ================= */
  const removeHandler = (id) => {
    const cleanId = String(id);

    // 🚀 1. Safe Action Invocation for Redux Core Store Engine
    dispatch({
      type: 'cart/removeFromCart',
      payload: cleanId
    });

    // 🔍 2. Filter out elements based on absolute key matching matching configurations
    const updatedItems = cartItems.filter(item => {
      const itemId = item.productId?._id || item.productId || item._id;
      return String(itemId) !== cleanId;
    });

    // 💾 3. FORCE PERSIST TO BROWSER DIRECTLY (Prevents state resets)
    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));

    if (userInfo?._id) {
      // 🚀 4. Direct Database Sync Call
      dispatch({
        type: 'cart/syncCartWithDB',
        payload: {
          userId: userInfo._id,
          items: updatedItems
        }
      });
    }
  };

  /* ================= TOTAL PRICE CALCULATION ================= */
  const totalPrice = cartItems.reduce((acc, item) => {
    const p = item.productId && typeof item.productId === 'object' ? item.productId : item;
    return acc + (item.qty || 1) * (p.price || 0);
  }, 0).toFixed(2);

  return (
    /* FIXED: Changed mt-28 to pt-28 and h-screen to min-h-screen to cover the entire page beautifully */
    <div className="min-h-screen pt-28 overflow-hidden bg-gradient-to-br from-[#f7f2ec] via-[#efe7dd] to-[#ffffff] text-[#1f1f1f] antialiased relative">
      
      {/* ✨ BACKGROUND LUXURY DECORATION */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="absolute w-[800px] h-[800px] border border-black/5 rounded-full animate-spin-slow"></div>
      </div>

      {/* BODY CONTAINER */}
      <div className="flex h-[calc(100vh-112px)] relative z-10 max-w-7xl mx-auto w-full px-6 lg:px-12 gap-8 lg:gap-12">
        
        {/* LEFT COLUMN: CART ITEMS LIST (Scrollable without visible scrollbar) */}
        <div className="lg:w-[62%] w-full overflow-y-auto pb-24 pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex justify-between items-end mb-12 border-b border-black/5 pb-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/40 backdrop-blur-md border border-white/40 rounded-2xl shadow-sm">
                <ShoppingBag size={22} className="text-black/70" />
              </div>
              <div>
                <h1 className="text-2xl font-serif tracking-tight text-[#1f1f1f]">Your Cart<span className="text-amber-600/60">.</span></h1>
                <p className="text-[10px] uppercase tracking-widest text-black/40 font-medium mt-1">Review your luxury choices</p>
              </div>
            </div>
            <div className="bg-white/40 border border-white/50 px-4 py-2 rounded-xl shadow-xs text-[10px] font-bold uppercase tracking-wider text-black/60">
              {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
            </div>
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center bg-white/30 backdrop-blur-md border border-white/40 p-16 rounded-[2.5rem] shadow-xl max-w-xl mx-auto mt-10">
              <ShoppingCart size={40} className="mx-auto text-black/20 mb-5" />
              <h2 className="text-2xl font-serif mb-2">Your luxury vault is empty</h2>
              <p className="text-black/50 text-sm max-w-xs mx-auto mb-8">Start exploring curated designer collections to add elements of craft.</p>
              <Link to="/" className="inline-flex items-center justify-center bg-black text-white px-8 py-3.5 rounded-xl text-[10px] uppercase tracking-[0.25em] hover:bg-white hover:text-black border border-black transition-all duration-300">
                Explore Products
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item) => {
                const p = item.productId && typeof item.productId === 'object' ? item.productId : item;
                const id = item.productId?._id || item.productId || item._id;

                return (
                  <div key={String(id)} className="group flex gap-6 bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-4 transition-all duration-300 hover:shadow-xl hover:border-white/60 items-center">
                    
                    {/* Image Area */}
                    <div className="w-28 h-32 aspect-square rounded-2xl overflow-hidden bg-white/40 flex items-center justify-center p-3 border border-white/30 shrink-0">
                      <img
                        src={p.image}
                        className="max-h-full max-w-full object-contain transition duration-500 group-hover:scale-105"
                        alt={p.name || "Product"}
                      />
                    </div>

                    {/* Meta/Action Grid */}
                    <div className="flex-1 flex flex-col justify-between h-32 py-1">
                      <div>
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="font-serif text-base text-zinc-800 tracking-tight leading-snug group-hover:text-amber-700/80 transition duration-300">{p.name}</h3>
                          <p className="font-bold text-lg text-zinc-900">${p.price ? Number(p.price).toFixed(2) : "0.00"}</p>
                        </div>
                        <div className="text-[9px] uppercase tracking-widest text-black/40 font-medium mt-2 flex items-center gap-1.5">
                          <Sparkles size={10} className="text-amber-500/50" /> In Luxury Stock
                        </div>
                      </div>

                      <div className="flex justify-between items-center border-t border-black/5 pt-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-black/30">Quantity</span>
                          <span className="bg-white/50 border border-white px-2.5 py-1 rounded-lg text-xs font-bold text-zinc-700">{item.qty || 1}</span>
                        </div>
                        <button 
                          onClick={() => removeHandler(id)} 
                          className="w-9 h-9 rounded-xl bg-white/40 border border-white/50 flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-white transition-all duration-300"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY */}
        <div className="hidden lg:block lg:w-[38%] pb-24">
          <div className="bg-white/40 backdrop-blur-xl border border-white/50 p-8 rounded-[2.5rem] shadow-xl sticky top-4">
            <h2 className="text-lg font-serif mb-6 tracking-tight text-zinc-900">Order Summary</h2>
            
            <div className="space-y-4 border-b border-black/5 pb-5 text-[11px] font-medium uppercase tracking-wider">
              <div className="flex justify-between text-zinc-500">
                <span>Subtotal</span>
                <span className="font-bold text-zinc-800">${totalPrice}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Estimated Shipping</span>
                <span className="text-emerald-600 font-black tracking-widest text-[10px]">Complimentary</span>
              </div>
            </div>

            <div className="pt-5 flex justify-between items-baseline mb-8">
              <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Total Price</span>
              <span className="text-3xl font-bold tracking-tight text-zinc-900">${totalPrice}</span>
            </div>

            <button
              onClick={() => navigate('/shipping')}
              className="w-full bg-black text-white py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-neutral-800 transition-all duration-300 shadow-md shadow-black/10"
            >
              Proceed to Checkout
            </button>

            <div className="text-center mt-5">
              <span className="text-[9px] uppercase tracking-widest text-black/30 font-medium">🔒 Secure End-to-End Encryption</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CartScreen;