import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist, setWishlist } from '../redux/slices/wishlistSlice'; 
import { addToCart, syncCartWithDB } from '../redux/slices/cartSlice'; 
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import Hero from '../components/Hero';
import CategorySlider from '../components/CategorySlider';
import { Heart, ShoppingCart, Eye, Zap, Sparkles } from 'lucide-react';

const Home = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { wishlistItems } = useSelector((state) => state.wishlist || { wishlistItems: [] });
  const { userInfo } = useSelector((state) => state.userLogin || state.auth || {});

  // Fetch products and sync wishlist from DB on load
  useEffect(() => {
    const fetchProductsAndWishlist = async () => {
      try {
        // 1. Fetch Products
        const { data: productsData } = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`);
        setProducts(productsData);

        // 2. Fetch and Sync Wishlist from DB if User is Logged In
        const userInfoStr = localStorage.getItem('userInfo');
        if (userInfoStr) {
          const user = JSON.parse(userInfoStr);
          const token = user.token || userInfo?.token;
          const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
          
          const userId = user._id || user.user?._id;
          const { data: wishlistData } = await axios.get(`${process.env.REACT_APP_API_URL}/api/wishlist/${userId}`, config);
          if (wishlistData && wishlistData.items) {
            dispatch(setWishlist(wishlistData.items));
          } else if (Array.isArray(wishlistData)) {
            dispatch(setWishlist(wishlistData));
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Initialization error:", error);
        setLoading(false);
      }
    };
    fetchProductsAndWishlist();
  }, [dispatch, userInfo]);

  const handleAddToCart = (product) => {
    const userInfoStr = localStorage.getItem('userInfo');
    
    if (!userInfoStr) {
      Swal.fire({
        title: 'Login Required',
        text: 'Please Login to add items to cart!',
        icon: 'info',
        confirmButtonText: 'Login',
        showCancelButton: true,
        background: '#F7F2EC',
        color: '#1f1f1f',
        confirmButtonColor: '#000'
      }).then((result) => {
        if (result.isConfirmed) navigate('/login');
      });
    } else {
      const user = JSON.parse(userInfoStr);
      
      const itemToAdd = {
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty: 1,
        countInStock: product.countInStock
      };

      const currentItems = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];
      
      const existingItem = currentItems.find(x => {
        const xId = x.productId?._id || x.productId || x._id;
        return String(xId) === String(product._id);
      });

      let updatedCart;
      if (existingItem) {
        updatedCart = currentItems.map(x => {
          const xId = x.productId?._id || x.productId || x._id;
          return String(xId) === String(product._id) ? { ...x, qty: x.qty + 1 } : x;
        });
      } else {
        updatedCart = [...currentItems, itemToAdd];
      }

      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      dispatch(addToCart(itemToAdd));

      const DBItems = updatedCart.map(item => ({
        productId: item.productId || item._id,
        qty: Number(item.qty || 1)
      }));

      const userId = user._id || user.user?._id;
      if (userId) {
        dispatch(syncCartWithDB({ 
          userId: userId, 
          user_id: userId, 
          items: DBItems 
        }));
      }

      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        icon: 'success',
        title: `${product.name} added to cart`,
        background: '#F7F2EC',
        color: '#1f1f1f',
      });
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#F7F2EC] via-[#EFE7DD] to-[#EAE3DA]">
      <div className="w-14 h-14 border-4 border-black/10 border-t-black rounded-full animate-spin"></div>
      <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.4em] text-black/60">
        Loading Collection...
      </p>
    </div>
  );

  return (
    <div className="w-full flex flex-col bg-gradient-to-b from-[#F7F2EC] via-[#EFE7DD] to-[#EAE3DA] antialiased relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] bg-black/5 blur-3xl rounded-full"></div>
        <div className="absolute bottom-[-120px] right-[-100px] w-[400px] h-[400px] bg-[#5D473A]/10 blur-3xl rounded-full"></div>
      </div>

      <section className="w-full relative z-10"><Hero /></section>
      <section className="w-full py-14 border-b border-black/5 backdrop-blur-sm relative z-10"><CategorySlider /></section>

      <main className="w-full py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          {/* HEADER SECTION POLISHED */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6 border-b border-black/5 pb-8">
            <div className="space-y-3 relative">
              <div className="flex items-center gap-2.5 text-black/40 font-bold text-[10px] uppercase tracking-[0.35em]">
                <Zap size={14} className="text-black/40" /> Premium Collection
              </div>
              <h1 className="text-3xl md:text-5xl font-serif tracking-tight text-zinc-900 leading-none">
                Signature <span className="italic font-light text-zinc-500">Edit</span><span className="text-amber-600/60">.</span>
              </h1>
            </div>
            <div className="flex items-center gap-2.5 bg-white/40 backdrop-blur-md border border-white/50 px-5 py-2.5 rounded-xl shadow-xs">
              <Sparkles size={14} className="text-black/50" />
              <span className="text-[10px] font-bold text-black/60 uppercase tracking-wider">Curated for You</span>
            </div>
          </div>

          {/* GRID LAYOUT MATCHED WITH LUXURY TILES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((p) => {
              const currentWishlist = Array.isArray(wishlistItems) ? wishlistItems : [];
              const isWishlisted = currentWishlist.find((x) => 
                (x._id === p._id) || 
                (x.productId && (x.productId === p._id || x.productId._id === p._id)) ||
                (x.product && x.product === p._id)
              );

              const toggleWishlist = async (e) => {
                e.stopPropagation();
                
                const userInfoStr = localStorage.getItem('userInfo');
                if (!userInfoStr) {
                  Swal.fire({
                    title: 'Login Required',
                    text: 'Please Login to manage your wishlist!',
                    icon: 'info',
                    confirmButtonText: 'Login',
                    showCancelButton: true,
                    background: '#F7F2EC',
                    color: '#1f1f1f',
                    confirmButtonColor: '#000'
                  }).then((result) => {
                    if (result.isConfirmed) navigate('/login');
                  });
                  return;
                }

                const user = JSON.parse(userInfoStr);
                const token = user.token || userInfo?.token;
                const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

                if (isWishlisted) {
                  try {
                    const targetId = isWishlisted._id || p._id;
                    dispatch(removeFromWishlist(targetId));
                    await axios.delete(`${process.env.REACT_APP_API_URL}/api/wishlist/${p._id}`, config);
                  } catch (err) {
                    console.error("Wishlist DB remove error:", err);
                  }
                } else {
                  try {
                    dispatch(addToWishlist(p));
                    await axios.post(`${process.env.REACT_APP_API_URL}/api/wishlist`, { productId: p._id ,userId: user._id || user.user?._id}, config);
                  } catch (err) {
                    console.error("Wishlist DB add error:", err);
                  }
                }
              };

              return (
                <div 
                  key={p._id} 
                  className="group cursor-pointer bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-4 transition-all duration-300 hover:shadow-xl hover:border-white/60 flex flex-col h-full justify-between" 
                  onClick={() => navigate(`/product/${p._id}`)}
                >
                  <div>
                    {/* IMAGE FRAME UPGRADED */}
                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-white/40 border border-white/30 flex items-center justify-center p-6 shrink-0">
                      
                      {/* Wishlist Button Polished */}
                      <button 
                        onClick={toggleWishlist} 
                        className="absolute top-3 right-3 z-30 w-9 h-9 bg-white/60 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/50 text-zinc-500 hover:text-black hover:bg-white transition duration-300"
                      >
                        <Heart size={15} className={isWishlisted ? "fill-red-500 text-red-500" : "text-zinc-400"} />
                      </button>

                      <img 
                        src={p.image} 
                        alt={p.name} 
                        className="max-h-full max-w-full object-contain transition duration-500 group-hover:scale-105" 
                      />
                      
                      {/* Quick View Overlay */}
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition duration-300 flex items-end justify-center pb-6">
                        <div className="bg-white text-black px-4 py-2.5 rounded-xl flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider shadow-md border border-neutral-100 transform translate-y-2 group-hover:translate-y-0 transition duration-300">
                          <Eye size={13} /> Quick View
                        </div>
                      </div>
                    </div>
                    
                    {/* TITLE AREA POLISHED */}
                    <div className="pt-5 text-center">
                      <h2 className="font-serif text-base text-zinc-800 tracking-tight leading-snug group-hover:text-amber-700/80 transition duration-300 min-h-[50px] flex items-center justify-center line-clamp-2 px-1">
                        {p.name}
                      </h2>
                    </div>
                  </div>

                  {/* PRICING & ACTION ROW LOCKED AT BOTTOM */}
                  <div className="pt-3 border-t border-black/5 mt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="block text-[8px] uppercase tracking-widest text-black/30 font-bold mb-0.5">Price</span>
                        <p className="font-bold text-lg text-zinc-900">${p.price ? Number(p.price).toFixed(2) : "0.00"}</p>
                      </div>
                      
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleAddToCart(p); }} 
                        className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center transition-all duration-300 hover:bg-neutral-800 shadow-sm shadow-black/5"
                      >
                        <ShoppingCart size={16} />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;