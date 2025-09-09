FROM node:20-bookworm-slim
WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

COPY backend/package*.json ./
RUN npm ci

COPY backend ./

RUN npm run build

RUN npx prisma generate

RUN npm prune --production

ENV NODE_ENV=production
EXPOSE 3000
# Express already binds to 0.0.0.0 via bin/www
CMD ["npm", "start"]
