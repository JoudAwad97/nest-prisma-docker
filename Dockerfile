FROM node:16.15.1-alpine AS builder

WORKDIR /prisma-api

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

RUN yarn prisma:generate

RUN yarn build

EXPOSE 5000

CMD yarn start:prod