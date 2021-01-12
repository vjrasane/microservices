FROM node:14-alpine

RUN apk update
RUN apk add bash
RUN apk add openssl

WORKDIR /var/lib

COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock

RUN yarn

COPY ./common ./common
COPY ./api ./api
COPY ./types ./types
 COPY ./tsconfig.json ./tsconfig.json

RUN yarn build

RUN rm -rf node_modules
RUN yarn --production=true
RUN ls -a | \
    grep -v -x '\.' | \
    grep -v -x '\.\.' | \
    grep -v build | \
    grep -v node_modules | \
    xargs rm -rf

RUN ls -la

VOLUME ./certs

ENTRYPOINT node build/api/index.js