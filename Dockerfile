# Multi-stage Dockerfile to build and serve the Vite app on Railway

FROM node:22-alpine AS build
WORKDIR /app

# Install deps first (better caching)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Lightweight static server
RUN npm i -g serve@14
COPY --from=build /app/dist ./dist

# Railway provides $PORT; default to 3000 locally
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "${PORT:-3000}"]

