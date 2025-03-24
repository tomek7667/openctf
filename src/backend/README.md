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
