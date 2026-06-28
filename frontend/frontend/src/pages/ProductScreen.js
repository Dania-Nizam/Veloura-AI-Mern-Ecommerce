import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { ShoppingCart, ArrowLeft, Zap, ShieldCheck, Box, Minus, Plus } from 'lucide-react';
import Swal from 'sweetalert2';
import { addToCart, syncCartWithDB } from '../redux/slices/cartSlice';

const ProductScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Safe state extraction
  const userState = useSelector((state) => state.userLogin || state.auth || {});
  const userInfo = userState.userInfo || userState.user || userState;
  
  const { cartItems } = useSelector((state) => state.cart || { cartItems: [] });
  
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (error) { 
        console.error(error); 
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    const itemToAdd = {
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: Number(qty),
      countInStock: product.countInStock
    };

    // 📦 1. Get current cart from memory safely
    const currentItems = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];
    
    // 🔍 2. Check for matching items inside array
    const existingItem = currentItems.find(x => {
      const xId = x.productId?._id || x.productId || x._id;
      return String(xId) === String(product._id);
    });

    let updatedCart;
    if (existingItem) {
      updatedCart = currentItems.map(x => {
        const xId = x.productId?._id || x.productId || x._id;
        return String(xId) === String(product._id) ? { ...x, qty: x.qty + Number(qty) } : x;
      });
    } else {
      updatedCart = [...currentItems, itemToAdd];
    }

    // 💾 3. Save to localStorage
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));

    // ⚡ 4. Update Redux Local State Engine
    dispatch(addToCart(itemToAdd));

    // 🚀 5. Trigger Network Sync Request
    const userId = userInfo?._id || userInfo?.user?._id;
    if (userId) {
      const DBItems = updatedCart.map(item => ({
        productId: item.productId || item._id,
        qty: Number(item.qty)
      }));

      // ✨ FIXED: Passing both userId and user_id definitions to safely bypass Mongoose strict schema enforcement rules
      dispatch(syncCartWithDB({ 
        userId: userId, 
        user_id: userId, 
        items: DBItems 
      }));
    }

    Swal.fire({
      icon: 'success',
      title: 'Added to Cart!',
      toast: true,
      position: 'top-end',
      timer: 1500,
      showConfirmButton: false,
      background: '#020617',
      color: '#fff',
      iconColor: '#3b82f6'
    });
  };

  if (loading || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#f7f2ec] via-[#efe7dd] to-[#ffffff] gap-6">
        <div className="w-14 h-14 border-4 border-white/40 border-t-black rounded-full animate-spin"></div>
        <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[10px]">Synchronizing Artifact...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#f7f2ec] via-[#efe7dd] to-[#ffffff] text-[#1d1d1f] antialiased pb-24">
      
      {/* 🌫️ Gentle Ambient Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-pink-200/20 rounded-full blur-[140px] pointer-events-none"></div>

      {/* TOP COMPONENT HEADER */}
      <div className="bg-white/40 border-b border-white/20 py-4 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <button onClick={() => navigate(-1)} className="text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-2 text-slate-400 hover:text-black transition-all group">
            <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform" /> 
            Back to Archive
          </button>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Nexus <span className="text-slate-800 font-black">Inventory</span> Core
          </div>
        </div>
      </div>

      {/* COMPONENT BODY VIEWPORT */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* IMAGE WORKSPACE CONTAINER */}
          <div className="w-full lg:sticky top-24">
            <div className="bg-white/30 backdrop-blur-xl rounded-[2.5rem] p-8 lg:p-16 border border-white/40 relative overflow-hidden shadow-xl group">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-auto max-h-[460px] object-contain transition-transform duration-1000 group-hover:scale-105" 
              />
              <div className="absolute top-8 left-8">
                <span className="bg-black text-white text-[9px] font-bold px-4 py-1.5 rounded-xl uppercase tracking-[0.2em] shadow-sm">
                  Premium Grade
                </span>
              </div>
            </div>
          </div>

          {/* ATTRIBUTES METADATA WORKSPACE */}
          <div className="space-y-8 lg:py-4">
            <div className="space-y-4">
               <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em]">
                 <Zap size={12} className="text-slate-700" fill="currentColor" /> Authentic Artifact
               </div>
               
               <h1 className="text-3xl md:text-4xl font-bold font-serif text-slate-900 tracking-tight leading-tight">
                 {product.name}
               </h1>
               
               <div className="flex items-center gap-6 pt-2">
                  <div className="text-3xl font-bold font-serif text-slate-900">${product.price.toFixed(2)}</div>
                  <div className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                    product.countInStock > 0 
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                      : 'bg-red-50 text-red-600 border border-red-100'
                  }`}>
                    {product.countInStock > 0 ? 'Active Deployment' : 'Out of Sync'}
                  </div>
               </div>
            </div>

            <p className="text-slate-500 text-base leading-relaxed font-medium italic border-l-2 border-slate-200 pl-4">
              "{product.description}"
            </p>

            <div className="space-y-6 pt-6 border-t border-slate-200/40">
              <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center justify-between bg-white/20 backdrop-blur-md p-4 rounded-2xl border border-white/40">
                
                {/* QUANTITY CONFIGURATOR ARRAYS */}
                <div className="flex items-center bg-white/50 backdrop-blur-md border border-white/40 p-1.5 rounded-xl shadow-sm">
                   <button 
                     onClick={() => setQty(Math.max(1, qty - 1))} 
                     className="w-10 h-10 flex items-center justify-center hover:bg-black hover:text-white rounded-lg transition-all"
                   >
                     <Minus size={14} />
                   </button>
                   <span className="w-12 text-center font-bold text-base text-slate-800 font-serif">{qty}</span>
                   <button 
                     onClick={() => setQty(Math.min(product.countInStock || 10, qty + 1))} 
                     className="w-10 h-10 flex items-center justify-center hover:bg-black hover:text-white rounded-lg transition-all"
                   >
                     <Plus size={14} />
                   </button>
                </div>
                
                {/* PROGRESS SEGMENT CAPABILITIES */}
                <div className="flex flex-col sm:items-end">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Stock Availability</span>
                  <div className="flex items-center gap-3">
                    <div className="h-1 w-24 bg-slate-200/50 rounded-full overflow-hidden">
                      <div className="h-full bg-black rounded-full" style={{ width: `${Math.min(100, (product.countInStock / 20) * 100)}%` }}></div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-600">{product.countInStock} Units Left</span>
                  </div>
                </div>
              </div>

              {/* ACTION EXECUTION INTERFACE TRIGGER */}
              <button 
                onClick={handleAddToCart}
                disabled={product.countInStock === 0}
                className="w-full bg-black text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest border border-black hover:bg-white hover:text-black transition-all duration-300 shadow-md flex items-center justify-center gap-2 disabled:opacity-40 disabled:hover:bg-black disabled:hover:text-white"
              >
                <ShoppingCart size={14} />
                <span>{product.countInStock > 0 ? 'Initialize Procurement' : 'Manifest Unavailable'}</span>
              </button>
            </div>

            {/* TRUST CRITERIA MANIFEST BADGES */}
            <div className="grid grid-cols-2 gap-4 pt-4">
               <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md border border-white/30 p-4 rounded-xl">
                 <ShieldCheck size={18} className="text-slate-700" />
                 <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-tight">Secured & <br/>Encrypted</span>
               </div>
               <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md border border-white/30 p-4 rounded-xl">
                 <Box size={18} className="text-slate-700" />
                 <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-tight">Original <br/>Inventory</span>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductScreen;