ARG NODE_VERSION=lts-alpine

FROM node:${NODE_VERSION}

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000

CMD [ "npm","run", "dev" ]