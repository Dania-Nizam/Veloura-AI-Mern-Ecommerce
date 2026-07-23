import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../redux/slices/cartSlice";
import Swal from 'sweetalert2';
import { Lock, ShieldCheck, Info, Cpu, RefreshCw, CreditCard } from 'lucide-react';

const CheckoutForm = ({ totalAmount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart) || {};
  const cartItems = cart.cartItems?.length > 0 ? cart.cartItems : JSON.parse(localStorage.getItem('cartItems') || '[]');
  const shippingAddress = cart.shippingAddress || JSON.parse(localStorage.getItem('shippingAddress') || '{}');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      const storedInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!storedInfo?.token) throw new Error("Session expired. Please login again.");

      const { data } = await axios.post("https://veloura-ai-mern-ecommerce.vercel.app/api/payment/process", 
        { amount: Math.round(totalAmount * 100) }, 
        { headers: { Authorization: `Bearer ${storedInfo.token}` } }
      );

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name: storedInfo.name || 'Customer' },
        },
      });

      if (result.error) throw new Error(result.error.message);
      
      if (result.paymentIntent.status === "succeeded") {
  await axios.post(`${process.env.REACT_APP_API_URL}/api/orders`, {
    orderItems: cartItems.map(item => ({ 
      name: item.name, 
      qty: item.qty, 
      price: item.price, 
      product: item._id,
      // 🛠️ FIX: Yahan image add karein
      image: item.image || item.imageUrl || 'https://via.placeholder.com/150' 
    })),
    shippingAddress,
    paymentMethod: 'Stripe',
    totalPrice: totalAmount,
    paymentResult: { id: result.paymentIntent.id, status: 'succeeded' },
  }, { headers: { Authorization: `Bearer ${storedInfo.token}` }});
  
        Swal.fire({
          title: 'SUCCESS! 🚀',
          text: 'Payment received. Order secured.',
          icon: 'success',
          background: '#ffffff',
          confirmButtonColor: '#000'
        }).then(() => { dispatch(clearCart()); navigate("/my-orders"); });
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-8 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2"><CreditCard /> Checkout</h2>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-semibold">Secure Payment Gateway</p>
        </div>
        <Cpu className="text-blue-500 animate-pulse" />
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div>
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 block">Card Details</label>
          <div className="p-4 border border-gray-200 rounded-xl bg-gray-50 focus-within:ring-2 focus-within:ring-black transition-all">
            <CardElement options={{ style: { base: { fontSize: '16px', color: '#000' }}}} />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold flex items-center gap-2">
            <Info size={16} /> {error}
          </div>
        )}

        <button
          disabled={!stripe || loading}
          className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-gray-800 transition-all flex justify-center items-center gap-2"
        >
          {loading ? <RefreshCw className="animate-spin" /> : <Lock size={16} />}
          {loading ? "Processing..." : `Pay $${totalAmount}`}
        </button>

        <div className="text-center flex justify-center items-center gap-2 text-gray-400">
          <ShieldCheck size={14} />
          <span className="text-[9px] font-bold uppercase tracking-widest">PCI DSS Encrypted</span>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;