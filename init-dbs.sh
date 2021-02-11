#!/bin/bash

./db/create-dbs.sh
./db/run-migrations.sh

docker kill postgres
