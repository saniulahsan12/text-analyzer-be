## 1. Swagger Documentation fo API
```
http://localhost:3313/docs
```
> API endpoints with data are there for testing
* First login to an account
* Generate access token and save in swagger
* Create a paragraph
* Run the other API's for the analyze
* Optional: if you want to access database can visit: http://localhost:8080/ [u/p : admin/admin]

## 2. Running Application on Dev Mode

```
# dev docker mode with and without Logging in console

$ docker-compose -f docker-compose.dev.yml --env-file .env.dev up
$ docker-compose -f docker-compose.dev.yml --env-file .env.dev up --build -d
$ docker-compose -f docker-compose.dev.yml --env-file .env.dev down
```

## 3. Running Test

```bash
# unit tests
$ docker exec -ti text-analyzer-be-text_analyzer_api-1 bash -c 'npm run test'
# test coverage
$ docker exec -ti text-analyzer-be-text_analyzer_api-1 bash -c 'npm run test:cov'
```

## 4. Build & Deploy for Production Server (Not needed)

```bash
$ docker-compose -f docker-compose.prod.yml --env-file .env.prod up --build -d
```
