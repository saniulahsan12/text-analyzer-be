
FROM node:18.12.0

ARG NODE_ENV=dev
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install glob rimraf
RUN npm install

COPY . .

COPY ./dockerfiles/scripts/dev/start /start
RUN sed -i 's/\r//' /start
RUN chmod +x /start
