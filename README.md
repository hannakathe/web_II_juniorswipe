# JuniorSwipe

Plataforma web que conecta talento junior con empresas que buscan perfiles de entrada, a partir de evidencias reales de trabajo en lugar de años de experiencia.

Proyecto de Ingeniería Web II · Fase II: evolución del repositorio y desarrollo del producto web.

## Información general

### Descripción

JuniorSwipe es una plataforma web que conecta a talento junior (estudiantes de últimos semestres y recién graduados, sin experiencia laboral o con poca) con empresas que buscan perfiles de entrada, en cualquier área profesional: ingeniería, diseño, administración, salud, comunicación, entre otras.

Las empresas suelen pedir experiencia que un recién graduado todavía no tiene. JuniorSwipe resuelve ese problema reemplazando el CV genérico por evidencias verificables: proyectos académicos, prácticas, voluntariados, trabajos de grado o proyectos personales que muestran lo que el candidato sabe hacer. Así las empresas evalúan el potencial real de cada candidato, y los juniors reciben una hoja de ruta de empleabilidad para conseguir su primer empleo.

### Problemática

Las vacantes de nivel de entrada piden experiencia previa, y quien acaba de graduarse no puede mostrarla en un CV tradicional. Lo que sí tiene (un trabajo de grado, una práctica, un voluntariado) queda reducido a una línea del CV o ni siquiera aparece. Del otro lado, las empresas reciben muchas hojas de vida parecidas y no tienen cómo comparar lo que cada candidato sabe hacer.

### Objetivo

Facilitar la inserción laboral de estudiantes y recién graduados de cualquier disciplina con un perfil profesional basado en evidencias (proyectos, actividades y habilidades) que compense la falta de experiencia laboral formal.

Objetivos secundarios:

1. Para candidatos junior: construir un portafolio centralizado (perfil, habilidades, proyectos, actividades y CV) que muestre su formación práctica, sea cual sea su carrera.
2. Para empresas: encontrar candidatos de nivel de entrada prefiltrados por habilidades y área profesional, y ahorrar tiempo en reclutamiento.
3. Empleabilidad: detectar brechas entre el perfil del candidato y lo que pide el mercado, y sugerir proyectos o actividades para cerrarlas.
4. Matching: conectar candidatos y ofertas según su compatibilidad, con IA en fases futuras.

### Alcance del MVP

| Módulo | Funcionalidad |
|---|---|
| Landing page | Presentación de la plataforma para candidatos junior y empresas de cualquier sector |
| Autenticación | Registro e inicio de sesión con correo y contraseña, sesión con JWT y contraseñas cifradas |
| Roles | Dos tipos de usuario: candidato (estudiante o recién graduado) y empresa |
| Perfil | Titular, biografía, ubicación, sitio web, habilidades y nombre de la empresa (solo en perfiles de empresa) |
| Proyectos / evidencias | CRUD de proyectos académicos, prácticas, voluntariados o proyectos personales, con descripción, herramientas aplicadas y estado |
| Actividades | CRUD de tareas o entregables dentro de cada proyecto, con estado, prioridad y fecha |
| CV | Subida y gestión de CV, y elección de uno como principal |
| Panel | Área interna en React para gestionar todo lo anterior |

Fuera del alcance del MVP (fases futuras): matching automático con IA, extracción de habilidades desde el CV, análisis de brechas por área profesional, publicación de ofertas por parte de las empresas, notificaciones e inicio de sesión con Google o LinkedIn.

El MVP se cumple cuando un estudiante o recién graduado de cualquier carrera puede registrarse, completar su perfil con habilidades, registrar proyectos con sus actividades y subir su CV, todo guardado en la base de datos y visible desde su panel.

## Información técnica

### Tecnologías

| Capa | Tecnología | Versión |
|---|---|---|
| Frontend | React + React Router | 19 · 7 |
| Empaquetador | Vite | 8 |
| Estilos | CSS3 propio con variables (sin framework) | — |
| Pruebas frontend | Vitest + Testing Library + jsdom | 5 |
| Calidad de código | ESLint (reglas de React Hooks y React Refresh) | 10 |
| Backend | Python + Flask + Flask-SQLAlchemy + PyJWT | 3.12+ · 3.1 |
| Pruebas backend | pytest + flake8 | 8 · 7 |
| Base de datos | SQLite en desarrollo, PostgreSQL en despliegue | — |

### Arquitectura

El proyecto es una aplicación cliente-servidor. El frontend es una SPA (single page application) en React que se comunica con una API REST en Flask mediante JSON y un token JWT en el encabezado `Authorization`. La API guarda los datos con SQLAlchemy y los archivos de CV en disco.

```
Navegador ──► Frontend React (Vite, puerto 5173)
                 │  fetch + JSON + Authorization: Bearer <JWT>
                 ▼
              API REST Flask (puerto 5000)  ──►  SQLite / PostgreSQL
                 │
                 └─► carpeta storage/ (archivos de CV)
```

Dentro del frontend el código está separado por responsabilidad:

- `pages/` arma cada pantalla, carga los datos y decide qué pasa al enviar un formulario.
- `components/` tiene piezas visuales reutilizables, sin llamadas a la API.
- `services/` es la única capa que habla con la API (cliente HTTP y un servicio por recurso).
- `hooks/` guarda la lógica reutilizable de estado (formularios, efectos de la landing).
- `utils/` contiene funciones puras (validaciones y formato) que se prueban sin navegador.
- `models/` reúne los valores del dominio (roles, estados de proyecto, reglas del CV).
- `context/` maneja el estado global: la sesión (`AuthContext`) y las notificaciones (`ToastContext`).

El detalle, con diagramas, está en [arquitectura del frontend](documentacion/arquitectura/arquitectura.md), [arquitectura del backend](documentacion/arquitectura/backend.md), [API REST](documentacion/arquitectura/api-rest.md) y [diagramas](documentacion/diagramas/diagramas.md).

### Estructura de carpetas

```
web_II_juniorswipe/
├── README.md
├── .gitignore
├── frontend/                  Aplicación React
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js         Configuración de Vite y Vitest
│   ├── eslint.config.js
│   ├── public/                Archivos estáticos (favicon)
│   ├── src/
│   │   ├── main.jsx           Punto de entrada
│   │   ├── App.jsx            Rutas de la aplicación
│   │   ├── assets/            Logos, íconos e imágenes
│   │   ├── components/
│   │   │   ├── landing/       Secciones de la página principal
│   │   │   ├── layout/        Estructuras de auth y del panel, rutas protegidas
│   │   │   ├── ui/            Botón, campo, modal, confirmación, paginación, avisos
│   │   │   ├── projects/      Tarjeta, formulario y filtros de proyectos
│   │   │   ├── tasks/         Formulario y fila de actividades
│   │   │   ├── profile/       Formulario y vista previa del perfil
│   │   │   └── resumes/       Carga y fila de CV
│   │   ├── context/           Sesión (AuthContext) y notificaciones
│   │   ├── hooks/             useForm, useDebounce, useDocumentTitle, efectos de la landing
│   │   ├── models/            Constantes del dominio
│   │   ├── pages/             Landing, auth/, app/ y 404
│   │   ├── services/          Cliente HTTP y servicios de la API
│   │   ├── styles/            base, componentes, landing, auth, app y datos
│   │   └── utils/             Validaciones, formato y mensajes de error
│   └── tests/                 Pruebas automáticas (Vitest)
├── backend/                   API REST en Flask
│   ├── run.py                 Arranque en desarrollo
│   ├── app/                   Fábrica, configuración, seguridad, modelos y rutas
│   └── tests/                 Pruebas automáticas (pytest)
├── database/                  Esquema y datos SQL para PostgreSQL
├── documentacion/
│   ├── arquitectura/
│   ├── decisiones_tecnicas/
│   ├── diagramas/
│   ├── diseno/                Guía de estilo
│   ├── pruebas/
│   └── requerimientos/
└── evidencias/                Capturas del proceso (historial de commits)
```

### Dependencias del frontend

| Paquete | Uso |
|---|---|
| `react`, `react-dom` | Librería de interfaz |
| `react-router-dom` | Navegación entre páginas sin recargar |
| `vite`, `@vitejs/plugin-react` | Servidor de desarrollo y build |
| `vitest`, `jsdom`, `@testing-library/*` | Pruebas de componentes y utilidades |
| `eslint` y plugins | Revisión estática del código |

Las versiones exactas quedan fijadas en `frontend/package-lock.json`.

### Dependencias del backend

| Paquete | Uso |
|---|---|
| `Flask` | Servidor web y rutas de la API |
| `Flask-SQLAlchemy`, `SQLAlchemy` | Modelos y acceso a la base de datos |
| `Flask-Cors` | Permite que el frontend (puerto 5173) llame a la API (puerto 5000) |
| `PyJWT` | Creación y verificación de los tokens de sesión |
| `python-dotenv` | Lectura del archivo `.env` |
| `pytest`, `flake8` | Pruebas y estilo de código (solo desarrollo) |

Versiones fijadas en `backend/requirements.txt` y `backend/requirements-dev.txt`.

### Requisitos de ejecución

- Node.js 20 o superior y npm 10 o superior.
- Un navegador actualizado (Chrome, Edge, Firefox o Safari).
- Python 3.12 o superior para el backend.

### Instalación y ejecución

Se necesitan dos terminales: una para la API y otra para el frontend.

**1. Backend (API en http://localhost:5000)**

```bash
git clone https://github.com/hannakathe/web_II_juniorswipe.git
cd web_II_juniorswipe/backend
python -m venv .venv
.venv\Scripts\activate          # Windows · en Linux/macOS: source .venv/bin/activate
pip install -r requirements-dev.txt
copy .env.example .env           # Windows · en Linux/macOS: cp .env.example .env
python run.py
```

Al arrancar, la API crea la base de datos SQLite (`backend/juniorswipe_dev.db`) y las cuentas de prueba. Para comprobar que responde: http://localhost:5000/api/health.

**2. Frontend (aplicación en http://localhost:5173)**

```bash
cd web_II_juniorswipe/frontend
npm install
copy .env.example .env           # Windows · en Linux/macOS: cp .env.example .env
npm run dev
```

| Comando (frontend) | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga automática |
| `npm run build` | Genera la versión de producción en `dist/` |
| `npm run preview` | Sirve el build de producción para revisarlo |
| `npm test` | Ejecuta las pruebas automáticas |
| `npm run lint` | Revisa el código con ESLint |

| Comando (backend, con el entorno activado) | Qué hace |
|---|---|
| `python run.py` | Arranca la API |
| `pytest` | Ejecuta las pruebas automáticas |
| `flake8 .` | Revisa el estilo del código |

### Cuentas de prueba

La API las crea al arrancar (`SEED_ON_STARTUP=true`). Son solo para desarrollo. En la pantalla de inicio de sesión hay dos botones que llenan estos datos.

| Tipo de cuenta | Correo | Contraseña |
|---|---|---|
| Talento junior | `dev@local.test` | `Password123!` |
| Empresa | `company@local.test` | `Password123!` |

### Configuración

| Archivo | Variable | Valor por defecto | Para qué sirve |
|---|---|---|---|
| `frontend/.env` | `VITE_API_URL` | `http://localhost:5000` | URL base de la API |
| `backend/.env` | `JWT_SECRET`, `SECRET_KEY` | valor de desarrollo | Firma de los tokens |
| `backend/.env` | `DATABASE_URL` | vacío (usa SQLite) | Conexión a PostgreSQL |
| `backend/.env` | `CORS_ORIGINS` | `http://localhost:5173,…` | Orígenes que pueden llamar a la API |
| `backend/.env` | `SEED_ON_STARTUP` | `true` | Crea las cuentas de prueba |

Las plantillas son `frontend/.env.example` y `backend/.env.example`. Los archivos `.env` reales no se suben al repositorio. La lista completa de variables del backend está en [backend/README.md](backend/README.md).

### Rutas de la aplicación

| Ruta | Pantalla |
|---|---|
| `/` | Página principal |
| `/login` | Inicio de sesión |
| `/register` | Registro (con `?rol=empresa` abre directamente la cuenta de empresa) |
| `/app` | Panel con resumen, proyectos recientes y siguientes pasos (requiere sesión) |
| `/app/proyectos` | Proyectos / evidencias con búsqueda, filtro y paginación (con `?nuevo=1` abre el formulario) |
| `/app/proyectos/:id` | Detalle de un proyecto con sus actividades |
| `/app/perfil` | Perfil con vista previa |
| `/app/cv` | Carga y lista de CV (solo cuentas de talento junior) |

## Estado del proyecto

### Funcionalidades implementadas

- Página principal con navegación por secciones, menú móvil, animaciones al hacer scroll y pestañas de "Así funciona para ti" (talento junior / empresas). Si hay sesión, el menú muestra "Ir a mi panel".
- Registro con selección de tipo de cuenta, medidor de seguridad de la contraseña, confirmación de contraseña y aceptación de términos. Si el correo ya existe, el error aparece bajo el campo.
- Inicio de sesión con token JWT, botones de cuentas de prueba y regreso a la página que se intentaba abrir.
- Rutas protegidas: sin sesión, `/app/*` lleva al inicio de sesión; la sección de CV es solo para talento junior. Si el token vence, la sesión se cierra sola.
- Panel con datos reales: número de proyectos, actividades hechas, CV y porcentaje de perfil completo.
- CRUD de proyectos: crear y editar en ventana modal, eliminar con confirmación, búsqueda por título, filtro por estado y paginación (9 por página).
- Detalle de proyecto con sus actividades: agregar (con prioridad y fecha límite), cambiar el estado con un clic, filtrar por estado, eliminar y barra de avance.
- Perfil conectado a la API, con vista previa en vivo y campo de nombre de empresa para cuentas de empresa.
- CV: subir con arrastrar y soltar (PDF, Word o texto de hasta 5 MB), marcar como principal, descargar y eliminar.
- Validaciones en todos los formularios con mensajes en español, y traducción de los errores de la API (credenciales, correo repetido, permisos, servidor apagado).
- Estados de carga, vacío y error con botón "Reintentar" en cada lista.
- API REST con 7 grupos de rutas, contraseñas con hash, aislamiento entre cuentas y 32 pruebas automáticas.
- 40 pruebas automáticas del frontend.

### Funcionalidades pendientes

- Cambiar el nombre de la cuenta desde el perfil (la API todavía no lo permite).
- Publicación de vacantes por parte de las empresas y matching con candidatos (fuera del MVP).
- Recuperación de contraseña.

### Avances de la Fase II

| Fase I | Fase II |
|---|---|
| Landing en React que no compilaba (imagen mal importada, capturas faltantes, estilos incompletos) | Landing funcionando, con menú móvil, logo corregido y capturas reales en "Así funciona para ti" |
| Solo la ruta `/` | React Router con 8 rutas, rutas protegidas por sesión y por rol, y página 404 |
| Sin formularios | 6 formularios con validación, conectados a la API |
| Sin backend | API REST en Flask con JWT, roles, CRUD de proyectos, actividades, perfiles y CV |
| Sin base de datos | SQLAlchemy con SQLite en desarrollo y esquema SQL para PostgreSQL |
| Sin pruebas | 40 pruebas del frontend (Vitest), 32 del backend (pytest) y plan de pruebas manuales |
| Documentación en el README | Carpeta `documentacion/` con arquitectura, API, diagramas, requerimientos, pruebas y decisiones técnicas |

### Próximos pasos

1. Permitir editar el nombre de la cuenta y recuperar la contraseña.
2. Publicación de vacantes por parte de las empresas.
3. Despliegue con Docker, base de datos PostgreSQL y pipeline de integración continua.

## Equipo

| Integrante | Responsabilidad |
|---|---|
| Hannah K. Abril | Frontend completo (React), diseño de interfaz, documentación y pruebas del frontend |
| Steven Lopez | Backend parte 1: configuración de Flask, modelos, seguridad JWT, autenticación, usuarios y perfiles |
| Sebastián Cabrera | Backend parte 2: proyectos, actividades, CV, base de datos SQL y pruebas de la API |

## Identidad visual

Paleta, tipografía, componentes y reglas responsive: [Guía de estilo](documentacion/diseno/guia-de-estilo.md).
