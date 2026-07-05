import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { 
  Package, MapPin, CreditCard, Calendar, ArrowLeft, 
  CheckCircle, AlertCircle, ExternalLink, ShieldCheck, 
  Zap, Box, Activity
} from "lucide-react";

const OrderDetailsScreen = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const token = userInfo?.token;

        if (!token) {
          setLoading(false);
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/${id}`, config);
        setOrder(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  if (loading || !order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#f7f2ec] via-[#efe7dd] to-[#ffffff]">
        <div className="w-14 h-14 border-4 border-white/40 border-t-black rounded-full animate-spin"></div>
        <p className="mt-6 text-xs uppercase tracking-[0.4em] text-slate-500">
          Syncing Order...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#f7f2ec] via-[#efe7dd] to-[#ffffff] pb-24">

      {/* 🌫️ Ambient Blobs (Hero Style) */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-pink-200/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-6 pt-24 max-w-6xl relative z-10">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">

          <div>
            <Link
              to="/my-orders"
              className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500 hover:text-black flex items-center gap-2 transition duration-300"
            >
              <ArrowLeft size={13} /> Back to orders
            </Link>

            <h1 className="text-4xl md:text-5xl font-bold font-serif mt-4 text-slate-900 tracking-tighter">
              Order <span className="italic font-normal opacity-60">#{order._id?.slice(-8).toUpperCase()}</span>
            </h1>
          </div>

          <div className="bg-white/30 backdrop-blur-md border border-white/40 px-8 py-4 rounded-[2rem] flex items-center gap-4 shadow-xl">
            {order.isPaid ? (
              <CheckCircle size={20} className="text-emerald-600" />
            ) : (
              <AlertCircle size={20} className="text-amber-600" />
            )}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Payment Status</p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-800 mt-0.5">
                {order.isPaid ? "Paid" : "Pending"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-8 space-y-8">

            {/* ADDRESS BOX */}
            <div className="bg-white/20 backdrop-blur-xl border border-white/40 p-10 rounded-[2.5rem] shadow-md">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-2.5 bg-white/50 backdrop-blur-md rounded-xl border border-white/40 shadow-sm text-slate-700">
                  <MapPin size={18} />
                </div>
                <h3 className="font-bold tracking-wide uppercase text-xs text-slate-400">Shipping Destination</h3>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-lg text-slate-900 font-serif">{order.shippingAddress?.address}</p>
                <p className="text-sm text-slate-600 font-medium">
                  {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
                </p>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-2">
                  {order.shippingAddress?.country}
                </p>
              </div>
            </div>

            {/* ITEMS LIST BOX */}
            <div className="bg-white/20 backdrop-blur-xl border border-white/40 rounded-[2.5rem] shadow-md overflow-hidden">

              <div className="p-8 border-b border-white/30 flex items-center gap-4">
                <div className="p-2.5 bg-white/50 backdrop-blur-md rounded-xl border border-white/40 shadow-sm text-slate-700">
                  <Box size={18} />
                </div>
                <h3 className="font-bold tracking-wide uppercase text-xs text-slate-400">Order Manifest</h3>
              </div>

              <div className="p-8 space-y-6 divide-y divide-slate-200/40">
                {order.orderItems?.map((item, i) => (
                  <div key={i} className={`flex items-center justify-between ${i > 0 ? "pt-6" : ""}`}>

                    <div className="flex items-center gap-6">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-contain bg-white/50 backdrop-blur-md rounded-2xl border border-white/40 p-3 shadow-sm"
                      />

                      <div>
                        <p className="font-bold text-base text-slate-800 tracking-wide">{item.name}</p>
                        <p className="text-xs font-medium text-slate-400 mt-1">
                          ${item.price.toFixed(2)} × {item.qty}
                        </p>
                      </div>
                    </div>

                    <p className="font-bold font-serif text-lg text-slate-900">
                      ${(item.qty * item.price).toFixed(2)}
                    </p>

                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN - SUMMARY */}
          <div className="lg:col-span-4">

            <div className="bg-white/20 backdrop-blur-xl border border-white/40 p-10 rounded-[2.5rem] shadow-xl sticky top-24">

              <div className="flex items-center gap-4 mb-8">
                <div className="p-2.5 bg-white/50 backdrop-blur-md rounded-xl border border-white/40 shadow-sm text-slate-700">
                  <Activity size={18} />
                </div>
                <h3 className="font-bold tracking-wide uppercase text-xs text-slate-400">Summary</h3>
              </div>

              <div className="space-y-5 text-sm">

                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Items Subtotal</span>
                  <span className="font-bold text-slate-800">${order.itemsPrice}</span>
                </div>

                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Premium Shipping</span>
                  <span className="font-bold text-slate-800">${order.shippingPrice}</span>
                </div>

                <div className="border-t border-slate-300/50 pt-5 flex justify-between text-xl font-bold text-slate-900">
                  <span>Total Due</span>
                  <span className="font-serif">${order.totalPrice.toFixed(2)}</span>
                </div>

              </div>

              <Link
                to={`/track-order/${order._id}`}
                className="mt-10 w-full bg-black text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 border border-black hover:bg-white hover:text-black transition-all duration-300 shadow-sm"
              >
                Track Journey <ExternalLink size={13} />
              </Link>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderDetailsScreen;