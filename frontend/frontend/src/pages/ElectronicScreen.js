import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Product from '../components/Product';

const ElectronicsScreen = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchElectronics = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/products/category/electronics');
                setProducts(data);
                setLoading(false);
            } catch (error) {
                console.error("Electronics Fetch Error:", error);
                setLoading(false);
            }
        };
        fetchElectronics();
    }, []);

    if (loading) return <div className="text-center py-20 font-bold">Loading Electronics...</div>;

    return (
        <div className="container mx-auto px-6 py-10 min-h-screen">
            <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-10 border-l-8 border-blue-600 pl-4">
                Electronics Collection
            </h1>
            
            {products.length === 0 ? (
                <div className="text-center py-20 text-gray-500">No electronics products found in database.</div>
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

export default ElectronicsScreen;