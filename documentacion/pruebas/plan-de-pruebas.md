# Plan y resultados de pruebas · Frontend

Pruebas del frontend al cierre de la Fase II, con la aplicación conectada a la API. Las pruebas propias de la API están en [pruebas-backend.md](pruebas-backend.md).

## Pruebas automáticas

Se ejecutan con:

```bash
cd frontend
npm test
```

Resultado de la última ejecución: **4 archivos, 40 pruebas, 40 aprobadas**. Las pruebas no necesitan la API encendida: reemplazan `fetch` por respuestas simuladas (`tests/helpers.jsx`).

| Archivo | Qué cubre | Pruebas |
|---|---|---|
| `tests/validators.test.js` | Reglas de validación (obligatorio, longitud, correo, URL, contraseña, confirmación, fecha, tipo y tamaño de archivo), medidor de contraseña, formato de tamaños y porcentaje de perfil | 12 |
| `tests/http.test.js` | Cliente HTTP: envía el token Bearer, arma los parámetros de búsqueda, convierte errores en `ApiError`, borra la sesión ante un 401 y da un mensaje claro si la API está apagada | 5 |
| `tests/forms.test.jsx` | Inicio de sesión (vacío sin llamar a la API, correo inválido, error de credenciales en español, inicio correcto con token guardado, ver contraseña), registro (contraseñas distintas, términos, cuenta de empresa, correo repetido bajo su campo, registro correcto), formulario de proyecto y carga de CV | 13 |
| `tests/navigation.test.jsx` | Redirección al inicio de sesión sin sesión, sección de CV bloqueada para empresas, 404, panel con datos de la API, navegación lateral, búsqueda y filtro enviados a la API, crear proyecto, eliminar con confirmación, avanzar el estado de una actividad, proyecto inexistente y guardar el perfil | 10 |

Revisión estática: `npm run lint` termina sin errores ni advertencias. Build de producción: `npm run build` termina sin errores (JS de 341 KB, 117 KB comprimido; CSS de 34 KB).

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

## Pruebas de integración con la API real

Con la API (`python run.py`) y el frontend (`npm run dev`) encendidos, se recorrió la aplicación completa con las cuentas de prueba. Estas pruebas se hicieron en el navegador llenando y enviando los formularios reales.

| # | Caso | Resultado esperado | Resultado |
|---|---|---|---|
| I-01 | Iniciar sesión con `dev@local.test` | Entra a `/app`, guarda el token y saluda "¡Hola, Laura!" | Aprobado |
| I-02 | Panel de talento junior | Muestra proyectos, actividades hechas, CV y porcentaje de perfil con datos de la base | Aprobado |
| I-03 | Filtro "Finalizado" y búsqueda "ong" en proyectos | La API devuelve solo los proyectos que coinciden | Aprobado |
| I-04 | Agregar una actividad en el detalle de un proyecto | Aparece en la lista, el avance pasa de "1 de 3" a "1 de 4" | Aprobado |
| I-05 | Clic en el estado de una actividad | Pasa de "Por hacer" a "En progreso" y se guarda | Aprobado |
| I-06 | Lista de CV y descarga | Muestra el CV principal y la descarga responde `application/pdf` | Aprobado |
| I-07 | Guardar el perfil con una URL inválida y luego válida | Primero marca el error; después guarda y avisa "Perfil guardado." | Aprobado |
| I-08 | Cerrar sesión | Vuelve a la página principal, borra el token y el menú muestra "Acceder" | Aprobado |
| I-09 | Iniciar sesión con `company@local.test` | El menú no muestra "Mis CV" y `/app/cv` dice que la sección no está disponible | Aprobado |
| I-10 | Perfil de empresa | Muestra el campo "Nombre de la empresa" con el valor guardado | Aprobado |
| I-11 | Registrar una cuenta nueva | Crea la cuenta, entra al panel y muestra "¡Tu cuenta está lista!" | Aprobado |
| I-12 | Registrar otra vez el mismo correo | Muestra "Ya existe una cuenta con ese correo" bajo el campo | Aprobado |

## Limitaciones

Las pruebas visuales en 375, 768 y 1440 px se hicieron antes de conectar la API. Las pantallas nuevas (tarjetas de proyecto, detalle con actividades y lista de CV) tienen estilos responsive, pero conviene revisarlas en un celular antes de la presentación.
