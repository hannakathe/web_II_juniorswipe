# Backend · API REST de JuniorSwipe
 
API en Flask que atiende al frontend de JuniorSwipe: autenticación con JWT, perfiles, proyectos, actividades y CV.
 
## Requisitos
 
- Python 3.12 o superior.
- No hace falta instalar una base de datos: en desarrollo la API usa un archivo SQLite que crea sola.
 
## Instalación
 
```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# Linux / macOS
source .venv/bin/activate
pip install -r requirements-dev.txt
cp .env.example .env
```
 
## Ejecución
 
```bash
python run.py
```
 
La API queda en http://localhost:5000. Para comprobar que responde: http://localhost:5000/api/health.
 
Al arrancar crea las tablas y dos cuentas de prueba (solo para desarrollo):
 
| Tipo de cuenta | Correo | Contraseña |
|---|---|---|
| Talento junior (`developer`) | `dev@local.test` | `Password123!` |
| Empresa (`company`) | `company@local.test` | `Password123!` |
 
## Variables de entorno
 
| Variable | Valor por defecto | Para qué sirve |
|---|---|---|
| `SECRET_KEY`, `JWT_SECRET` | `dev-secret-change-me` | Claves para firmar los tokens |
| `JWT_EXPIRES_SECONDS` | `3600` | Duración de la sesión en segundos |
| `DATABASE_URL` | vacío (SQLite) | Cadena de conexión a PostgreSQL |
| `CORS_ORIGINS` | `http://localhost:5173,…` | Orígenes del frontend que pueden llamar a la API |
| `SEED_ON_STARTUP` | `true` | Crea roles y cuentas de prueba al arrancar |
| `STORAGE_DIR` | `./storage` | Carpeta donde se guardan los archivos de CV |
| `MAX_UPLOAD_BYTES` | `5242880` | Tamaño máximo de un archivo (5 MB) |
 
## Pruebas y calidad
 
```bash
pytest          # pruebas automáticas
flake8 .        # estilo de código
```
 
La documentación de la arquitectura está en `documentacion/arquitectura/backend.md`.