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
| Backend (en desarrollo) | Python + Flask + Flask-SQLAlchemy + PyJWT | 3.12+ · 3.1 |
| Base de datos (en desarrollo) | SQLite en desarrollo, PostgreSQL en despliegue | — |

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

- `pages/` arma cada pantalla y decide qué pasa al enviar un formulario.
- `components/` tiene piezas visuales reutilizables, sin lógica de datos.
- `hooks/` guarda la lógica reutilizable de estado (formularios, efectos de la landing).
- `utils/` contiene funciones puras (validaciones y formato) que se prueban sin navegador.
- `models/` reúne los valores del dominio (roles, estados de proyecto, reglas del CV).
- `context/` maneja el estado global de la interfaz (notificaciones).

El detalle, con diagramas, está en [documentacion/arquitectura](documentacion/arquitectura/arquitectura.md) y [documentacion/diagramas](documentacion/diagramas/diagramas.md).

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
│   │   │   ├── layout/        Estructura de autenticación y del panel
│   │   │   ├── ui/            Botón, campo, modal, etiquetas, avisos
│   │   │   ├── projects/      Formulario y filtros de proyectos
│   │   │   ├── profile/       Formulario y vista previa del perfil
│   │   │   └── resumes/       Carga de CV
│   │   ├── context/           Notificaciones (toasts)
│   │   ├── hooks/             useForm, useDocumentTitle, efectos de la landing
│   │   ├── models/            Constantes del dominio
│   │   ├── pages/             Landing, auth/, app/ y 404
│   │   ├── styles/            base, componentes, landing, auth y app
│   │   └── utils/             Validaciones y formato
│   └── tests/                 Pruebas automáticas (Vitest)
├── backend/                   API REST en Flask (en desarrollo)
│   ├── app/models/
│   ├── app/routes/
│   └── tests/
├── database/                  Esquema y datos SQL (en desarrollo)
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

### Requisitos de ejecución

- Node.js 20 o superior y npm 10 o superior.
- Un navegador actualizado (Chrome, Edge, Firefox o Safari).
- Para el backend (cuando esté integrado): Python 3.12 o superior.

### Instalación y ejecución del frontend

```bash
git clone https://github.com/hannakathe/web_II_juniorswipe.git
cd web_II_juniorswipe/frontend
npm install
npm run dev
```

La aplicación queda en http://localhost:5173.

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga automática |
| `npm run build` | Genera la versión de producción en `dist/` |
| `npm run preview` | Sirve el build de producción para revisarlo |
| `npm test` | Ejecuta las pruebas automáticas |
| `npm run lint` | Revisa el código con ESLint |

### Configuración

En esta etapa el frontend no necesita variables de entorno. Cuando se conecte con la API se agregará `frontend/.env.example` con `VITE_API_URL` (la URL base del backend), y el backend tendrá su propio `backend/.env.example`. Los archivos `.env` reales no se suben al repositorio.

### Rutas de la aplicación

| Ruta | Pantalla |
|---|---|
| `/` | Página principal |
| `/login` | Inicio de sesión |
| `/register` | Registro (con `?rol=empresa` abre directamente la cuenta de empresa) |
| `/app` | Panel con los primeros pasos |
| `/app/proyectos` | Proyectos / evidencias (con `?nuevo=1` abre el formulario) |
| `/app/perfil` | Perfil con vista previa |
| `/app/cv` | Carga y lista de CV |

## Estado del proyecto

### Funcionalidades implementadas

- Página principal con navegación por secciones, menú móvil, animaciones al hacer scroll y pestañas de "Así funciona para ti" (talento junior / empresas).
- Registro con selección de tipo de cuenta, medidor de seguridad de la contraseña, confirmación de contraseña y aceptación de términos.
- Inicio de sesión con validación de correo y opción de ver u ocultar la contraseña.
- Área interna con barra lateral en escritorio y menú desplegable en móvil.
- Formulario de proyectos en ventana modal, con contador de caracteres, selector de estado y etiquetas de herramientas.
- Buscador y filtro por estado en la página de proyectos.
- Perfil con vista previa en vivo de cómo lo verá una empresa y porcentaje de perfil completo.
- Carga de CV con arrastrar y soltar, validación de formato (PDF, Word, texto) y de tamaño (5 MB).
- Validaciones en todos los formularios: al salir del campo, mientras se corrige y al enviar, con mensajes en español.
- Notificaciones (toasts), página 404 y título de pestaña por página.
- Diseño adaptable probado en 375 px, 768 px y 1440 px.
- 27 pruebas automáticas del frontend.

### Funcionalidades pendientes

- API REST en Flask: autenticación JWT, perfiles, proyectos, actividades y CV (en desarrollo por el equipo de backend).
- Conexión del frontend con la API: sesión, rutas protegidas por rol, listado y CRUD con datos reales, descarga de CV.
- Página de detalle de proyecto con sus actividades (depende de la API).
- Por ahora, al enviar un formulario válido se muestra el aviso "Se guardarán cuando el frontend se conecte con la API"; no se guarda nada.

### Avances de la Fase II

| Fase I | Fase II |
|---|---|
| Landing en React que no compilaba (imagen mal importada, capturas faltantes, estilos incompletos) | Landing funcionando, con menú móvil, logo corregido y capturas reales en "Así funciona para ti" |
| Solo la ruta `/` | React Router con 7 rutas, página 404 y layout propio para autenticación y panel |
| Sin formularios | 5 formularios con validación en el navegador |
| Sin pruebas | 27 pruebas automáticas (Vitest) y plan de pruebas manuales |
| Documentación en el README | Carpeta `documentacion/` con arquitectura, diagramas, requerimientos, pruebas y decisiones técnicas |

### Próximos pasos

1. Terminar la API REST y sus pruebas (backend).
2. Conectar el frontend con la API: cliente HTTP, contexto de sesión y rutas protegidas.
3. Reemplazar los estados vacíos por datos reales y agregar el detalle de proyecto con actividades.
4. Fases siguientes: despliegue con Docker, base de datos PostgreSQL y pipeline de integración continua.

## Equipo

| Integrante | Responsabilidad |
|---|---|
| Hannah K. Abril | Frontend completo (React), diseño de interfaz, documentación y pruebas del frontend |
| Steven Lopez | Backend parte 1: configuración de Flask, modelos, seguridad JWT, autenticación, usuarios y perfiles |
| Sebastián Cabrera | Backend parte 2: proyectos, actividades, CV, base de datos SQL y pruebas de la API |

## Identidad visual

Paleta, tipografía, componentes y reglas responsive: [Guía de estilo](documentacion/diseno/guia-de-estilo.md).
