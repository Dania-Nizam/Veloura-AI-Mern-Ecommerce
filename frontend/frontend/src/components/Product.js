import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { syncCartWithDB } from '../redux/slices/cartSlice'; // 👈 Apne slice ka correct relative path yahan ensure karlein

const Product = ({ product }) => {
  const dispatch = useDispatch();
  
  // Safe state selection
  const { cartItems } = useSelector((state) => state.cart || { cartItems: [] });
  const { userInfo } = useSelector((state) => state.userLogin || {});

  const addToCartHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("🎯 Webpack-Safe Dispatched Payload Alignment for:", product.name);

    // 📦 1. Payload ko uniform MERN structure mein transform karein pehle
    const itemToAdd = {
      _id: product._id,
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: 1,
      countInStock: product.countInStock
    };

    // ⚡ 2. Core Slice Dispatch
    dispatch({
      type: 'cart/addToCart',
      payload: itemToAdd
    });

    // 💾 3. Database Sync ke liye localized array normalization
    const currentCart = Array.isArray(cartItems) ? [...cartItems] : [];
    const existingItem = currentCart.find(x => {
      const xId = x.productId?._id || x.productId || x._id;
      return String(xId) === String(product._id);
    });
    
    let updatedCart;
    if (existingItem) {
      updatedCart = currentCart.map(x => {
        const xId = x.productId?._id || x.productId || x._id;
        return String(xId) === String(product._id) ? { ...x, qty: (x.qty || 1) + 1 } : x;
      });
    } else {
      updatedCart = [...currentCart, itemToAdd];
    }

    // 🚀 4. Trigger actual Async Thunk middleware instead of hardcoded raw pending strings
    if (userInfo?._id) {
      dispatch(syncCartWithDB({ userId: userInfo._id, items: updatedCart }));
    }
  };

  return (
    <div className="bg-[#ffffff] group rounded-[24px] p-2 border border-zinc-100 shadow-sm">
      <div className="relative aspect-square bg-[#f5f5f7] rounded-[20px] mb-4 flex items-center justify-center overflow-hidden">
        <Link to={`/product/${product._id}`}>
          <img src={product.image} alt={product.name} className="w-full h-full object-contain p-4" />
        </Link>
        <button onClick={addToCartHandler} type="button" className="absolute bottom-4 right-4 bg-black text-white p-3 rounded-full hover:bg-zinc-800 transition-all z-50">
          <Plus size={20} />
        </button>
      </div>
      <div className="p-2">
        <h3 className="font-bold text-zinc-800 text-lg">{product.name}</h3>
        <div className="flex justify-between items-center mt-3">
          <span className="font-bold text-xl">${product.price}</span>
          <button onClick={addToCartHandler} type="button" className="bg-black text-white px-4 py-2 rounded-xl hover:bg-zinc-800 text-sm font-medium transition-all z-50">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;