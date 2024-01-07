## Steps To run localy on your machine and development mode
 after clone this repo follow:
## craete an enviroment file (.env)
 1- rename the ( .env.example ) file to be .env
 <br>
 2- add required connection for your DB variable. here using (postgreSQL)

## Installation

```bash
$ npm install
```
## Building the app

```bash
$ npm run build
```
## Running the app

```bash
# watch mode
$ npm run start:dev
```

## To view APIs Documentation and Test Inputs/Outputs
- open in your browser while project is running [http://localhost:3000/api] for swagger.

<br>

## Running Migrations
Hint: first check in db.config.ts file for typeorm config ( synchronize: true ) 
>> it must be false to run migration successfully.

1- run build app script 
```bash
$ npm run build
```
<br>
2- run migration script

```bash
$ npm run db:run
```
<br> 

## Docker

```bash
$ docker-compose up
```

