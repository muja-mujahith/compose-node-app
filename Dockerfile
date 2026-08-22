FROM node:22-alpine

ARG APP_VERSION=1.0

ENV APP_ENV=development

WORKDIR /app

COPY package.json .

RUN npm install

COPY server.js .


CMD ["node", "server.js"]