import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: "2024-06-20" });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { priceId, email, trialDays = 7, successUrl, cancelUrl, seatCount = 1 } = req.body || {};
    if (!priceId) return res.status(400).json({ error: "Missing priceId" });
    if (!successUrl || !cancelUrl) return res.status(400).json({ error: "Missing successUrl/cancelUrl" });

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [{ price: priceId, quantity: Number(seatCount || 1) }],
      allow_promotion_codes: true,
      subscription_data: { trial_period_days: Number(trialDays) || undefined, metadata: { app: "myplanreader", seatCount: String(seatCount || 1) } } as any,
      success_url: successUrl + "?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: cancelUrl,
    } as any);

    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: "Failed to create checkout session" });
  }
}
