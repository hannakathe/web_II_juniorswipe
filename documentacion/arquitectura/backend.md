# Arquitectura del backend
 
La API usa el patrón *application factory* de Flask: la función `create_app()` arma la aplicación, configura CORS y la base de datos, y registra un blueprint por recurso. Así la misma aplicación se crea con la configuración de desarrollo (`python run.py`) o con la de pruebas (`create_app("test")`, base de datos en memoria).
 
## Estructura
 
```
backend/
├── run.py                 Arranque en desarrollo
├── requirements.txt       Dependencias de la API
├── requirements-dev.txt   Dependencias de pruebas y estilo
├── .env.example           Plantilla de variables de entorno
└── app/
    ├── __init__.py        create_app(): CORS, base de datos, blueprints y datos de prueba
    ├── config.py          Configuración leída de variables de entorno (Config y TestConfig)
    ├── extensions.py      Instancia compartida de SQLAlchemy
    ├── errors.py          ApiError y respuestas de error en JSON
    ├── security.py        Hash de contraseñas, creación y lectura de JWT, decoradores de acceso
    ├── validation.py      Validación del cuerpo de las peticiones y paginación
    ├── seed.py            Roles y cuentas de prueba
    ├── models/            User, Role, Profile, Project, Task, Resume
    └── routes/            Un blueprint por recurso
```
 
## Capas
 
| Capa | Archivos | Responsabilidad |
|---|---|---|
| Rutas | `routes/*.py` | Reciben la petición, validan, llaman a los modelos y responden JSON |
| Seguridad | `security.py` | `jwt_required` exige un token válido; `roles_required("developer")` además exige un rol |
| Validación | `validation.py` | Campos obligatorios, formato de correo y fecha, valores permitidos |
| Modelos | `models/*.py` | Tablas y relaciones con SQLAlchemy; cada modelo tiene `to_dict()` para responder |
| Errores | `errors.py` | Toda respuesta de error tiene la forma `{ "error": { "code", "message" } }` |
 
## Formato de los errores
 
El `code` es estable y el frontend lo usa para mostrar mensajes en español; el `message` sirve para depurar.
 
```json
{ "error": { "code": "email_taken", "message": "Ese correo ya está registrado" } }
```
 
| Código HTTP | `code` | Cuándo |
|---|---|---|
| 401 | `token_missing`, `token_invalid`, `token_expired`, `user_not_found` | Problemas con la sesión |
| 401 | `invalid_credentials` | Correo o contraseña incorrectos |
| 403 | `forbidden` | El rol no tiene permiso (por ejemplo, una empresa que intenta subir un CV) |
| 404 | `not_found` | El recurso no existe o pertenece a otra persona |
| 409 | `email_taken` | El correo ya está registrado |
| 422 | `validation_error` | Faltan campos o tienen un formato inválido |
 
## Aislamiento entre cuentas
 
Cada consulta filtra por el usuario del token. Si alguien pide el proyecto, la actividad o el CV de otra persona cambiando el id en la URL, la API responde 404, igual que si no existiera, para no revelar qué ids están ocupados.
