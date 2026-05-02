# TheAltText Frontend

**AI-Powered Alt Text Generator — React UI**

A [GlowStarLabs](https://glowstarlabs.com) product by [Audrey Evans](https://meetaudreyevans.com)

---

## Overview

TheAltText Frontend is a fully standalone React application for uploading images and generating WCAG-compliant alt text using AI. It connects to the [TheAltText Backend](https://github.com/MIDNGHTSAPPHIRE/thealttext-backend) API, or runs in demo mode with built-in mock data and optional client-side OpenRouter AI calls.

## Features

| Feature | Description |
|---|---|
| **AI Alt Text Generation** | Upload images or provide URLs for instant accessible alt text |
| **Drag-and-Drop Bulk Upload** | Drop up to 100 images at once with real-time progress tracking |
| **Image Gallery View** | Browse, search, and filter all processed images with grid/list toggle |
| **WCAG Compliance Score** | Color-coded compliance badges (A/AA/AAA) on every image |
| **E-commerce Product Mode** | Manage product catalogs with SEO-optimized alt text generation |
| **AI-Suggested Improvements** | AI analyzes images for contrast, resolution, and accessibility issues |
| **Before/After Preview** | Side-by-side screen reader output comparison |
| **Multi-Language Support** | 14+ languages including English, Spanish, Japanese, Hawaiian |
| **Tone Customization** | Formal, casual, technical, or simple (6th-grade reading level) |
| **Website Scanner** | Crawl websites to audit image accessibility compliance |
| **Compliance Reports** | Export detailed reports in JSON, CSV, or PDF |
| **Developer API Portal** | Manage API keys for B2B integration |
| **Stripe Billing** | Free/Pro/Enterprise tiers with test/live mode toggle |
| **Carbon Tracking** | Monitor environmental impact of AI usage |
| **WCAG AAA UI** | The app itself is fully accessible |

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Styling | Tailwind CSS 3.4 |
| Build Tool | Vite 5 |
| Routing | React Router 6 |
| HTTP Client | Axios |
| Charts | Recharts |
| Animations | Framer Motion |
| File Upload | react-dropzone |
| Payments | @stripe/stripe-js |
| Icons | Lucide React |

## Quick Start

### Prerequisites

- Node.js 18+ (recommended: 20 LTS)
- npm or pnpm

### Development

```bash
# Clone the repo
git clone https://github.com/MIDNGHTSAPPHIRE/thealttext-frontend.git
cd thealttext-frontend

# Install dependencies
npm install

# Copy environment config
cp .env.example .env

# Start dev server (demo mode by default)
npm run dev
```

The app runs at `http://localhost:5173` in demo mode with mock data.

### Production Build

```bash
npm run build
# Output in ./dist — deploy to any static hosting
```

### Docker

```bash
# Build and run
docker compose up --build

# Or build manually
docker build -t thealttext-frontend .
docker run -p 3000:80 thealttext-frontend
```

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend API URL | `/api` |
| `VITE_DEMO_MODE` | Enable demo mode (no backend needed) | `true` |
| `VITE_STRIPE_MODE` | Stripe mode: `test` or `live` | `test` |
| `VITE_STRIPE_TEST_PUBLISHABLE_KEY` | Stripe test publishable key | — |
| `VITE_STRIPE_LIVE_PUBLISHABLE_KEY` | Stripe live publishable key | — |
| `VITE_ECOMMERCE_MODE` | Enable e-commerce product mode | `true` |
| `VITE_AI_SUGGESTIONS` | Enable AI image suggestions | `true` |
| `VITE_WCAG_SCORE_DISPLAY` | Show WCAG compliance scores | `true` |
| `VITE_BEFORE_AFTER_PREVIEW` | Enable before/after preview | `true` |
| `VITE_OPENROUTER_API_KEY` | OpenRouter key for demo mode AI | — |

## Stripe Dual-Mode Billing

The frontend supports both Stripe **test** and **live** modes via `VITE_STRIPE_MODE`:

```env
# Test mode (default)
VITE_STRIPE_MODE=test
VITE_STRIPE_TEST_PUBLISHABLE_KEY=pk_test_xxxx

# Live mode
VITE_STRIPE_MODE=live
VITE_STRIPE_LIVE_PUBLISHABLE_KEY=pk_live_xxxx
```

In test mode, a visible banner reminds users to use test card `4242 4242 4242 4242`.

## Deployment

### Static Hosting (Vercel, Netlify, Cloudflare Pages)

1. Set `VITE_API_URL` to your backend URL
2. Set `VITE_DEMO_MODE=false`
3. Build: `npm run build`
4. Deploy the `dist/` folder

### Docker + Nginx

The included Dockerfile builds a production-optimized Nginx container:

```bash
docker build \
  --build-arg VITE_API_URL=https://api.yoursite.com/api \
  --build-arg VITE_STRIPE_MODE=live \
  --build-arg VITE_DEMO_MODE=false \
  -t thealttext-frontend .
```

## Project Structure

```
thealttext-frontend/
├── src/
│   ├── components/
│   │   ├── accessibility/    # WCAG score, before/after preview
│   │   ├── ai/               # AI suggestions
│   │   ├── ecommerce/        # Product listing mode
│   │   ├── gallery/          # Image gallery view
│   │   ├── layout/           # Navigation, sidebar
│   │   └── upload/           # Drag-and-drop bulk upload
│   ├── hooks/                # useAuth
│   ├── pages/                # Route pages
│   ├── services/             # API client, mock API
│   ├── styles/               # Global CSS
│   ├── types/                # TypeScript types
│   └── App.tsx               # Root component
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── .env.example
└── README.md
```

## License

Proprietary — GlowStarLabs / Audrey Evans

## Links

- **Hub**: [meetaudreyevans.com](https://meetaudreyevans.com)
- **Backend**: [thealttext-backend](https://github.com/MIDNGHTSAPPHIRE/thealttext-backend)
- **Original**: [thealttext](https://github.com/MIDNGHTSAPPHIRE/thealttext)

---

## Test

| Feature | Status | URL |
|--------|--------|-----|
| Homepage | ✅ Working | https://thealttext-frontend.vercel.app |
| Image Upload | ✅ Working | https://thealttext-frontend.vercel.app |
| Alt Text Generation | ✅ Working | https://thealttext-frontend.vercel.app |
| Bulk Upload | ✅ Working | https://thealttext-frontend.vercel.app |
| WCAG Compliance | ✅ Working | https://thealttext-frontend.vercel.app |
| Build | ✅ TypeScript compiles | Run: `npm run build` |

**Test Command:** `npm run build` — passes

---

## Deployment

**Production:** https://thealttext-frontend.vercel.app
**Framework:** React + TypeScript + Vite + Tailwind

**Fix Applied:** Added `context?: string` to analyzeFile options type (pushed)
