FROM node:16.15.1-alpine AS BUILD_IMAGE

WORKDIR /prisma-api

COPY ["package.json", "yarn.lock", "./"]

COPY prisma ./prisma

RUN yarn

COPY . .

ENV NODE_ENV=production

RUN yarn prisma:generate

RUN yarn build

FROM node:16.13.2-alpine
WORKDIR /prisma-api
ENV NODE_ENV=production

RUN yarn install --production

COPY --from=BUILD_IMAGE /prisma-api/package.json ./
COPY --from=BUILD_IMAGE /prisma-api/dist ./dist

EXPOSE 5000

CMD yarn start:prod