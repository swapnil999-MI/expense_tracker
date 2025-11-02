# --- Base Stage ---
FROM node:22-slim AS base

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# --- Build Stage ---
FROM base AS build
RUN npm run build

# --- Runtime Stage ---
FROM node:22-slim AS runtime

WORKDIR /app

# Copy only built output & minimal dependencies
COPY --from=build /app/dist ./dist
COPY package*.json ./
RUN npm install --omit=dev

# Copy environment files (optional for local builds)
COPY .env.development ./.env.development
COPY .env ./.env

# Expose your app port
EXPOSE 5000

# Define env (Docker can override this at runtime)
ENV NODE_ENV=development

# Start the app
CMD ["node", "dist/server.js"]
