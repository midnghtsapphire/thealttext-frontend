###############################################################################
# TheAltText Frontend — Dockerfile
# Multi-stage build: Node.js build → Nginx static hosting
# A GlowStarLabs product by Audrey Evans
# https://meetaudreyevans.com
###############################################################################

# ── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:20-alpine AS build

LABEL maintainer="Audrey Evans <audrey@glowstarlabs.com>"
LABEL description="TheAltText Frontend — AI-Powered Alt Text Generator UI"

WORKDIR /app

# Install dependencies
COPY package.json ./
RUN npm install

# Copy source and build
COPY . .

# Build-time env vars (override at build time with --build-arg)
ARG VITE_API_URL=/api
ARG VITE_STRIPE_MODE=test
ARG VITE_STRIPE_TEST_PUBLISHABLE_KEY=
ARG VITE_STRIPE_LIVE_PUBLISHABLE_KEY=
ARG VITE_DEMO_MODE=false
ARG VITE_ECOMMERCE_MODE=true
ARG VITE_AI_SUGGESTIONS=true
ARG VITE_WCAG_SCORE_DISPLAY=true
ARG VITE_BEFORE_AFTER_PREVIEW=true

RUN npm run build

# ── Stage 2: Serve ───────────────────────────────────────────────────────────
FROM nginx:alpine

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
