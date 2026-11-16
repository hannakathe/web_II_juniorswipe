# Arquitectura de JuniorSwipe

## Vista general

JuniorSwipe sigue una arquitectura cliente-servidor de tres capas:

| Capa | Tecnología | Responsabilidad | Estado en la Fase II |
|---|---|---|---|
| Presentación | React 19 + Vite | Pantallas, navegación, validación de formularios | Implementada |
| Lógica de negocio | API REST en Flask | Autenticación, reglas de acceso, CRUD | En desarrollo |
| Datos | SQLAlchemy sobre SQLite / PostgreSQL | Persistencia de usuarios, perfiles, proyectos, actividades y CV | En desarrollo |

El frontend y el backend son proyectos independientes dentro del mismo repositorio (`frontend/` y `backend/`). Se comunican solo por HTTP con JSON, así que cada uno se puede ejecutar, probar y desplegar por separado. Este documento cubre el frontend y la forma en que se conectará con la API; la documentación del backend la mantiene el equipo de backend.

## Frontend

### Organización del código

```
src/
├── main.jsx            Monta <App /> y carga los estilos
├── App.jsx             Define las rutas
├── pages/              Una carpeta por zona: auth/ (login, registro) y app/ (panel interno)
├── components/
│   ├── layout/         AuthLayout, AppLayout, PageHeader
│   ├── ui/             Button, FormField, Modal, TagInput, Feedback (Alert, EmptyState, ProgressBar, Avatar)
│   ├── landing/        Secciones de la página principal
│   ├── projects/       ProjectForm, ProjectFilters
│   ├── profile/        ProfileForm, ProfilePreview
│   └── resumes/        ResumeUploadForm
├── context/            ToastContext (notificaciones globales)
├── hooks/              useForm, useDocumentTitle, useLandingEffects
├── models/             constants.js (roles, estados, reglas del CV)
├── utils/              validators.js, format.js, profile.js
└── styles/             base, components, landing, auth, app
```

### Separación de responsabilidades

Las páginas (`pages/`) son las únicas que saben qué hacer cuando se envía un formulario. Los componentes de dominio (`ProjectForm`, `ResumeUploadForm`, `ProfileForm`) validan y entregan los datos ya con el formato que espera la API, por ejemplo `{ title, description, status, tech_stack }`, mediante la prop `onSubmit`. Gracias a eso, conectar la API cambia solo el cuerpo de `onSubmit` en cada página; los formularios no se tocan.

Las reglas de validación están en `utils/validators.js` como funciones puras. `hooks/useForm.js` las aplica a cada campo: valida al salir del campo, revalida mientras la persona corrige y valida todo al enviar. El mismo esquema de reglas sirve para cualquier formulario.

Los componentes de `ui/` no conocen el dominio. `FormField`, por ejemplo, sirve para texto, contraseña (con botón para mostrarla), área de texto y lista desplegable, y conecta el mensaje de error al campo con `aria-describedby` para lectores de pantalla.

### Estilos

No se usa framework de CSS. Los tokens de color, sombras, radios y tipografía están definidos como variables en `styles/base.css` y salen de la [guía de estilo](../diseno/guia-de-estilo.md). Cada zona de la aplicación tiene su archivo y `styles/index.css` los importa en orden, de lo general a lo específico.

Puntos de quiebre usados: 1100 px (las dos columnas pasan a una), 900 px (la barra lateral se vuelve menú desplegable y el registro oculta el panel de marca), 640 px y 480 px (ajustes de tarjetas y botones a ancho completo).

### Archivos estáticos

- `frontend/public/`: archivos que se sirven tal cual (`favicon.ico`).
- `frontend/src/assets/`: imágenes que se importan desde el código. Vite les agrega un hash al nombre en el build para que el navegador no use versiones viejas en caché. Las capturas de la landing están en WebP para que pesen menos.

## Estrategia de integración frontend ↔ API

La integración se hará cuando la API esté en el repositorio. El plan es:

1. **Cliente HTTP** en `src/services/http.js`: toma la URL de `VITE_API_URL`, agrega el token en `Authorization: Bearer`, convierte las respuestas de error en un `ApiError` con `status` y `code`, y avisa con un evento cuando la API responde 401.
2. **Servicios por recurso** en `src/services/` (`authService`, `projectService`, `taskService`, `profileService`, `resumeService`), para que ninguna página escriba URLs a mano.
3. **Contexto de sesión** (`AuthContext`) que guarda el token, valida la sesión al cargar la app con `/api/auth/me` y la cierra si el token vence.
4. **Rutas protegidas**: `/app/*` exige sesión, y `/app/cv` exige además el rol de talento junior.
5. **Páginas con datos**: cada `onSubmit` que hoy muestra el aviso pasa a llamar al servicio; las listas se cargan con estados de carga, vacío y error.
6. **Mensajes de error en español** a partir del `code` que devuelve la API (`email_taken`, `invalid_credentials`, `forbidden`…).
