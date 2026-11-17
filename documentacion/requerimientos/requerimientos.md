# Requerimientos

Estado al cierre de la Fase II, con el frontend conectado a la API.

## Requerimientos funcionales

| ID | Requerimiento | Estado |
|---|---|---|
| RF-01 | La página principal presenta la plataforma, sus funciones y cómo funciona para talento junior y para empresas | Implementado |
| RF-02 | La persona puede registrarse eligiendo si es talento junior o empresa | Implementado |
| RF-03 | El registro valida nombre, formato de correo, contraseña de mínimo 8 caracteres con letras y números, confirmación de contraseña y aceptación de términos | Implementado |
| RF-04 | La persona puede iniciar sesión con correo y contraseña | Implementado |
| RF-05 | La persona puede editar su perfil: titular, biografía, ciudad, sitio web, habilidades y nombre de la empresa | Implementado (el nombre de la cuenta todavía no se puede cambiar) |
| RF-06 | El perfil muestra una vista previa en vivo y el porcentaje completado | Implementado |
| RF-07 | La persona puede registrar proyectos o evidencias con título, descripción, estado y herramientas | Implementado |
| RF-08 | La persona puede buscar proyectos por título y filtrarlos por estado | Implementado |
| RF-09 | La persona puede editar y eliminar sus proyectos | Implementado |
| RF-10 | Cada proyecto tiene actividades con estado, prioridad y fecha | Implementado |
| RF-11 | El talento junior puede subir CV en PDF, Word o texto de hasta 5 MB | Implementado |
| RF-12 | El talento junior puede marcar un CV como principal, descargarlo y eliminarlo | Implementado |
| RF-13 | Una cuenta de empresa no puede subir CV | Implementado (la API responde 403 y el menú oculta la sección) |
| RF-14 | Una persona no puede ver ni modificar datos de otra | Implementado (la API responde 404) |

## Requerimientos no funcionales

| ID | Requerimiento | Cómo se cumple |
|---|---|---|
| RNF-01 | Diseño adaptable a móvil, tableta y escritorio | Puntos de quiebre en 1100, 900, 640 y 480 px; revisado en 375, 768 y 1440 px |
| RNF-02 | Accesibilidad básica | Etiquetas en todos los campos, errores asociados con `aria-describedby`, foco visible, áreas táctiles de 44 px, enlace "Saltar al contenido", modales que se cierran con Escape |
| RNF-03 | Mensajes claros en español | Cada error dice qué corregir ("Escribe un correo válido, por ejemplo nombre@correo.com") |
| RNF-04 | Código mantenible | Separación en páginas, componentes, hooks, utilidades y modelos; ESLint sin errores |
| RNF-05 | Pruebas automáticas | 40 pruebas en el frontend con Vitest y 32 en el backend con pytest |
| RNF-06 | Rendimiento de imágenes | Capturas en WebP (unos 70 KB cada una) y carga diferida con `loading="lazy"` |

## Historias de usuario

| ID | Como… | Quiero… | Para… | Estado |
|---|---|---|---|---|
| HU-01 | Recién graduada | Registrar mi trabajo de grado como proyecto | Mostrar lo que sé hacer aunque no tenga experiencia | Implementado |
| HU-02 | Recién graduada | Ver cómo verá una empresa mi perfil mientras lo edito | Saber si estoy dando una buena impresión | Implementado |
| HU-03 | Estudiante | Subir varias versiones de mi CV | Usar la adecuada para cada tipo de cargo | Implementado |
| HU-04 | Reclutador de una empresa | Crear una cuenta de empresa | Publicar vacantes y ver candidatos | Cuenta implementada; las vacantes quedan fuera del MVP |
| HU-05 | Persona que visita la página | Entender en un minuto qué ofrece la plataforma | Decidir si me registro | Implementado |
