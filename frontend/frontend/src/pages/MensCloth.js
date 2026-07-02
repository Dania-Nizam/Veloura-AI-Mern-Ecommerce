import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist, setWishlist } from '../redux/slices/wishlistSlice'; 
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import { Heart, ShoppingCart, Eye, Sparkles, Shirt } from 'lucide-react';

const MensClothingScreen = () => {
    const { t } = useTranslation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Home.js کے مطابق سلیکٹرز
    const { wishlistItems } = useSelector((state) => state.wishlist || { wishlistItems: [] });
    const { userInfo } = useSelector((state) => state.userLogin || state.auth || {});

    useEffect(() => {
        const fetchMensClothingAndWishlist = async () => {
            try {
                // 1. Fetch Products
                const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
                
                const filteredMens = Array.isArray(data)
                    ? data.filter((p) => p.category && p.category.trim().toLowerCase().includes('mens wear'))
                    : [];
                setProducts(filteredMens);
                
                // 2. Fetch and Sync Wishlist from DB if User is Logged In (As in Home.js)
                const userInfoStr = localStorage.getItem('userInfo');
                if (userInfoStr) {
                    const user = JSON.parse(userInfoStr);
                    const token = user.token || userInfo?.token;
                    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
                    
                    const userId = user._id || user.user?._id;
                    const { data: wishlistData } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/${userId}`, config);
                    if (wishlistData && wishlistData.items) {
                        dispatch(setWishlist(wishlistData.items));
                    } else if (Array.isArray(wishlistData)) {
                        dispatch(setWishlist(wishlistData));
                    }
                }

                loading && setLoading(false);
            } catch (error) {
                console.error("Mens Clothing Fetch Error:", error);
                setLoading(false);
            }
        };
        fetchMensClothingAndWishlist();
    }, [dispatch, userInfo]);

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
            dispatch({
                type: 'cart/addToCart',
                payload: { ...product, qty: 1 }
            });

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

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#FDFBF7]">
            <div className="w-10 h-10 border-[1px] border-slate-300 border-t-slate-900 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen pt-28 bg-[#FDFBF7] py-16 px-6 lg:px-20 text-[#1A1A1A]">
            
            {/* SARTORIAL HEADER SECTION */}
            <div className="max-w-7xl mx-auto mb-16">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400 mb-6">
                    <Shirt size={12} /> Premium Sartorial
                </div>
                <h1 className="text-4xl md:text-6xl font-serif font-medium leading-[0.9]">
                    Veloura <span className="italic text-slate-400">Homme</span>
                </h1>
            </div>

            {/* PRODUCTS ARCHITECTURE GRID */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                {products.length === 0 ? (
                    <div className="col-span-full text-center py-24">
                        <p className="text-slate-400 font-serif text-lg italic tracking-wide">
                            New season collection arriving soon. Stay tuned!
                        </p>
                    </div>
                ) : (
                    products.map((p) => {
                        // Home.js کے مطابق میچنگ کنڈیشنز
                        const currentWishlist = Array.isArray(wishlistItems) ? wishlistItems : [];
                        const isWishlisted = currentWishlist.find((x) => 
                            (x._id === p._id) || 
                            (x.productId && (x.productId === p._id || x.productId._id === p._id)) ||
                            (x.product && x.product === p._id)
                        );

                        // Home.js کے مطابق مکمل ٹوگل فنکشن مع الرٹس اور ٹوکنز
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
                                    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/${p._id}`, config);
                                } catch (err) {
                                    console.error("Wishlist DB remove error:", err);
                                }
                            } else {
                                try {
                                    dispatch(addToWishlist(p));
                                    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist`, { productId: p._id ,userId: user._id || user.user?._id}, config);
                                } catch (err) {
                                    console.error("Wishlist DB add error:", err);
                                }
                            }
                        };

                        return (
                            <div
                                key={p._id}
                                className="group cursor-pointer"
                                onClick={() => navigate(`/product/${p._id}`)}
                            >
                                {/* FRAME CONTAINER */}
                                <div className="relative aspect-[3/4] bg-[#F4F1ED] rounded-[1.5rem] overflow-hidden mb-6">
                                    
                                    {/* Minimalist Wishlist Trigger */}
                                    <button
                                        onClick={toggleWishlist}
                                        className="absolute top-4 right-4 z-20 p-3 bg-white/50 backdrop-blur-md rounded-full shadow-sm hover:scale-110 transition-all"
                                    >
                                        <Heart size={18} className={isWishlisted ? "fill-red-500 text-red-500" : ""} />
                                    </button>

                                    {/* Product Asset */}
                                    <img
                                        src={p.image}
                                        alt={p.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />

                                    {/* Quick Look Action Overlay */}
                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="px-6 py-3 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                                            Quick View
                                        </div>
                                    </div>
                                </div>

                                {/* META SEGMENT DETAILS */}
                                <div className="space-y-1">
                                    <h2 className="text-lg font-medium tracking-tight truncate">
                                        {p.name}
                                    </h2>

                                    <div className="flex justify-between items-center">
                                        <p className="font-bold text-lg">${p.price.toFixed(2)}</p>

                                        {/* Cart Operations */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddToCart(p);
                                            }}
                                            className="p-3 border border-black rounded-full hover:bg-black hover:text-white transition-all"
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
    );
};

export default MensClothingScreen;