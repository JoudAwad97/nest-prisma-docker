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

COPY --from=BUILD_IMAGE /prisma-api/dist ./dist
COPY ["package.json", "yarn.lock","entrypoint.sh", "./"]

RUN yarn install --production

COPY --from=BUILD_IMAGE /prisma-api/node_modules/.prisma ./node_modules/.prisma

# Schema and Migrations
COPY prisma ./prisma

EXPOSE 5000

RUN chmod +x entrypoint.sh

ENTRYPOINT ["/prisma-api/entrypoint.sh"]

CMD yarn start:prod