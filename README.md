# cron-download-dashboard

```sh
    npx knex migrate:latest --knexfile knexfile.js && npx knex seed:run --knexfile knexfile.js && npm run start
```

docker compose --env-file .env -f docker-compose.with-etcd.yaml up -d

docker compose --env-file .env -f docker-compose.no-etcd.yaml up -d