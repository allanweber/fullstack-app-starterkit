# Dockerfile
from node:22 as base

# Stage 1: Build the frontend using Vite
FROM base AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend/ ./

ARG VITE_GOOGLE_CLIENT_ID
RUN npm run build

# Stage 2: Build the backend using TypeScript
FROM base AS backend-builder

WORKDIR /app/backend

COPY backend/package.json backend/package-lock.json ./
RUN npm install

COPY backend/prisma ./prisma
RUN npx prisma generate

COPY backend/ ./
RUN npm run build

# Stage 3: Production image with Node.js
FROM base

WORKDIR /app

COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=backend-builder /app/backend/node_modules ./node_modules

# Copy the built frontend files into the backend public folder
COPY --from=frontend-builder /app/frontend/dist ./public
COPY backend/package.json ./

# Expose the port the app runs on
ENV NODE_ENV production
USER node

ARG HOSTNAME

# Start the application
CMD ["node", "dist/src/server.js"]
