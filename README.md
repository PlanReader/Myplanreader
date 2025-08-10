[README_LAUNCH.md](https://github.com/user-attachments/files/21703194/README_LAUNCH.md)
# MyPlanReader — Launch Package (with Stripe)

Includes:
- `pages/api/process-plan.ts` — PDF upload → Excel template pipeline
- `components/PlanUpload.tsx` — upload UI
- `server/assets/template.xlsx` — Excel template (copy of By-Division blank)
- `scripts/office/Import_Into_Division.ts` — Office Script
- `scripts/vba/ImportIntoDivision.bas` — VBA macro
- `pages/api/checkout.ts`, `pages/api/stripe-webhook.ts` — Stripe integration
- `components/SubscribeButtons.tsx` — Pricing buttons

## Setup
1) Copy into your Next.js repo
2) Install deps: `npm i formidable xlsx-populate nanoid stripe`
3) Add `server/assets/template.xlsx` (already included)
4) Place `<PlanUpload />` and `<SubscribeButtons />` on your pages

## Deploy (Vercel)
- Import GitHub repo → Deploy

## DNS (GoDaddy → Vercel)
- A @ → 76.76.21.21
- CNAME www → cname.vercel-dns.com

## Stripe Env Vars (Vercel → Project → Settings → Environment Variables)
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_PRICE_STARTER`
- `NEXT_PUBLIC_PRICE_STANDARD`
- `NEXT_PUBLIC_PRICE_PRO`

## Routes
- `POST /api/checkout` — body: `{ priceId, email, trialDays, successUrl, cancelUrl, seatCount }` → `{ url }`
- `POST /api/stripe-webhook` — add in Stripe Dashboard → Developers → Webhooks
- `POST /api/process-plan` — protected in production (check subscription)

## Subscribe Buttons (example)
```tsx
import SubscribeButtons from "@/components/SubscribeButtons";

<SubscribeButtons
  starterPriceId={process.env.NEXT_PUBLIC_PRICE_STARTER}
  standardPriceId={process.env.NEXT_PUBLIC_PRICE_STANDARD}
  proPriceId={process.env.NEXT_PUBLIC_PRICE_PRO}
  successUrl="https://myplanreader.com/success"
  cancelUrl="https://myplanreader.com/pricing"
  email={/* your user email */ undefined}
/>
```
