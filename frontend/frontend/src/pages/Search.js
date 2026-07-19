import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Product from "../components/Product";

const SearchScreen = () => {
  const { keyword } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        // Backend API call (make sure your backend supports ?keyword=)
        const { data } = await axios.get(`https://veloura-ai-mern-ecommerce.vercel.app/api/products?keyword=${keyword}`);
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchResults();
  }, [keyword]);

  if (loading) return <div className="text-center py-20 font-bold">Searching...</div>;

  return (
    <div className="container mx-auto px-6 py-10 min-h-screen">
      <h1 className="text-3xl font-black italic uppercase mb-10">
        Results for: <span className="text-blue-600">"{keyword}"</span>
      </h1>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 border-4 border-dashed rounded-3xl">
          <h2 className="text-4xl font-[1000] text-slate-900 uppercase italic">Oops! Item Not Available</h2>
          <p className="text-gray-500 mt-4 font-bold text-lg">
            Sorry, we couldn't find any products matching your search.
          </p>
          <button 
            onClick={() => window.history.back()}
            className="mt-6 bg-slate-900 text-white px-8 py-3 font-black uppercase text-xs rounded-xl"
          >
            Go Back
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {products.map((p) => <Product key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
};

export default SearchScreen;