# Requerimientos

Estado al cierre de la Fase II. "Interfaz lista" quiere decir que la pantalla y sus validaciones funcionan, pero todavía no guardan en la base de datos porque la API está en desarrollo.

## Requerimientos funcionales

| ID | Requerimiento | Estado |
|---|---|---|
| RF-01 | La página principal presenta la plataforma, sus funciones y cómo funciona para talento junior y para empresas | Implementado |
| RF-02 | La persona puede registrarse eligiendo si es talento junior o empresa | Interfaz lista |
| RF-03 | El registro valida nombre, formato de correo, contraseña de mínimo 8 caracteres con letras y números, confirmación de contraseña y aceptación de términos | Implementado |
| RF-04 | La persona puede iniciar sesión con correo y contraseña | Interfaz lista |
| RF-05 | La persona puede editar su perfil: nombre, titular, biografía, ciudad, sitio web y habilidades | Interfaz lista |
| RF-06 | El perfil muestra una vista previa en vivo y el porcentaje completado | Implementado |
| RF-07 | La persona puede registrar proyectos o evidencias con título, descripción, estado y herramientas | Interfaz lista |
| RF-08 | La persona puede buscar proyectos por título y filtrarlos por estado | Interfaz lista |
| RF-09 | La persona puede editar y eliminar sus proyectos | Pendiente (requiere API) |
| RF-10 | Cada proyecto tiene actividades con estado, prioridad y fecha | Pendiente (requiere API) |
| RF-11 | El talento junior puede subir CV en PDF, Word o texto de hasta 5 MB | Interfaz lista |
| RF-12 | El talento junior puede marcar un CV como principal, descargarlo y eliminarlo | Pendiente (requiere API) |
| RF-13 | Una cuenta de empresa no puede subir CV | Pendiente (requiere API) |
| RF-14 | Una persona no puede ver ni modificar datos de otra | Pendiente (requiere API) |

## Requerimientos no funcionales

| ID | Requerimiento | Cómo se cumple |
|---|---|---|
| RNF-01 | Diseño adaptable a móvil, tableta y escritorio | Puntos de quiebre en 1100, 900, 640 y 480 px; revisado en 375, 768 y 1440 px |
| RNF-02 | Accesibilidad básica | Etiquetas en todos los campos, errores asociados con `aria-describedby`, foco visible, áreas táctiles de 44 px, enlace "Saltar al contenido", modales que se cierran con Escape |
| RNF-03 | Mensajes claros en español | Cada error dice qué corregir ("Escribe un correo válido, por ejemplo nombre@correo.com") |
| RNF-04 | Código mantenible | Separación en páginas, componentes, hooks, utilidades y modelos; ESLint sin errores |
| RNF-05 | Pruebas automáticas | 27 pruebas en el frontend con Vitest |
| RNF-06 | Rendimiento de imágenes | Capturas en WebP (unos 70 KB cada una) y carga diferida con `loading="lazy"` |

## Historias de usuario

| ID | Como… | Quiero… | Para… | Estado |
|---|---|---|---|---|
| HU-01 | Recién graduada | Registrar mi trabajo de grado como proyecto | Mostrar lo que sé hacer aunque no tenga experiencia | Interfaz lista |
| HU-02 | Recién graduada | Ver cómo verá una empresa mi perfil mientras lo edito | Saber si estoy dando una buena impresión | Implementado |
| HU-03 | Estudiante | Subir varias versiones de mi CV | Usar la adecuada para cada tipo de cargo | Interfaz lista |
| HU-04 | Reclutador de una empresa | Crear una cuenta de empresa | Publicar vacantes y ver candidatos | Interfaz lista |
| HU-05 | Persona que visita la página | Entender en un minuto qué ofrece la plataforma | Decidir si me registro | Implementado |
