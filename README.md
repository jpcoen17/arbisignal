# ArbiSignal 🚀

**Crypto Arbitrage Alert Platform** — Real-time arbitrage opportunities across Binance & Bybit, with Telegram alerts.

---

## Tech Stack

- **Next.js 14** (App Router + TypeScript)
- **Tailwind CSS** (Dark SaaS UI)
- **Supabase** (Auth + PostgreSQL)
- **Telegram Bot API**
- **Vercel** (Serverless deployment)

---

## Quick Start

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd arbisignal
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env.local
```

Fill in your values (see setup steps below).

---

## Setup Guide

### Step 1 — Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to **SQL Editor** and run the contents of `supabase/schema.sql`
3. Go to **Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Go to **Authentication → Settings**:
   - Enable **Email** provider
   - Set your Site URL (e.g., `http://localhost:3000` for dev)
   - Add redirect URL: `http://localhost:3000/**`

### Step 2 — Telegram Bot Setup

1. Open Telegram and search for `@BotFather`
2. Send `/newbot` and follow the steps
3. Copy the **Bot Token** → `TELEGRAM_BOT_TOKEN`
4. To get your Chat ID:
   - Start your bot by sending `/start`
   - Visit: `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates`
   - Find `"chat": {"id": 123456789}` — that number is your Chat ID
5. Enter your Chat ID in the Settings page of the app

### Step 3 — Local Development

```bash
npm run dev
# App runs at http://localhost:3000
```

### Step 4 — Vercel Deployment

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repo
3. Add Environment Variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `TELEGRAM_BOT_TOKEN`
4. Deploy!

---

## Features

### Free Plan
- See arbitrage opportunities > **1%** spread
- Telegram alerts for high-spread opportunities

### Premium Plan
- See arbitrage opportunities > **0.3%** spread
- Exclusive early alerts
- To manually upgrade a user (mock Stripe):
  ```sql
  UPDATE public.users SET role = 'premium' WHERE email = 'user@example.com';
  ```

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/prices` | GET | Fetch live prices from Binance & Bybit |
| `/api/arbitrage` | GET | Get arbitrage opportunities for current user |
| `/api/send-alert` | POST | Send Telegram alerts to user |
| `/api/telegram/connect` | POST | Connect Telegram Chat ID |
| `/api/telegram/connect` | DELETE | Disconnect Telegram |

---

## File Structure

```
arbisignal/
├── app/
│   ├── api/
│   │   ├── arbitrage/route.ts
│   │   ├── prices/route.ts
│   │   ├── send-alert/route.ts
│   │   └── telegram/connect/route.ts
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── login/page.tsx
│   ├── settings/page.tsx
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── dashboard/
│   │   ├── ArbitrageTable.tsx
│   │   ├── LivePricesTicker.tsx
│   │   ├── Sidebar.tsx
│   │   ├── StatsCards.tsx
│   │   ├── TelegramConnect.tsx
│   │   ├── TopBar.tsx
│   │   └── UpgradeCard.tsx
│   └── ui/
│       └── SkeletonRow.tsx
├── lib/
│   ├── arbitrage.ts        # Arbitrage calculation engine
│   ├── prices.ts           # Binance & Bybit price fetchers
│   ├── telegram.ts         # Telegram Bot integration
│   ├── utils.ts
│   └── supabase/
│       ├── client.ts       # Browser client
│       ├── middleware.ts   # Route protection
│       └── server.ts       # Server client
├── types/index.ts
├── middleware.ts
├── supabase/schema.sql
└── .env.example
```

---

## Adding Stripe (Future)

The codebase is ready for Stripe integration:

1. Install: `npm install stripe @stripe/stripe-js`
2. Add env vars: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
3. Add webhook handler in `/app/api/stripe/webhook/route.ts`
4. Update `UpgradeCard.tsx` to redirect to Stripe Checkout
5. On successful payment, update user role to `premium` via webhook

---

## Arbitrage Formula

```
spread = ((sell_price - buy_price) / buy_price) * 100
```

- **Free users**: Only see opportunities where `spread >= 1.0%`
- **Premium users**: See opportunities where `spread >= 0.3%`
