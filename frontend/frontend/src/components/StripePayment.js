import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';

// 🔴 Yahan apni key paste karein
const stripePromise = loadStripe('pk_test_51QgPB5GhgIQZmKDGSJddNcrjVHpLsQ8ukYOmdRqd63k3Mxi17L8FCTWinlUVWe2dpQ2FBqgBEnks5G3cilQOVV5y00Kh7IfkbD');

const StripePayment = ({ totalAmount }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm totalAmount={totalAmount} />
    </Elements>
  );
};

export default StripePayment;