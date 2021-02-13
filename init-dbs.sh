#!/bin/bash
source .env

FLAG=$1

NUM_ACCEPTS=2

if [ "$FLAG" == "-reset" ]; then
  echo "RESET"
  NUM_ACCEPTS=1
fi

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

while [ "$(($(docker logs postgres 2>&1 | grep -o "ready to accept" | wc -l)))" -lt "$NUM_ACCEPTS" ]; do
  sleep 3
done

export PGAPPNAME="Conference GO"
export PGHOST=localhost
export PGPORT=5432

export PGDATABASE=badges
export PGUSER=badges_user
export PGPASSWORD=$POSTGRES_BADGES_PW
cd badges
npm i
npm run migrate -- up

export PGDATABASE=accounts
export PGUSER=accounts_user
export PGPASSWORD=$POSTGRES_ACCOUNTS_PW
cd ../accounts
npm i
npm run migrate -- up

export PGDATABASE=presentations
export PGUSER=presentations_user
export PGPASSWORD=$POSTGRES_PRESENTATIONS_PW
cd ../presentations
npm i
npm run migrate -- up

export PGDATABASE=events
export PGUSER=events_user
export PGPASSWORD=$POSTGRES_EVENTS_PW
cd ../events
npm i
npm run migrate -- up

docker kill postgres
