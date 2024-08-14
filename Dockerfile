# Dockerfile

# Stage 1: Build the frontend using Vite
FROM node:18 AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the backend using TypeScript
FROM node:18 AS backend-builder

WORKDIR /app/backend

ARG DATABASE_URL
ARG DATABASE_AUTH_TOKEN

COPY backend/package.json backend/package-lock.json ./
RUN npm install
COPY backend/ ./
RUN npm run build
RUN npm run db:migrate

# Stage 3: Production image with Node.js
FROM node:18

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
CMD ["node", "dist/server.js"]
