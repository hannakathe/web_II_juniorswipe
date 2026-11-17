# Base de datos

| Entorno | Motor | Cómo se crea |
|---|---|---|
| Desarrollo local y pruebas | SQLite (`backend/juniorswipe_dev.db`, `:memory:` en pytest) | `db.create_all()` al arrancar la API + `seed()` |
| Fase posterior (despliegue) | PostgreSQL 16 | `schema.sql` + `seed.sql`, o `db.create_all()` |

## Crear la base en PostgreSQL desde cero

```bash
export DATABASE_URL=postgresql://juniorswipe:juniorswipe@localhost:5432/juniorswipe
psql "$DATABASE_URL" -f database/schema.sql
psql "$DATABASE_URL" -f database/seed.sql
```

En desarrollo no hace falta: si `DATABASE_URL` está vacío, la API usa SQLite y crea los datos de prueba sola.

## Entidades

- `roles` 1─N `users`
- `users` 1─1 `profiles`
- `users` 1─N `resumes` (datos del CV; el archivo queda en `STORAGE_DIR`)
- `users` 1─N `projects` 1─N `tasks`

Cada fila de `projects`, `tasks`, `resumes` y `profiles` pertenece a un solo usuario, y la API no deja que otro usuario la lea ni la modifique.
