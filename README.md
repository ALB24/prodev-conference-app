# Conference GO!: A Professional Development Application

This is a monolithic application that uses a traditional frontend/backend
architecture providing conference management functionality. To run it locally,
please read the instructions in each project's README files.

- [Frontend README](./frontend/README.md)
- [Backend README](./backend/README.md)

## DBs
We have one instance of postgres with 4 databases.  Each service has its own db user.  To create the dbs, users, and perform migrations for each service, create a `.env` file in the project root using `example.env`. Currently, each service has its own `.env` as well that the migrations will use.
