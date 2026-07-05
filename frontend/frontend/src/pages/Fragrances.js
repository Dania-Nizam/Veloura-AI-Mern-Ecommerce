import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import { Heart, ShoppingCart, Eye, Sparkles, Wind, Trash2, ShieldCheck, Tag } from 'lucide-react';
// setWishlist کو بھی امپورٹ میں شامل کر دیا گیا ہے
import { addToWishlist, removeFromWishlist, setWishlist } from '../redux/slices/wishlistSlice';

/**
 * FragranceScreen.jsx
 * Full UI refactor for a clean, luxury editorial experience.
 * All core functional logic preserved from user input.
 */
const FragranceScreen = () => {
    const { t } = useTranslation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Redux Selector for Wishlist & Auth State (Home.js کے مطابق)
    const { wishlistItems } = useSelector((state) => state.wishlist || { wishlistItems: [] });
    const { userInfo } = useSelector((state) => state.userLogin || state.auth || {});

    // Fetch Products on Mount + Sync Wishlist from DB
    useEffect(() => {
        const fetchFragrancesAndWishlist = async () => {
            try {
                // 1. Fetch Products
                const { data } = await axios.get('http://localhost:5000/api/products');
                const filteredFragrances = Array.isArray(data) 
                    ? data.filter((p) => p.category && p.category.trim().toLowerCase().includes('fragrance'))
                    : [];
                setProducts(filteredFragrances);
                
                // 2. Fetch and Sync Wishlist from DB if User is Logged In (As in Home.js)
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

                loading && setLoading(false);
            } catch (error) {
                console.error("Fragrances Fetch Error:", error);
                setLoading(false);
            }
        };
        fetchFragrancesAndWishlist();
    }, [dispatch, userInfo]);

    // Original handleAddToCart Logic
    const handleAddToCart = (product) => {
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
            Swal.fire({
                title: t('login') || 'Login',
                text: 'Please Login to add items to cart!',
                icon: 'info',
                confirmButtonText: t('login') || 'Login',
                showCancelButton: true,
                background: '#F7F2EC',
                color: '#1f1f1f',
                confirmButtonColor: '#000'
            }).then((result) => {
                if (result.isConfirmed) navigate('/login');
            });
        } else {
            // FIX/PRESERVE: Original cart action dispatch
            dispatch({
                type: 'cart/addToCart',
                payload: { ...product, qty: 1 }
            });

            // Original SweetAlert Toast
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                background: '#F7F2EC',
                color: '#1f1f1f',
            });
            Toast.fire({ icon: 'success', title: `${product.name} added to cart` });
        }
    };

    // Clean Loading State to match final screen aesthetic
    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-900 antialiased">
            <div className="w-12 h-12 border-2 border-slate-900/10 border-t-slate-900 rounded-full animate-spin mb-6"></div>
            <p className="text-[9px] font-bold uppercase tracking-[0.35em] text-slate-500">
                Scenting the air...
            </p>
        </div>
    );

    return (
        // UI REFACTOR: Clean, light gradient across entire screen
        <div className="w-full pt-10 flex flex-col bg-slate-50 antialiased relative overflow-hidden min-h-screen text-slate-900">
            
            {/* LUXURY BACKGROUND GLOW ORBS - Softened and Unified */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-[#C1A88D]/10 blur-[150px] rounded-full"></div>
                <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-slate-900/5 blur-[120px] rounded-full"></div>
            </div>

            <main className="w-full py-20 relative z-10">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">

                    {/* LUXURY HEADER - Unified light editorial presentation */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-6 border-b border-slate-900/5 pb-10">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-slate-400 font-bold text-[9px] uppercase tracking-[0.3em]">
                                <Wind size={12} className="text-slate-400 animate-pulse" />
                                Haute Parfumerie & Elixirs
                            </div>
                            {/* Brand Header consistent with VELOURA logo */}
                            <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-slate-900 leading-tight">
                                VELOURA <span className="italic font-normal text-slate-400">Fragrances</span>
                            </h1>
                        </div>

                        <div className="flex items-center gap-2.5 bg-white/40 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/60 shadow-sm">
                            <Sparkles size={14} className="text-slate-500" />
                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                                Maison De Parfum
                            </span>
                        </div>
                    </div>

                    {/* PRODUCTS GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                        {products.length === 0 ? (
                            <div className="col-span-full text-center py-24">
                                <p className="text-slate-400 font-serif text-lg italic tracking-wide">
                                    No fragrances available right now. Check back soon!
                                </p>
                            </div>
                        ) : (
                            products.map((p) => {
                                // Home.js کے مطابق گہری اور تفصیلی میچنگ کنڈیشنز
                                const currentWishlist = Array.isArray(wishlistItems) ? wishlistItems : [];
                                const isWishlisted = currentWishlist.find((x) => 
                                    (x._id === p._id) || 
                                    (x.productId && (x.productId === p._id || x.productId._id === p._id)) ||
                                    (x.product && x.product === p._id)
                                );

                                // Home.js کے مطابق ٹوگل لاجک مع الرٹس، ٹوکنز اور ڈیٹا بیس کالز
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
                                            await axios.post('http://localhost:5000/api/wishlist', { productId: p._id, userId: user._id || user.user?._id }, config);
                                        } catch (err) {
                                            console.error("Wishlist DB add error:", err);
                                        }
                                    }
                                };

                                return (
                                    <div
                                        key={p._id}
                                        className="group cursor-pointer flex flex-col"
                                        onClick={() => navigate(`/product/${p._id}`)}
                                    >
                                        {/* PRODUCT CARD PRESENTATION - REFACTORED FOR ELEGANCE */}
                                        <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-white/50 border border-white/60 shadow-sm transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-xl group-hover:bg-white/80">
                                            
                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-slate-900/5 via-transparent to-transparent z-10 pointer-events-none"></div>

                                            {/* UI FIX: Heart icon rendered in dark colors for clean light environment */}
                                            <button
                                                onClick={toggleWishlist}
                                                className="absolute top-5 right-5 z-20 w-10 h-10 bg-white/80 backdrop-blur-md rounded-xl flex items-center justify-center border border-white shadow-sm hover:scale-105 active:scale-95 transition-all duration-300"
                                            >
                                                {/* Home.js کی طرح وش لسٹڈ ہونے پر دل سرخ (fill-red-500) ہو جائے گا */}
                                                <Heart size={16} className={isWishlisted ? "fill-red-500 text-red-500" : "text-slate-400 group-hover:text-slate-600"} />
                                            </button>

                                            {/* PRODUCT IMAGE - Integrated and focused */}
                                            <img
                                                src={p.image}
                                                alt={p.name}
                                                className="w-full h-full object-contain p-8 transition-transform duration-700 ease-out group-hover:scale-105 bg-white/10"
                                            />

                                            {/* UI FIX: Quick view icon in dark colors for clarity */}
                                            <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6 z-10">
                                                <div className="bg-slate-900 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-xs font-bold uppercase tracking-wider shadow-md transition-transform duration-500 translate-y-2 group-hover:translate-y-0">
                                                    <Eye size={14} /> Quick View
                                                </div>
                                            </div>
                                        </div>

                                        {/* PRODUCT DETAILS PRESENTATION */}
                                        <div className="pt-5 flex-1 flex flex-col justify-between space-y-2">
                                            <h2 className="text-base font-semibold text-slate-800 tracking-tight group-hover:text-black transition-colors duration-300 line-clamp-1">
                                                {p.name}
                                            </h2>

                                            <div className="flex justify-between items-center pt-1">
                                                {/* UI FIX: Product price in clean black */}
                                                <p className="text-xl font-bold text-slate-900">
                                                    ${p.price.toFixed(2)}
                                                </p>

                                                {/* Original handleAddToCart button */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleAddToCart(p);
                                                    }}
                                                    className="w-11 h-11 bg-slate-900 text-white rounded-xl flex items-center justify-center transition-all duration-300 hover:bg-slate-800 hover:scale-105 active:scale-95 shadow-sm"
                                                >
                                                    <ShoppingCart size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default FragranceScreen;