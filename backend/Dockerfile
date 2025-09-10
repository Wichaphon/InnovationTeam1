ARG NODE_VERSION=lts-alpine
FROM node:${NODE_VERSION}

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY prisma ./prisma

COPY . .

RUN npx prisma generate

EXPOSE 8001

CMD ["npm", "run", "dev"]
