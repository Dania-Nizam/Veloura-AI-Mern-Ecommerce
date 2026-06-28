import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CreditCard, Zap } from 'lucide-react';

const PaymentScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 📦 LAYER 1: Super Safe Extraction Matrix to prevent undefined object crashes
  const cart = useSelector((state) => state.cart) || {};
  
  // 💾 LAYER 2: Fallback selector parsing localStorage if redux state hasn't hydrated yet
  const shippingAddress = cart.shippingAddress || (localStorage.getItem('shippingAddress') 
    ? JSON.parse(localStorage.getItem('shippingAddress')) 
    : null);

  useEffect(() => {
    if (!shippingAddress || !shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  // Read initial payment method state with immediate device fallback layer
  const [paymentMethod, setPaymentMethod] = useState(() => {
    const saved = localStorage.getItem('paymentMethod');
    return saved ? JSON.parse(saved) : 'PayPal';
  });

  const submitHandler = (e) => {
    e.preventDefault();

    // 💾 1. Force state persistence to local device registry
    localStorage.setItem('paymentMethod', JSON.stringify(paymentMethod));

    // ⚡ 2. Loop-safe explicit string action execution for module sync
    dispatch({
      type: 'cart/savePaymentMethod',
      payload: paymentMethod
    });

    // 🚀 REDIRECTION LOGIC:
    // Agar Stripe select hai, toh checkout page par bhejein,
    // otherwise normal flow (PlaceOrder) par jayein.
    if (paymentMethod === 'Stripe') {
      navigate('/checkout');
    } else {
      navigate('/placeorder');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden pt-32 pb-20 px-6 bg-gradient-to-br from-[#f7f2ec] via-[#efe7dd] to-[#ffffff] text-[#1d1d1f] antialiased flex justify-center items-center">

      {/* 🌫️ Gentle Ambient Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-pink-200/20 rounded-full blur-[140px] pointer-events-none"></div>

      <form 
        onSubmit={submitHandler} 
        className="w-full max-w-[480px] bg-white/20 backdrop-blur-xl rounded-[2.5rem] border border-white/40 p-8 md:p-12 shadow-xl relative z-10"
      >

        {/* Heading Segment */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 mb-3 bg-white/40 px-4 py-1.5 rounded-full border border-white/40 shadow-sm">
            <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse"></span>
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Checkout Phase
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold font-serif text-slate-900 tracking-tight">
            Payment <span className="italic font-normal opacity-60">Method</span>
          </h1>
          <p className="text-[11px] text-slate-400 font-medium tracking-normal mt-2">
            Select an authorized processing rail to handle transaction execution
          </p>
        </div>
        
        {/* Gateway Form Arrays */}
        <div className="space-y-4">

          {/* PayPal Gateway */}
          <label className={`flex items-center p-5 rounded-2xl cursor-pointer transition-all duration-300 border ${
            paymentMethod === 'PayPal' 
              ? 'border-black bg-white/80 shadow-md translate-y-[-2px]' 
              : 'border-white/40 bg-white/30 backdrop-blur-md hover:border-white/80 shadow-sm'
          }`}>
            <input 
              type="radio" 
              name="paymentMethod" 
              value="PayPal" 
              checked={paymentMethod === 'PayPal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-4 h-4 text-black focus:ring-0 accent-black cursor-pointer"
            />
            <div className="ml-4 flex-1">
              <span className="block text-sm font-bold text-slate-900 tracking-wide">PayPal Ecosystem</span>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">
                Fast & Secure Redirection
              </span>
            </div>
          </label>

          {/* Stripe Gateway */}
          <label className={`flex items-center p-5 rounded-2xl cursor-pointer transition-all duration-300 border ${
            paymentMethod === 'Stripe' 
              ? 'border-black bg-white/80 shadow-md translate-y-[-2px]' 
              : 'border-white/40 bg-white/30 backdrop-blur-md hover:border-white/80 shadow-sm'
          }`}>
            <input 
              type="radio" 
              name="paymentMethod" 
              value="Stripe" 
              checked={paymentMethod === 'Stripe'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-4 h-4 text-black focus:ring-0 accent-black cursor-pointer"
            />
            <div className="ml-4 flex-1">
              <span className="block text-sm font-bold text-slate-900 tracking-wide">
                Credit Card (via Stripe)
              </span>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">
                All Global Cryptographic Cards
              </span>
            </div>
            <CreditCard size={15} className="text-slate-400 hidden sm:block" />
          </label>

        </div>

        {/* Action Dispatch Commit */}
        <div className="pt-6">
          <button 
            type="submit" 
            className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest text-[11px] border border-black hover:bg-white hover:text-black flex items-center justify-center gap-2 transition-all duration-300 shadow-md group"
          >
            <span>Continue to Review</span>
            <Zap size={13} className="transition group-hover:scale-110" />
          </button>
        </div>

      </form>
    </div>
  );
};

export default PaymentScreen;