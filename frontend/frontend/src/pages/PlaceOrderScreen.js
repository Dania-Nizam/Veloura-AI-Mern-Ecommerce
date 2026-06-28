import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import StripePayment from '../components/StripePayment'; 
import { MapPin, Receipt, ShieldCheck, Truck, CheckCircle2, Box, Navigation } from 'lucide-react';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart) || {};

  const cartItems = cart.cartItems?.length > 0 
    ? cart.cartItems 
    : JSON.parse(localStorage.getItem('cartItems') || '[]');

  const shippingAddress = cart.shippingAddress || JSON.parse(localStorage.getItem('shippingAddress') || '{}');

  useEffect(() => {
    if (!shippingAddress?.address) navigate('/shipping');
  }, [shippingAddress, navigate]);

  const itemsPrice = cartItems.reduce((acc, item) => acc + (item.price || 0) * (item.qty || 0), 0);
  const shippingPrice = itemsPrice > 500 ? 0 : 50; 
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2)); 
  const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

  return (
    <div className="min-h-screen py-24 px-6 bg-gray-50/50">
      <div className="container mx-auto max-w-6xl">
        
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold font-serif mb-2">Order Review</h1>
          <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold">Verify your details before deployment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (Left Column) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Shipping Info */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6 text-gray-900">
                <MapPin size={20} />
                <h2 className="font-bold uppercase tracking-widest text-sm">Shipping Destination</h2>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <p className="text-sm font-semibold">{shippingAddress.address}, {shippingAddress.city}</p>
                <p className="text-sm text-gray-500 mt-1">{shippingAddress.postalCode}, {shippingAddress.country}</p>
              </div>
            </div>

            {/* Items List */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6 text-gray-900">
                <Box size={20} />
                <h2 className="font-bold uppercase tracking-widest text-sm">Order Items</h2>
              </div>
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-4">
                      <img src={item.image} className="w-12 h-12 rounded-lg object-cover bg-white" alt={item.name} />
                      <div>
                        <Link to={`/product/${item.productId || item._id}`} className="text-sm font-bold block hover:underline">{item.name}</Link>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Qty: {item.qty}</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold font-serif">${(item.qty * item.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar (Right Column) */}
          <div className="space-y-6">
            <div className="bg-black text-white p-8 rounded-3xl shadow-2xl">
              <h2 className="text-lg font-bold mb-6 font-serif">Summary</h2>
              <div className="space-y-4 text-xs font-bold uppercase tracking-widest opacity-80">
                <div className="flex justify-between"><span>Subtotal</span><span>${itemsPrice.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>{shippingPrice === 0 ? 'Free' : `$${shippingPrice.toFixed(2)}`}</span></div>
                <div className="flex justify-between"><span>Tax</span><span>${taxPrice.toFixed(2)}</span></div>
                <div className="border-t border-white/20 pt-4 flex justify-between text-base font-serif">
                  <span>Total</span><span>${totalPrice}</span>
                </div>
              </div>
              
              <div className="mt-8 bg-white/10 p-4 rounded-2xl border border-white/10">
                <StripePayment totalAmount={totalPrice} />
              </div>
            </div>

            {/* SLA Badge */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-4 shadow-sm">
              <div className="p-3 bg-gray-100 rounded-xl"><Truck size={18} /></div>
              <div>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Delivery SLA</p>
                <p className="text-xs font-bold text-gray-900">72-Hour Dispatch Promise</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PlaceOrderScreen;