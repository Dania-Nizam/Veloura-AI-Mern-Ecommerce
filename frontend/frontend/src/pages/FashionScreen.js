import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import { Heart, ShoppingCart, Eye, Sparkles, Shirt } from 'lucide-react';
import { addToWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice';

const FashionScreen = () => {
    const { t } = useTranslation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // ✅ Added safe state protection layer
    const { wishlistItems } = useSelector((state) => state.wishlist || { wishlistItems: [] });

    useEffect(() => {
        const fetchFashion = async () => {
            try {
                const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products/category/fashion`);
                setProducts(Array.isArray(data) ? data : []);
                loading && setLoading(false);
            } catch (error) {
                console.error("Fashion Fetch Error:", error);
                setLoading(false);
            }
        };
        fetchFashion();
    }, []);

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
            // ✅ FIX: String Action Bypass hitting Redux engine safely
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#F7F2EC] via-[#EFE7DD] to-[#ffffff]">
            <div className="w-12 h-12 border-2 border-slate-900/10 border-t-slate-900 rounded-full animate-spin"></div>
            <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.35em] text-slate-500">
                Curating your style...
            </p>
        </div>
    );

    return (
        <div className="w-full flex flex-col bg-gradient-to-b from-[#F7F2EC] via-[#EFE7DD] to-[#ffffff] antialiased relative overflow-hidden min-h-screen text-[#1d1d1f]">
            
            {/* LUXURY BACKGROUND GLOW ORBS */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-[#D4AF37]/5 blur-[150px] rounded-full"></div>
                <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-slate-900/5 blur-[120px] rounded-full"></div>
            </div>

            <main className="w-full py-20 relative z-10">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">

                    {/* LUXURY HEADER */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-6 border-b border-slate-900/5 pb-10">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-slate-400 font-bold text-[9px] uppercase tracking-[0.3em]">
                                <Shirt size={12} className="text-slate-400 animate-pulse" />
                                Sartorial Elegance
                            </div>
                            <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-slate-900 leading-tight">
                                Veloura <span className="italic font-normal text-slate-400">Fashion</span>
                            </h1>
                        </div>

                        <div className="flex items-center gap-2.5 bg-white/40 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/60 shadow-sm">
                            <Sparkles size={14} className="text-slate-500" />
                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                                Atelier Collection
                            </span>
                        </div>
                    </div>

                    {/* PRODUCTS GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                        {products.length === 0 ? (
                            <div className="col-span-full text-center py-24">
                                <p className="text-slate-400 font-serif text-lg italic tracking-wide">
                                    No fashion pieces available right now. Check back soon!
                                </p>
                            </div>
                        ) : (
                            products.map((p) => {
                                const currentWishlist = Array.isArray(wishlistItems) ? wishlistItems : [];
                                const isWishlisted = currentWishlist.find((x) => x._id === p._id);

                                const toggleWishlist = (e) => {
                                    e.stopPropagation();
                                    if (isWishlisted) {
                                        dispatch(removeFromWishlist(p._id));
                                    } else {
                                        dispatch(addToWishlist(p));
                                    }
                                };

                                return (
                                    <div
                                        key={p._id}
                                        className="group cursor-pointer flex flex-col"
                                        onClick={() => navigate(`/product/${p._id}`)}
                                    >
                                        <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-white/50 border border-white/60 shadow-sm transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-xl group-hover:bg-white/80">
                                            
                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-slate-900/5 via-transparent to-transparent z-10 pointer-events-none"></div>

                                            <button
                                                onClick={toggleWishlist}
                                                className="absolute top-5 right-5 z-20 w-10 h-10 bg-white/80 backdrop-blur-md rounded-xl flex items-center justify-center border border-white shadow-sm hover:scale-105 active:scale-95 transition-all duration-300"
                                            >
                                                <Heart size={16} className={isWishlisted ? "fill-slate-900 text-slate-900" : "text-slate-400 group-hover:text-slate-600"} />
                                            </button>

                                            <img
                                                src={p.image}
                                                alt={p.name}
                                                className="w-full h-full object-cover p-8 transition-transform duration-700 ease-out group-hover:scale-105"
                                            />

                                            <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6 z-10">
                                                <div className="bg-slate-900 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-xs font-bold uppercase tracking-wider shadow-md transition-transform duration-500 translate-y-2 group-hover:translate-y-0">
                                                    <Eye size={14} /> Quick View
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-5 flex-1 flex flex-col justify-between space-y-2">
                                            <h2 className="text-base font-semibold text-slate-800 tracking-tight group-hover:text-black transition-colors duration-300 line-clamp-1">
                                                {p.name}
                                            </h2>

                                            <div className="flex justify-between items-center pt-1">
                                                <p className="text-xl font-bold text-slate-900">
                                                    ${p.price}
                                                </p>

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

export default FashionScreen;