# Decisiones técnicas del backend
 
Complementa las decisiones del frontend (`decisiones.md`). Mismo formato: contexto → decisión → consecuencias.
 
## DT-B1 · Flask para la API REST
 
**Contexto.** El equipo de backend trabaja en Python y el MVP necesita autenticación, roles y CRUD sencillos.
 
**Decisión.** Flask con *application factory*, un blueprint por recurso, SQLAlchemy como ORM y PyJWT para los tokens.
 
**Consecuencias.** Pocas dependencias y una estructura que se prueba con el cliente de pruebas de Flask. SQLAlchemy permite usar SQLite en desarrollo y PostgreSQL en despliegue cambiando solo `DATABASE_URL`.
 
## DT-B2 · Autenticación con JWT en el encabezado
 
**Contexto.** El frontend y la API corren en puertos distintos (5173 y 5000).
 
**Decisión.** Token JWT firmado con HS256, de una hora de duración, enviado en `Authorization: Bearer`. CORS limitado a los orígenes del frontend definidos en `CORS_ORIGINS`.
 
**Consecuencias.** La API no guarda sesiones en el servidor. El token lleva solo id, correo y rol; la contraseña se guarda con hash pbkdf2 y nunca sale de la base de datos.
 
## DT-B3 · SQLite en desarrollo
 
**Contexto.** Cada integrante debe poder ejecutar la API sin instalar un servidor de base de datos.
 
**Decisión.** Si `DATABASE_URL` está vacío, la API usa `backend/juniorswipe_dev.db` (SQLite) y crea las tablas y las cuentas de prueba al arrancar. Las pruebas usan SQLite en memoria.
 
**Consecuencias.** La API funciona con `pip install` y `python run.py`. El esquema para PostgreSQL queda en `database/schema.sql` para la fase de despliegue.
 
## DT-B4 · Archivos de CV en disco
 
**Contexto.** Guardar archivos binarios dentro de la base de datos la hace pesada y lenta de respaldar.
 
**Decisión.** El archivo se guarda en `STORAGE_DIR` con un nombre único (`<usuario>/<uuid>_<nombre>`), y en la tabla `resumes` solo queda esa ruta, el tipo y el tamaño.
 
**Consecuencias.** Solo se aceptan PDF, Word, texto y Markdown de hasta 5 MB. Al borrar un CV se borra también su archivo.
