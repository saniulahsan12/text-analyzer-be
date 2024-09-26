#stage 1
FROM node:18.12.0 as buildContainer
ARG NODE_ENV=prod
ENV NODE_ENV=${NODE_ENV}
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install glob rimraf
RUN npm install --ignore-scripts

COPY . .

RUN npm run build

#stage 2
FROM node:18.12.0-alpine
ARG NODE_ENV=prod
ENV NODE_ENV=${NODE_ENV}
WORKDIR /app
COPY --from=buildContainer /app /app

COPY ./dockerfiles/scripts/prod/start /start
RUN sed -i 's/\r//' /start
RUN chmod +x /start
