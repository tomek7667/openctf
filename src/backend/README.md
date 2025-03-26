# backend

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

## routing

the project currently provides handful of utility functions and already has an established way of adding new routes. Note: `/api` will be called 0th level route, `/api/example` will be called 1st level route and `/api/example/something` will be called 2nd level route. Few rules that are currentl established:

- all API routes start with `/api`
- if a new 1nd level route is added, it must be via a go file in `internal/openctf/exampleroute.go` _(all lowercase together, no dashes even if the route has some.)_
- the 1nd level route file _(`internal/openctf/exampleroute.go`)_ contains just the `AddRoutes_ApiExampleRoute` function with `h.RestClient.AddRateLimitedRoute(...)` inside of it and a logging statement about registering such route at the beginning of the function.
- in order to add 2nd level route called `something`, you should:
  1. create a file called `internal/openctf/exampleroute_something.go`
  2. create a function in the created file `func (h *Handler) ExampleRouteSomething(ctx *gin.Context, ...) {` - this should handle you all logic related to the request/response.
  3. add the route with one of the `AddRoute` rest client methods, with any middlewares or wrappers you'd like: `h.RestClient.AddRateLimitedRoute("POST", "/api/example-route/something", ratelimit.InMemoryOptions{}, h.WithAuth(h.ExampleRouteSomething))`
- the direct interaction with the database, should be implemented as a `ServiceClient` function in `internal/service`, which can be then called with `Handler.ServiceClient.Something` in the request/response logic layer in `internal/openctf/exampleroute_something.go`

### utility functions

`RestClient`'s `AddRateLimitedRoute` allows to add a route with rate limitting already implemented with the use of [gin-rate-limit package _(external link)_](https://github.com/JGLTechnologies/gin-rate-limit).

```go
AddRateLimitedRoute(
    method, path string,
    opts ratelimit.InMemoryOptions,
    handlers ...gin.HandlerFunc,
)
```

`RestClient`'s `AddRoute` is just a wrapper around the [`*gin.Engine`'s `Handle` _(external link)_](https://pkg.go.dev/github.com/gin-gonic/gin@v1.10.0#RouterGroup.Handle) method.

```go
AddRoute(method, path string, handlers ...gin.HandlerFunc)
```

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
