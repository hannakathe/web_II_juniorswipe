# Arquitectura de JuniorSwipe

## Vista general

JuniorSwipe sigue una arquitectura cliente-servidor de tres capas:

| Capa | Tecnología | Responsabilidad | Estado en la Fase II |
|---|---|---|---|
| Presentación | React 19 + Vite | Pantallas, navegación, validación de formularios | Implementada |
| Lógica de negocio | API REST en Flask | Autenticación, reglas de acceso, CRUD | Implementada |
| Datos | SQLAlchemy sobre SQLite / PostgreSQL | Persistencia de usuarios, perfiles, proyectos, actividades y CV | Implementada (SQLite) |

El frontend y el backend son proyectos independientes dentro del mismo repositorio (`frontend/` y `backend/`). Se comunican solo por HTTP con JSON, así que cada uno se puede ejecutar, probar y desplegar por separado. Este documento cubre el frontend y cómo se conecta con la API. El backend está documentado en [backend.md](backend.md) y sus endpoints en [api-rest.md](api-rest.md).

## Frontend

### Organización del código

```
src/
├── main.jsx            Monta <App /> y carga los estilos
├── App.jsx             Define las rutas y envuelve la app con la sesión y las notificaciones
├── pages/              Una carpeta por zona: auth/ (login, registro) y app/ (panel interno)
├── components/
│   ├── layout/         AuthLayout, AppLayout, PageHeader, RouteGuards (rutas protegidas)
│   ├── ui/             Button, FormField, Modal, ConfirmDialog, Pagination, TagInput, Feedback
│   ├── landing/        Secciones de la página principal
│   ├── projects/       ProjectCard, ProjectForm, ProjectFilters
│   ├── tasks/          TaskForm, TaskItem
│   ├── profile/        ProfileForm, ProfilePreview
│   └── resumes/        ResumeUploadForm, ResumeItem
├── context/            AuthContext (sesión) y ToastContext (notificaciones)
├── hooks/              useForm, useDebounce, useDocumentTitle, useLandingEffects
├── models/             constants.js (roles, estados, prioridades, reglas del CV)
├── services/           http.js (cliente HTTP) e index.js (un servicio por recurso)
├── utils/              validators.js, format.js, profile.js, apiErrors.js
└── styles/             base, components, landing, auth, app, data
```

### Separación de responsabilidades

Las páginas (`pages/`) cargan los datos y deciden qué hacer cuando se envía un formulario. Los componentes de dominio (`ProjectForm`, `TaskForm`, `ResumeUploadForm`, `ProfileForm`) validan y entregan los datos ya con el formato que espera la API, por ejemplo `{ title, description, status, tech_stack }`, mediante la prop `onSubmit`. Ningún componente llama a la API: eso lo hacen las páginas a través de `services/`.

Las reglas de validación están en `utils/validators.js` como funciones puras. `hooks/useForm.js` las aplica a cada campo: valida al salir del campo, revalida mientras la persona corrige y valida todo al enviar. El mismo esquema de reglas sirve para cualquier formulario.

Los componentes de `ui/` no conocen el dominio. `FormField`, por ejemplo, sirve para texto, contraseña (con botón para mostrarla), área de texto y lista desplegable, y conecta el mensaje de error al campo con `aria-describedby` para lectores de pantalla.

### Estilos

No se usa framework de CSS. Los tokens de color, sombras, radios y tipografía están definidos como variables en `styles/base.css` y salen de la [guía de estilo](../diseno/guia-de-estilo.md). Cada zona de la aplicación tiene su archivo y `styles/index.css` los importa en orden, de lo general a lo específico.

Puntos de quiebre usados: 1100 px (las dos columnas pasan a una), 900 px (la barra lateral se vuelve menú desplegable y el registro oculta el panel de marca), 640 px y 480 px (ajustes de tarjetas y botones a ancho completo).

### Archivos estáticos

- `frontend/public/`: archivos que se sirven tal cual (`favicon.ico`).
- `frontend/src/assets/`: imágenes que se importan desde el código. Vite les agrega un hash al nombre en el build para que el navegador no use versiones viejas en caché. Las capturas de la landing están en WebP para que pesen menos.

## Integración frontend ↔ API

1. **Cliente HTTP** (`src/services/http.js`): toma la URL de `VITE_API_URL`, agrega el token en `Authorization: Bearer`, convierte las respuestas de error en un `ApiError` con `status` y `code`, y emite el evento `juniorswipe:unauthorized` cuando la API responde 401.
2. **Servicios por recurso** (`src/services/index.js`): `authService`, `userService`, `profileService`, `projectService`, `taskService` y `resumeService`. Ninguna página escribe URLs a mano.
3. **Sesión** (`context/AuthContext.jsx`): guarda el token en `localStorage`, valida la sesión al abrir la app con `/api/auth/me` y la cierra si el token vence. Si la API está apagada, no cierra la sesión.
4. **Rutas protegidas** (`components/layout/RouteGuards.jsx`): `/app/*` exige sesión y lleva al inicio de sesión recordando la página pedida; `/app/cv` exige además el rol de talento junior. Las pantallas de inicio de sesión y registro llevan al panel si ya hay sesión.
5. **Páginas con datos**: cada lista maneja tres estados (cargando, vacía y error con "Reintentar"). Después de crear, editar o borrar se recargan los datos y se muestra un aviso.
6. **Errores en español** (`utils/apiErrors.js`): traduce el `code` de la API (`email_taken`, `invalid_credentials`, `forbidden`, `network_error`…) a un mensaje claro.

La búsqueda de proyectos espera 350 ms después de la última tecla (`useDebounce`) antes de llamar a la API, para no hacer una petición por cada letra.
