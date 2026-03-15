# ---- Build stage ----
FROM node:24-alpine AS builder

WORKDIR /app

# Install only runtime deps for Chromium
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    NODE_ENV=production

COPY package*.json ./
RUN npm install

CMD ["node", "connect.js"]
