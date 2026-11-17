# API REST

URL base en desarrollo: `http://localhost:5000`. Todas las respuestas son JSON. Las rutas marcadas con 🔒 necesitan el encabezado `Authorization: Bearer <token>`.

## Autenticación

| Método | Ruta | Cuerpo | Respuesta |
|---|---|---|---|
| POST | `/api/auth/register` | `{ email, password, full_name, role }` (`role`: `developer` o `company`) | 201 `{ token, user }` |
| POST | `/api/auth/login` | `{ email, password }` | 200 `{ token, user }` |
| GET 🔒 | `/api/auth/me` | — | 200 usuario con su perfil |

Ejemplo:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"dev@local.test","password":"Password123!"}'
```

## Usuarios y perfiles

| Método | Ruta | Uso |
|---|---|---|
| GET 🔒 | `/api/users/me` | Usuario con perfil, cantidad de CV y de proyectos (para el panel) |
| GET 🔒 | `/api/profiles/me` | Perfil del usuario |
| PUT 🔒 | `/api/profiles/me` | Actualiza `headline`, `bio`, `location`, `website`, `company_name` y `skills` (lista) |

## Proyectos

| Método | Ruta | Uso |
|---|---|---|
| GET 🔒 | `/api/projects` | Lista paginada. Filtros: `?q=` (título), `?status=`, `?page=`, `?per_page=` |
| POST 🔒 | `/api/projects` | Crea un proyecto: `{ title, description, status, tech_stack }` |
| GET 🔒 | `/api/projects/:id` | Detalle con sus actividades |
| PATCH 🔒 | `/api/projects/:id` | Edita los campos enviados |
| DELETE 🔒 | `/api/projects/:id` | Borra el proyecto y sus actividades (204) |

Respuesta de una lista:

```json
{ "items": [ { "id": 1, "title": "Rebranding de cafetería", "status": "active", "task_count": 3 } ],
  "page": 1, "per_page": 20, "total": 1 }
```

## Actividades

| Método | Ruta | Uso |
|---|---|---|
| GET 🔒 | `/api/tasks` | Lista paginada. Filtros: `?project_id=`, `?status=` |
| POST 🔒 | `/api/tasks` | Crea: `{ project_id, title, description, status, priority, due_date }` (`due_date` en AAAA-MM-DD) |
| GET 🔒 | `/api/projects/:id/tasks` | Actividades de un proyecto |
| POST 🔒 | `/api/projects/:id/tasks` | Crea una actividad dentro del proyecto |
| PATCH 🔒 | `/api/tasks/:id` | Edita (por ejemplo, cambia el estado) |
| DELETE 🔒 | `/api/tasks/:id` | Borra (204) |

## CV

| Método | Ruta | Uso |
|---|---|---|
| GET 🔒 | `/api/resumes` | Lista; el principal aparece primero |
| POST 🔒 | `/api/resumes` | Solo cuentas `developer`. `multipart/form-data` con `title`, `summary` y `file` (PDF, Word, texto; máx. 5 MB) |
| PATCH 🔒 | `/api/resumes/:id` | Cambia `title`, `summary` o lo marca como principal con `is_primary: true` |
| DELETE 🔒 | `/api/resumes/:id` | Borra el CV y su archivo (204) |
| GET 🔒 | `/api/resumes/:id/file` | Descarga el archivo |

## Estado del servicio

| Método | Ruta | Respuesta |
|---|---|---|
| GET | `/api/health` | 200 `{ "status": "ok", "database": true }` |

## Errores

Todas las respuestas de error tienen la forma `{ "error": { "code", "message", "details" } }`. Los códigos están descritos en `backend.md`.
