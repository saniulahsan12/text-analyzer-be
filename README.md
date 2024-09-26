## Installation

```bash
$ npm install
```

## Swawgger Documentation
```
http://localhost:3313/docs
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## create network

```
# dev docker mode with and without Logging in console

$ docker-compose -f docker-compose.dev.yml --env-file .env.dev up
$ docker-compose -f docker-compose.dev.yml --env-file .env.dev up --build -d
$ docker-compose -f docker-compose.dev.yml --env-file .env.dev down
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deploy to Production Server

```bash
$ docker-compose -f docker-compose.prod.yml --env-file .env.prod up --build -d
```
