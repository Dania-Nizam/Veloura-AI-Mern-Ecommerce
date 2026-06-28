import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { MapPin, Globe, Mailbox, ArrowRight, Truck, CreditCard, CheckCircle2, Navigation } from 'lucide-react';

const ShippingScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // 🛡️ SAFE STATE CHECK: Bypasses undefined property crashes instantly
  const cart = useSelector((state) => state.cart) || {};
  
  // Safe extraction with native device storage fallbacks
  const shippingAddress = cart.shippingAddress && Object.keys(cart.shippingAddress).length > 0
    ? cart.shippingAddress
    : (localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')) : {});

  // State Management with pre-filled fallbacks
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');

  const submitHandler = (e) => {
    e.preventDefault();
    const addressData = { address, city, postalCode, country };

    // 💾 1. Save data directly to local storage registry
    localStorage.setItem('shippingAddress', JSON.stringify(addressData));

    // ⚡ 2. Direct string action layer communication
    dispatch({
      type: 'cart/saveShippingAddress',
      payload: addressData
    });

    navigate('/payment');
  };

  return (
    <div className="min-h-screen relative overflow-hidden pt-32 pb-20 px-6 bg-gradient-to-br from-[#f7f2ec] via-[#efe7dd] to-[#ffffff] text-[#1d1d1f] antialiased flex justify-center items-center">
      
      {/* 🌫️ Gentle Ambient Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-pink-200/20 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="w-full max-w-[560px] bg-white/20 backdrop-blur-xl rounded-[2.5rem] border border-white/40 p-8 md:p-12 shadow-xl relative z-10">
        
        {/* Header Branding */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center font-bold text-lg border border-black shadow-sm mb-5">
            V
          </div>
          <h2 className="text-3xl font-bold font-serif text-slate-900 tracking-tight">Shipping Details</h2>
          <p className="text-[11px] text-slate-400 font-medium tracking-normal mt-1.5">Please enter your delivery destination parameters below</p>
        </div>

        {/* Form Grid Architecture */}
        <form onSubmit={submitHandler} className="space-y-5">
          
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 pl-1">Street Address</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="123 Luxury Avenue"
                value={address}
                required
                onChange={(e) => setAddress(e.target.value)}
                className="w-full pl-11 pr-4 py-4 bg-white/40 backdrop-blur-md border border-white/40 rounded-xl font-semibold text-xs tracking-wide text-slate-800 outline-none focus:border-white/80 transition shadow-sm placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 pl-1">City</label>
              <div className="relative">
                <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="text"
                  placeholder="Karachi"
                  value={city}
                  required
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-white/40 backdrop-blur-md border border-white/40 rounded-xl font-semibold text-xs tracking-wide text-slate-800 outline-none focus:border-white/80 transition shadow-sm placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 pl-1">Postal Code</label>
              <div className="relative">
                <Mailbox className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="text"
                  placeholder="75500"
                  value={postalCode}
                  required
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-white/40 backdrop-blur-md border border-white/40 rounded-xl font-semibold text-xs tracking-wide text-slate-800 outline-none focus:border-white/80 transition shadow-sm placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 pl-1">Country</label>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Pakistan"
                value={country}
                required
                onChange={(e) => setCountry(e.target.value)}
                className="w-full pl-11 pr-4 py-4 bg-white/40 backdrop-blur-md border border-white/40 rounded-xl font-semibold text-xs tracking-wide text-slate-800 outline-none focus:border-white/80 transition shadow-sm placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest text-[11px] border border-black hover:bg-white hover:text-black flex items-center justify-center gap-2 transition-all duration-300 shadow-md group"
            >
              <span>Proceed to Payment</span>
              <ArrowRight size={14} className="transition group-hover:translate-x-1" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default ShippingScreen;