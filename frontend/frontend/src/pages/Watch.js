import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Product from '../components/Product';

const WatchScreen = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWatches = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/products/category/watches');
                setProducts(data);
                setLoading(false);
            } catch (error) {
                console.error("Watch Fetch Error:", error);
                setLoading(false);
            }
        };
        fetchWatches();
    }, []);

    if (loading) return <div className="text-center py-20 font-bold">Loading Watches...</div>;

    return (
        <div className="container mx-auto px-6 py-10 min-h-screen">
            <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-10 border-l-8 border-blue-600 pl-4">
                Premium Watches
            </h1>
            
            {products.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-3xl">
                    <p className="text-gray-500 text-xl font-bold italic uppercase">
                        Currently, no watches are available. Check back soon!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <Product key={product._id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default WatchScreen;