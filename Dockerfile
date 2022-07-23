# BASE
FROM node:14-alpine@sha256:43ec2ba01c2a245e341489956258afd3535a9ebfdf87ade04b84299ca736607f as node
WORKDIR /app
COPY package*.json ./
RUN wget -O /usr/local/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.2.5/dumb-init_1.2.5_x86_64
RUN chmod +x /usr/local/bin/dumb-init

# DEV
FROM node as dev
RUN npm ci
COPY ./tsconfig.json .
CMD dumb-init /bin/sh -c "npx ts-node-dev --transpile-only ./src/index.ts | npx pino-pretty -c"

# PROD
FROM node as prod-npm
RUN npm ci --production 

FROM dev as prod-build 
COPY ./src src/
RUN npx tsc

FROM prod-npm as prod
COPY --from=prod-build /app/build/ /app/
COPY ./src/static /app/static/
CMD ["dumb-init", "node", "index.js"]