FROM node:14-alpine

RUN apk update
RUN apk add bash
RUN apk add openssl

WORKDIR /usr/app

COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock

RUN yarn

COPY ./common ./common
COPY ./auth ./auth
COPY ./scripts ./scripts
COPY ./tsconfig.json ./tsconfig.json

RUN yarn build

RUN rm -rf node_modules
RUN yarn --production=true
RUN ls -a | \
    grep -v -x '\.' | \
    grep -v -x '\.\.' | \
    grep -v build | \
    grep -v scripts | \
    grep -v node_modules | \
    xargs rm -rf

RUN which bash

RUN ls -la

VOLUME ./certs

ENTRYPOINT ./scripts/generate-certificate.sh && node build/auth/index.js