# Frontend Dockerfile - Angular 20

# Development target: runs ng serve
FROM node:20-alpine AS dev
WORKDIR /app
ENV CI=true

# Install dependencies
COPY package.json package-lock.json* .npmrc* ./
RUN npm ci || npm install

# Copy source
COPY . .
EXPOSE 4200
ENV API_BASE_URL=http://api:8080
CMD ["sh", "-c", "npm run start -- --host 0.0.0.0 --port 4200"]

# Production build
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* .npmrc* ./
RUN npm ci || npm install
COPY . .
RUN npm run build

# Nginx for serving production build
FROM nginx:1.27-alpine AS prod
COPY --from=build /app/dist/e-commerce-frontend/browser /usr/share/nginx/html
EXPOSE 80
# Optionally, add a custom nginx.conf for SPA routing and API proxy in the future
