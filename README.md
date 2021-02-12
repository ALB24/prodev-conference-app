# Conference GO!: A Professional Development Application

This is a monolithic application that uses a traditional frontend/backend
architecture providing conference management functionality. To run it locally,
please read the instructions in each project's README files.

- [Frontend README](./frontend/README.md)
- [Backend README](./backend/README.md)

## DBs
We have one instance of postgres with 4 databases.  Each service has its own db user.  To create the dbs, users, and perform migrations for each service, create a `.env` file in the project root using `example.env` and _make sure that your local Postgres is stopped_, (because the migrations will be trying to reach a Docker container through a mapped port) and run `./init-db.sh`.

This should create 4 databases and users, and run the migrations in each service's directory. If you need to start over because you have changed the migrations, you can make sure your containers are stopped and run:

```bash
rm -rf db/data
./init-db.sh
```

