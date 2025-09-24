ARG NODE_VERSION=lts-alpine
FROM node:${NODE_VERSION}

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g nodemon

COPY prisma ./prisma

COPY . .

RUN npx prisma generate

EXPOSE 8001 

CMD ["npm", "run", "dev"]
