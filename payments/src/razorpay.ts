import Razorpay from "razorpay";
import { ApiVersion } from "stripe/types/apiVersion";

export const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.STRIPE_KEY
});
