# ---- base ----
FROM node:20-alpine AS base
WORKDIR /app

# ---- deps ----
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ---- dev ----
FROM base AS dev
ENV NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]

# ---- build ----
FROM base AS build
ARG VITE_API_URL=http://localhost:8105
ENV VITE_API_URL=$VITE_API_URL
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- test ----
FROM base AS test
ARG VITE_API_URL=http://localhost:8105
ENV VITE_API_URL=$VITE_API_URL
COPY --from=deps /app/node_modules ./node_modules
COPY . .
CMD ["npm", "run", "build"]

# ---- runner ----
FROM nginx:1.25-alpine AS runner
RUN apk add --no-cache wget gettext
COPY --from=build /app/dist /usr/share/nginx/html
COPY docker/nginx/nginx.conf.template /etc/nginx/nginx.conf.template
RUN rm -f /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["/bin/sh", "-c", "envsubst '${API_PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && nginx -g 'daemon off;'"]
