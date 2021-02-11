#!/bin/bash
source .env

docker run \
-v `pwd`/db/data:/var/lib/postgresql/data \
-v `pwd`/db/init.sh:/docker-entrypoint-initdb.d/init.sh \
-e POSTGRES_PASSWORD=${POSTGRES_ROOT_PW} \
-e BADGES_PASSWORD=${POSTGRES_BADGES_PW} \
-e EVENTS_PASSWORD=${POSTGRES_EVENTS_PW} \
-e ACCOUNTS_PASSWORD=${POSTGRES_ACCOUNTS_PW} \
-e PRESENTATIONS_PASSWORD=${POSTGRES_PRESENTATIONS_PW} \
-p 5432:5432 \
-d --rm --name postgres postgres

while [ "$(($(docker logs postgres 2>&1 | grep -o "ready to accept" | wc -l)))" -lt "2" ]; do
  sleep 3
done

