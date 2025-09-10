FROM node:22.19-alpine

RUN apk add --no-cache bash python3 make g++

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["sh", "-c", "npx knex migrate:latest --knexfile knexfile.js && npx knex seed:run --knexfile knexfile.js && npm run start"]