# cron-download-dashboard

```sh
    npx knex migrate:latest --knexfile knexfile.js && npx knex seed:run --knexfile knexfile.js && npm run start
```

docker compose --env-file .env  up -d

docker volume rm cron-download-dashboard_etcd_data
docker volume rm cron-download-dashboard_dragonfly_data
sudo rm -rf /mnt/data/pgdb-