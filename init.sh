#!/bin/sh

npm run knex migrate:latest
npm run knex seed:run

exec "$@"
