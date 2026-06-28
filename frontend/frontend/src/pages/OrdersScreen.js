import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, Calendar, ChevronRight, Clock, 
  CheckCircle2, AlertCircle, PackageSearch, Hash, 
  Activity, ArrowUpRight
} from 'lucide-react';

const OrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const token = userInfo?.token;

        if (!token) {
          setLoading(false);
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(`http://localhost:5000/api/orders/myorders`, config);
        setOrders(data);
        setLoading(false);
      } catch (err) {
        console.error("Fetch Error:", err);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden px-6 py-20 bg-gradient-to-br from-[#f7f2ec] via-[#efe7dd] to-[#ffffff]">

      {/* ✨ GLASS BACKGROUND BLOBS (Hero Style) */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-pink-200/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto max-w-6xl relative z-10">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mt-8 mb-16">

          <div className="space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="p-3 bg-white/40 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg">
                <Activity size={22} className="text-[#1f1a16]" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.5em]">
                User / Orders History
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold font-serif text-slate-900 tracking-tighter">
              Your <span className="italic font-normal opacity-60">Orders</span>
            </h1>
          </div>

          <div className="bg-white/30 backdrop-blur-md border border-white/40 px-10 py-5 rounded-[2.5rem] shadow-xl flex items-center gap-8">

            <div className="border-r border-slate-300/50 pr-8">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total</p>
              <p className="text-3xl font-bold font-serif">{orders.length}</p>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</p>
              <p className="text-xs font-bold text-emerald-600 flex items-center gap-2 mt-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                Live Sync
              </p>
            </div>

          </div>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="w-14 h-14 border-4 border-white/40 border-t-black rounded-full animate-spin"></div>
            <p className="mt-6 text-slate-500 text-xs uppercase tracking-[0.4em]">
              Loading Orders...
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center bg-white/30 backdrop-blur-md border border-white/40 p-20 rounded-[3rem] shadow-xl">
            <PackageSearch size={50} className="mx-auto mb-6 text-slate-400" />
            <h2 className="text-3xl font-bold font-serif mb-3">No Orders Found</h2>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto text-sm">Start shopping to see your premium statement pieces here.</p>
            <Link to="/" className="inline-flex items-center gap-2 bg-black text-white px-10 py-4 rounded-full text-xs uppercase tracking-widest border border-black hover:bg-white hover:text-black transition duration-300">
              Start Shopping
            </Link>
          </div>
        ) : (

          <div className="space-y-5">

            {orders.map((order) => (
              <div
                key={order._id}
                className="group bg-white/20 backdrop-blur-xl border border-white/40 rounded-[2rem] shadow-md hover:shadow-xl transition-all duration-500 hover:scale-[1.005]"
              >

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 items-center px-8 py-6 gap-6">

                  {/* ID & DATE */}
                  <div className="lg:col-span-2 flex items-center gap-5">
                    <div className="w-12 h-12 bg-white/50 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/40 shadow-sm">
                      <Hash size={16} className="text-slate-600" />
                    </div>

                    <div>
                      <p className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-0.5">Order ID</p>
                      <p className="text-sm font-semibold tracking-wide text-slate-800">
                        {order._id.slice(-10).toUpperCase()}
                      </p>
                    </div>
                  </div>

                  {/* DATE */}
                  <div className="text-left lg:text-center">
                    <p className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">Placed On</p>
                    <p className="text-sm text-slate-700 flex items-center lg:justify-center gap-2 font-medium">
                      <Calendar size={13} className="opacity-60" />
                      {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  </div>

                  {/* PRICE */}
                  <div className="text-left lg:text-center">
                    <p className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-0.5">Amount</p>
                    <p className="text-xl font-bold font-serif text-slate-900">${order.totalPrice.toFixed(2)}</p>
                  </div>

                  {/* STATUS */}
                  <div className="flex justify-start lg:justify-center">
                    {order.isPaid ? (
                      <span className="bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 px-5 py-2 rounded-full text-[11px] font-bold tracking-widest uppercase flex items-center gap-2">
                        <CheckCircle2 size={13} /> Paid
                      </span>
                    ) : (
                      <span className="bg-amber-500/10 text-amber-700 border border-amber-500/20 px-5 py-2 rounded-full text-[11px] font-bold tracking-widest uppercase flex items-center gap-2">
                        <Clock size={13} /> Pending
                      </span>
                    )}
                  </div>

                  {/* ACTION */}
                  <div className="text-left lg:text-right">
                    <Link
                      to={`/order/${order._id}`}
                      className="inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest border border-black hover:bg-white hover:text-black transition-all duration-300 w-full md:w-auto"
                    >
                      View <ChevronRight size={13} />
                    </Link>
                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default OrdersScreen;