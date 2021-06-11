FROM node:14-alpine AS development

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

RUN yarn build

################
## PRODUCTION ##
################

FROM node:14-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY --from=development /usr/src/app/ .

EXPOSE 8080

CMD [ "node", "dist/main" ]
