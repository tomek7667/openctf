# backend

## environment variables

whenever new env var is used in the code add it in the following table

| Name                     | Description                                                                                                                     | Required to be changed |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| `ADMIN_SERVICE_PASSWORD` | Password of an `admin` user that is created in the database. If none provided, `Password123!` will be used.                     | [x]                    |
| `POSTGRES_HOST`          | Just the host part of the postgres database. If on the same server keep default: `127.0.0.1`                                    | [ ]                    |
| `POSTGRES_PORT`          | Just the port part of the postgres database. If Default: `30001`                                                                | [ ]                    |
| `POSTGRES_USER`          | Username of the openctf backend postgresql user. Default: `localuser`                                                           | [x]                    |
| `POSTGRES_DB`            | Openctf database name. Default: `postgres`                                                                                      | [ ]                    |
| `POSTGRES_PASSWORD`      | Password of the openctf backend postgresql user. Default: `localpassword`                                                       | [x]                    |
| `SSL_MODE`               | If the database supports SSL. Value for sslmode parameter in psql. Default: `disable`                                           | [ ]                    |
| `PORT`                   | Direct port that the rest of openctf will listen on. Default: `7999`                                                            | [ ]                    |
| `ENVIRONMENT`            | Just the name of the environment running on. Recommended to be changed to `production` when run on prod. Default: `development` | [ ]                    |
| `LOG_LEVEL`              | Case insensitive logging level for `slog` package _(available: `ERROR`, `WARN`, `INFO`)_. Default: `DEBUG`                      | [ ]                    |
| `LOKI_ENDPOINT`          | The endpoint of the loki instance if it's set up. If none given, tint logging will be used.                                     | [ ]                    |
| `LOKI_USERNAME`          | The username of the loki instance if it's set up.                                                                               | [ ]                    |
| `LOKI_PASSWORD`          | The password of the loki instance if it's set up.                                                                               | [ ]                    |
| `APP_NAME`               | Just the app name for logging purposes                                                                                          | [ ]                    |
| `JWT_SECRET`             | JWT secret used for getting and verifying the JWT token used for authentication. Default: `8c7fafb856380624fa60b22e7baf311d`    | [x]                    |
| `GIN_MODE`               | Gin _(library for rest)_ running mode. When in prod, this value must be `release`. Default: `debug`                             | [x]                    |

## models

[entgio docs](https://entgo.io/docs/)

- To codegen the models after adding a new model / modifying:

```sh
go generate ./ent
```

- To add a new model:

```sh
go run -mod=mod entgo.io/ent/cmd/ent new <UpperCamelCaseModelName>
```
