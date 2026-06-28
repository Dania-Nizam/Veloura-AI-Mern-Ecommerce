const express = require('express');
const router = express.Router();
const Stripe = require('stripe');

// Check karein ke key mil rahi hai ya nahi
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

if (!process.env.STRIPE_SECRET_KEY) {
    console.error("CRITICAL ERROR: STRIPE_SECRET_KEY is missing in .env file");
}

router.post('/process', async (req, res) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: req.body.amount,
            currency: 'usd',
        });

        res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;