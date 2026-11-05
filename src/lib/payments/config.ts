/**
 * Payments switch. Stays false until Razorpay is integrated and verified —
 * the site never simulates a successful payment.
 * Set NEXT_PUBLIC_PAYMENTS_ENABLED=true only after the Razorpay routes are live.
 */
export const PAYMENTS_ENABLED = process.env.NEXT_PUBLIC_PAYMENTS_ENABLED === "true";
export const PAYMENT_PROVIDER = "razorpay" as const;
