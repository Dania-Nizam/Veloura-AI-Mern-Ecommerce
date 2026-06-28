import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Swal from 'sweetalert2';
import { 
  Package, Truck, MapPin, CheckCircle2, 
  Search, Box, Clock, ChevronRight, Zap, ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

const TrackOrder = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [orderId, setOrderId] = useState(id || '');
  const [orderStatus, setOrderStatus] = useState(null); 
  const [loading, setLoading] = useState(false);

  const steps = [
    { label: t('order_placed') || 'Order Placed', icon: Box, desc: 'Manifest created' },
    { label: t('shipped') || 'In Transit', icon: Truck, desc: 'Carrier dispatched' },
    { label: t('out_for_delivery') || 'Out for Delivery', icon: MapPin, desc: 'Local courier' },
    { label: t('delivered') || 'Delivered', icon: CheckCircle2, desc: 'Mission success' }
  ];

  const getStatusIndex = (status) => {
    switch (status) {
      case 'Order Placed': return 0;
      case 'Shipped': return 1;
      case 'Out for Delivery': return 2;
      case 'Delivered': return 3;
      default: return 0;
    }
  };

  const getAuthConfig = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    return {
      headers: { Authorization: `Bearer ${userInfo?.token}` },
    };
  };

  useEffect(() => {
    if (id) autoTrack(id);
  }, [id]);

  const autoTrack = async (idToTrack) => {
    const cleanId = idToTrack.replace('#', '').trim();
    setLoading(true);
    try {
      const config = getAuthConfig();
      const { data } = await axios.get(`http://localhost:5000/api/orders/${cleanId}/status`, config);
      setOrderStatus(data);
    } catch (error) {
      console.error("Auto-track failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = async (e) => {
    if (e) e.preventDefault();
    const cleanId = orderId.replace('#', '').trim();
    if (!cleanId) return Swal.fire({ icon: 'warning', title: 'Order ID Required' });

    setLoading(true);
    try {
      const config = getAuthConfig();
      const { data } = await axios.get(`http://localhost:5000/api/orders/${cleanId}/status`, config);
      setOrderStatus(data);
    } catch (error) {
      setOrderStatus(null);
      Swal.fire({
        icon: 'error',
        title: 'Invalid Identifier',
        text: error.response?.data?.message || 'Error',
      });
    } finally {
      setLoading(false);
    }
  };

  const currentStep = orderStatus ? getStatusIndex(orderStatus.status) : 0;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#f7f2ec] via-[#efe7dd] to-[#ffffff] pb-24 text-[#1d1d1f] antialiased">

      {/* 🌫️ Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-pink-200/20 rounded-full blur-[140px] pointer-events-none"></div>

      {/* NAV */}
      <div className="bg-white/40 border-b border-white/20 py-4 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/my-orders" className="text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-2 text-slate-400 hover:text-black transition duration-300">
            <ArrowLeft size={13} /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-slate-900 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
              Logistic Live-Feed
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-16 relative z-10">

        {/* HEADER */}
        <header className="mb-12 text-center">
          <div className="inline-flex p-4 bg-white/50 backdrop-blur-md border border-white/40 rounded-2xl shadow-md mb-6">
            <Package size={24} className="text-slate-800" />
          </div>

          <h1 className="text-4xl font-bold font-serif tracking-tight text-slate-900">
            Track Your <span className="italic font-normal opacity-60">Journey</span>
          </h1>

          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-4">
            Enter your deployment identifier below
          </p>
        </header>

        {/* SEARCH */}
        <div className="bg-white/30 backdrop-blur-xl max-w-2xl mx-auto p-2 rounded-[2rem] border border-white/40 shadow-xl mb-12">
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-2">

            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="ORDER_HASH_IDENTIFIER"
                className="w-full pl-12 pr-4 py-4 bg-white/40 backdrop-blur-md rounded-xl outline-none font-semibold text-slate-800 placeholder:text-slate-400 text-xs tracking-wider uppercase border border-transparent focus:border-white/60 transition"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                required
              />
            </div>

            <button
              disabled={loading}
              className="bg-black text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-[11px] border border-black hover:bg-white hover:text-black flex items-center justify-center gap-2 transition-all duration-300 shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Sync Manifest <Zap size={13} />
                </>
              )}
            </button>

          </form>
        </div>

        {/* STATUS DISPLAY */}
        {orderStatus ? (
          <div className="bg-white/20 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] border border-white/40 shadow-xl">

            {/* STATUS SUBHEADER */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12 border-b border-slate-200/40 pb-6">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Active Manifest
                </p>
                <h2 className="text-xl font-bold font-serif text-slate-900 tracking-wide">
                  #{orderStatus.id || orderStatus._id}
                </h2>
              </div>

              <div className="bg-white/40 backdrop-blur-md border border-white/40 px-5 py-3 rounded-xl flex items-center gap-3 shadow-sm">
                <Clock size={15} className="text-slate-500" />
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Last Checkpoint</p>
                  <p className="text-xs font-semibold text-slate-800 mt-0.5">
                    {new Date(orderStatus.updatedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
              </div>
            </div>

            {/* TIMELINE STEPS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {steps.map((step, i) => {
                const Icon = step.icon;
                const active = i <= currentStep;

                return (
                  <div key={i} className="text-center flex flex-col items-center relative z-10 group">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-500 shadow-sm ${
                      active 
                        ? 'bg-black text-white border-black' 
                        : 'bg-white/50 text-slate-300 border-white/40'
                    }`}>
                      <Icon size={20} />
                    </div>
                    <p className={`mt-4 font-bold text-xs uppercase tracking-wide ${active ? 'text-slate-900' : 'text-slate-400'}`}>
                      {step.label}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">{step.desc}</p>
                  </div>
                );
              })}
            </div>

          </div>
        ) : (
          !loading && (
            <div className="text-center bg-white/20 backdrop-blur-md p-12 rounded-[2.5rem] border border-white/40 shadow-sm max-w-xl mx-auto">
              <Search className="mx-auto text-slate-300 mb-4" size={24} />
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-400">
                Awaiting Deployment Identifier
              </p>
            </div>
          )
        )}

      </div>
    </div>
  );
};

export default TrackOrder;