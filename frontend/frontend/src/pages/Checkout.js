import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useSelector } from 'react-redux';
import CheckoutForm from '../components/CheckoutForm';

// Stripe public key (apni .env se lein)
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_your_key');

const CheckoutScreen = () => {
  const cart = useSelector((state) => state.cart);
  // Total calculate karein
  const totalAmount = cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <Elements stripe={stripePromise}>
        <CheckoutForm totalAmount={totalAmount} />
      </Elements>
    </div>
  );
};

export default CheckoutScreen;