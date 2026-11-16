# Plan y resultados de pruebas · Frontend

Pruebas del frontend al cierre de la Fase II. Las pruebas de la API se documentan con el backend.

## Pruebas automáticas

Se ejecutan con:

```bash
cd frontend
npm test
```

Resultado de la última ejecución: **3 archivos, 27 pruebas, 27 aprobadas**.

| Archivo | Qué cubre | Pruebas |
|---|---|---|
| `tests/validators.test.js` | Reglas de validación (obligatorio, longitud, correo, URL, contraseña, confirmación, fecha, tipo y tamaño de archivo), medidor de contraseña, formato de tamaños y porcentaje de perfil | 12 |
| `tests/forms.test.jsx` | Inicio de sesión (vacío, correo inválido, datos válidos, ver contraseña), registro (contraseñas distintas, términos, cuenta de empresa), formulario de proyecto (título obligatorio, datos en formato de la API, etiquetas sin repetir) y carga de CV (formato no permitido, nombre sugerido, envío como FormData) | 10 |
| `tests/navigation.test.jsx` | Navegación por la barra lateral con enlace activo, modal de nuevo proyecto con `?nuevo=1` y cierre con Escape, filtro por estado, vista previa del perfil en vivo y página 404 | 5 |

Revisión estática: `npm run lint` termina sin errores ni advertencias. Build de producción: `npm run build` termina sin errores (JS de 317 KB, 111 KB comprimido; CSS de 28 KB).

## Pruebas manuales

Hechas en el navegador con `npm run dev`, en tres anchos de pantalla: 375 px (móvil), 768 px (tableta) y 1440 px (escritorio).

### Navegación

| # | Caso | Resultado esperado | Resultado |
|---|---|---|---|
| N-01 | Abrir las 8 rutas (`/`, `/login`, `/register`, `/app`, `/app/proyectos`, `/app/perfil`, `/app/cv`, una ruta inexistente) | Cada una carga su pantalla y cambia el título de la pestaña | Aprobado |
| N-02 | Ruta inexistente | Muestra la página 404 con botón para volver al inicio | Aprobado |
| N-03 | Menú de la landing en móvil | Se abre con la hamburguesa, se convierte en ✕ y se cierra al elegir una sección | Aprobado |
| N-04 | Barra lateral del panel en móvil | Se abre con la hamburguesa y se cierra al tocar el fondo oscuro o al cambiar de página | Aprobado |
| N-05 | Enlaces "Acceder" y "Registrarse" de la landing | Llevan a `/login` y `/register` | Aprobado |
| N-06 | Botón "Nuevo proyecto" del panel | Abre la página de proyectos con el formulario ya abierto | Aprobado |

### Formularios y validaciones

| # | Caso | Resultado esperado | Resultado |
|---|---|---|---|
| F-01 | Enviar el inicio de sesión vacío | Mensajes "Escribe tu correo" y "Escribe tu contraseña" bajo cada campo | Aprobado |
| F-02 | Escribir `laura@correo` y salir del campo | Mensaje de correo inválido con un ejemplo | Aprobado |
| F-03 | Registro con contraseñas distintas | "Las contraseñas no coinciden" | Aprobado |
| F-04 | Registro sin aceptar términos | "Debes aceptar los términos para continuar" | Aprobado |
| F-05 | Escribir una contraseña en el registro | La barra de seguridad cambia de color y de texto | Aprobado |
| F-06 | Elegir "Empresa" en el registro | El campo cambia a "Nombre de la empresa" | Aprobado |
| F-07 | Sitio web `behance.net/laura` en el perfil | Pide una URL que empiece por http:// o https:// | Aprobado |
| F-08 | Escribir el nombre en el perfil | La vista previa y el porcentaje se actualizan mientras se escribe | Aprobado |
| F-09 | Agregar habilidades con Enter y con coma | Cada habilidad aparece como etiqueta y en la vista previa; las repetidas se ignoran | Aprobado |
| F-10 | Guardar un proyecto sin título | "Ponle un título a tu proyecto" y el modal sigue abierto | Aprobado |
| F-11 | Guardar un proyecto válido | El modal se cierra y aparece el aviso de que se guardará al conectar la API | Aprobado |
| F-12 | Subir `foto.png` como CV | "Formato no permitido" y la zona de carga se marca en rojo | Aprobado |
| F-13 | Elegir un PDF en la zona de carga | Muestra nombre y tamaño, y propone el nombre del archivo como título | Aprobado (cubierto por prueba automática; el arrastre no se probó a mano) |

### Diseño adaptable y errores

| # | Caso | Resultado esperado | Resultado |
|---|---|---|---|
| R-01 | Las 8 rutas a 375 px y a 768 px | Sin scroll horizontal | Aprobado |
| R-02 | Registro e inicio de sesión a 375 px | Se oculta el panel de marca y el formulario ocupa el ancho | Aprobado |
| R-03 | Perfil y CV por debajo de 1100 px | Las dos columnas pasan a una | Aprobado |
| R-04 | Modal de proyecto a 375 px | Cabe en la pantalla y el foco queda en el título | Aprobado |
| E-01 | Consola del navegador durante todas las pruebas | Sin errores | Aprobado |

## Limitaciones

Mientras la API no esté conectada no se puede probar que los datos se guarden, la sesión, las rutas protegidas ni los permisos por rol. Esas pruebas se agregarán en la etapa de integración.
