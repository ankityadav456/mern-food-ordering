import dotenv from "dotenv";
import express from "express";
import stripePackage from "stripe";
dotenv.config();
const stripe = stripePackage(process.env.STRIPE_SECRET_KEY); // Use your secret key
// console.log(process.env.STRIPE_SECRET_KEY)
const router = express.Router();

// Route to create a payment intent
router.post("/create-payment-intent", async (req, res) => {
  // console.log(req.body);
  const { amount } = req.body; // The total amount (in cents, i.e., ₹100 = 10000)

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "inr", // Use INR (Indian Rupee)
    });

    res.json({
      clientSecret: paymentIntent.client_secret, // Send client secret back to frontend
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
