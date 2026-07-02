import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../redux/slices/wishlistSlice'; 
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import { Heart, ShoppingCart, Eye, Zap, Sparkles } from 'lucide-react';

const ShoeScreen = () => {
    const { t } = useTranslation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { wishlistItems } = useSelector((state) => state.wishlist);

    useEffect(() => {
        const fetchShoes = async () => {
            try {
                const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products/category/Shoes`);
                setProducts(data);
                setLoading(false);
            } catch (error) {
                console.error("Shoes fetch error:", error);
                setLoading(false);
            }
        };
        fetchShoes();
    }, []);

    const handleAddToCart = (product) => {
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
            Swal.fire({
                title: t('login'),
                text: 'Please Login to add items to cart!',
                icon: 'info',
                confirmButtonText: t('login'),
                showCancelButton: true,
                background: '#F7F2EC',
                color: '#1f1f1f',
                confirmButtonColor: '#000'
            }).then((result) => {
                if (result.isConfirmed) navigate('/login');
            });
        } else {
            dispatch(addToCart({ ...product, qty: 1 }));
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
            <div className="w-10 h-10 border-[1px] border-slate-300 border-t-black rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen pt-28 bg-[#FDFBF7] py-20 px-6 lg:px-20 text-[#1A1A1A]">
            
            {/* LUXURY HEADER */}
            <div className="max-w-7xl mx-auto mb-20">
                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400 mb-6">
                    <Zap size={12} /> Footwear Collection
                </div>
                <h1 className="text-4xl md:text-6xl font-serif font-medium leading-[0.9]">
                    Veloura <span className="italic text-slate-400">Shoes</span>
                </h1>
            </div>

            {/* PRODUCTS GRID */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                {products.length === 0 ? (
                    <div className="col-span-full text-center py-24">
                        <p className="text-slate-400 font-serif text-lg italic">
                            Curating our collection. Please check back shortly.
                        </p>
                    </div>
                ) : (
                    products.map((p) => {
                        const isWishlisted = wishlistItems.find((x) => x._id === p._id);

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
                                className="group cursor-pointer"
                                onClick={() => navigate(`/product/${p._id}`)}
                            >
                                {/* CARD FRAME */}
                                <div className="relative aspect-[3/4] bg-[#F4F1ED] rounded-[1.5rem] overflow-hidden mb-6">
                                    
                                    <button
                                        onClick={toggleWishlist}
                                        className="absolute top-4 right-4 z-20 p-3 bg-white/50 backdrop-blur-md rounded-full hover:scale-110 transition"
                                    >
                                        <Heart size={18} className={isWishlisted ? "fill-black" : ""} />
                                    </button>

                                    <img
                                        src={p.image}
                                        alt={p.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />

                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                        <div className="px-6 py-3 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                                            Quick View
                                        </div>
                                    </div>
                                </div>

                                {/* DETAILS */}
                                <div className="space-y-1">
                                    <h2 className="text-lg font-medium truncate">{p.name}</h2>
                                    <div className="flex justify-between items-center">
                                        <p className="font-bold text-lg">${p.price.toFixed(2)}</p>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddToCart(p);
                                            }}
                                            className="p-3 border border-black rounded-full hover:bg-black hover:text-white transition"
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

export default ShoeScreen;