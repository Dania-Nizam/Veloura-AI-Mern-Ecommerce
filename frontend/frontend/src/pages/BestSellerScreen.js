import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Product from '../components/Product'; // Naya component import kiya

const BestSellerScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products/bestsellers');
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };
    fetchBestSellers();
  }, []);

  if (loading) return <div className="text-center py-20 animate-pulse font-bold">Fetching Best Sellers...</div>;

  return (
    <div className="container mx-auto px-6 py-10 min-h-screen bg-white">
      <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-10 border-l-8 border-blue-600 pl-4">
        Our Best Sellers
      </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <Product key={product._id} product={product} /> // Component use ho raha hai
        ))}
      </div>
    </div>
  );
};

export default BestSellerScreen;