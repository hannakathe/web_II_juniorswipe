# Pruebas del backend

Las pruebas usan pytest y el cliente de pruebas de Flask, con una base de datos SQLite en memoria que se crea y se borra en cada prueba.

```bash
cd backend
pytest
```

Resultado esperado: **32 passed**. La primera ejecución tarda alrededor de un minuto porque cada prueba vuelve a calcular el hash de las contraseñas de las cuentas de prueba.

| Archivo | Qué verifica | Pruebas |
|---|---|---|
| `tests/test_auth.py` | Registro, correo repetido, contraseña corta, inicio de sesión, contenido del token (sin contraseña), token ausente, inválido, vencido y de usuario borrado | 10 |
| `tests/test_health.py` | `/api/health` y la ruta raíz | 2 |
| `tests/test_profile_cv.py` | Lectura y edición del perfil, perfil sin sesión, creación de CV y que otra cuenta no lo vea, subida y descarga de un archivo | 4 |
| `tests/test_projects.py` | Crear, título obligatorio, cada cuenta ve solo sus proyectos, acceso por id ajeno (404), paginación, búsqueda `?q=` y filtro `?status=`, edición y borrado | 7 |
| `tests/test_roles.py` | El talento junior sube CV, la empresa no (403), la empresa sí crea proyectos, CV sin token (401) | 4 |
| `tests/test_tasks.py` | Crear y listar actividades, estado inválido (422), actividad en proyecto ajeno (404), lista sin sesión, ruta anidada `/api/projects/:id/tasks` | 5 |

Estilo de código: `flake8 .` debe terminar sin mensajes.
