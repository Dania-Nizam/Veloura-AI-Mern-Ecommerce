import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Product from '../components/Product';
import { Flame } from 'lucide-react'; // Garmi ka ehsas dene ke liye icon

const HotDealsScreen = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHotDeals = async () => {
            try {
                const { data } = await axios.get('https://veloura-ai-mern-ecommerce.vercel.app/api/products/category/hotdeals');
                setProducts(data);
                setLoading(false);
            } catch (error) {
                console.error("Hot Deals Error:", error);
                setLoading(false);
            }
        };
        fetchHotDeals();
    }, []);

    if (loading) return <div className="text-center py-20 font-bold">Checking Hot Deals...</div>;

    return (
        <div className="container mx-auto px-6 py-10 min-h-screen">
            <div className="flex items-center gap-3 mb-10 border-l-8 border-orange-600 pl-4">
                <Flame className="text-orange-600 animate-bounce" size={40} />
                <h1 className="text-4xl font-[1000] italic uppercase tracking-tighter text-gray-900">
                    Hot Deals & Limited Offers
                </h1>
            </div>
            
            {products.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-3xl">
                    <p className="text-gray-500 text-xl font-bold italic">Currently, no hot deals are available. Check back soon!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <div key={product._id} className="relative">
                            {/* Hot Badge */}
                            <div className="absolute top-2 right-2 z-10 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-md animate-pulse">
                                LOW STOCK
                            </div>
                            <Product product={product} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HotDealsScreen;