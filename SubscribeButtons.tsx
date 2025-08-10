"use client";
import { useState } from "react";

type Props = {
  starterPriceId?: string;
  standardPriceId?: string;
  proPriceId?: string;
  successUrl: string;
  cancelUrl: string;
  email?: string;
};

export default function SubscribeButtons({ starterPriceId, standardPriceId, proPriceId, successUrl, cancelUrl, email }: Props) {
  const [loading, setLoading] = useState<string | null>(null);

  async function go(priceId?: string, seatCount = 1) {
    if (!priceId) return alert("Missing priceId");
    setLoading(priceId);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId, email, trialDays: 7, successUrl, cancelUrl, seatCount }),
    });
    const data = await res.json();
    setLoading(null);
    if (data?.url) window.location.href = data.url;
    else alert(data?.error || "Checkout failed");
  }

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {starterPriceId && (
        <button onClick={() => go(starterPriceId, 1)} disabled={loading===starterPriceId} className="border rounded px-4 py-3">
          {loading===starterPriceId ? "Redirecting…" : "Start Free Trial — Starter"}
        </button>
      )}
      {standardPriceId && (
        <button onClick={() => go(standardPriceId, 3)} disabled={loading===standardPriceId} className="border rounded px-4 py-3">
          {loading===standardPriceId ? "Redirecting…" : "Start Free Trial — Standard"}
        </button>
      )}
      {proPriceId && (
        <button onClick={() => go(proPriceId, 5)} disabled={loading===proPriceId} className="border rounded px-4 py-3">
          {loading===proPriceId ? "Redirecting…" : "Start Free Trial — Pro"}
        </button>
      )}
    </div>
  );
}
