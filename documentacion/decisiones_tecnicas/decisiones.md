# Decisiones técnicas

Cada decisión sigue el formato contexto → decisión → consecuencias.

## DT-01 · React con Vite para el frontend

**Contexto.** La Fase I ya tenía la landing en React. La aplicación interna necesita varias pantallas, formularios con estado y navegación sin recargar.

**Decisión.** Seguir con React 19 y Vite 8. Vite arranca el servidor de desarrollo en menos de un segundo y genera el build de producción sin configuración adicional.

**Consecuencias.** Un solo lenguaje (JavaScript/JSX) en todo el frontend. Las pruebas usan Vitest, que comparte la configuración de Vite.

## DT-02 · CSS propio con variables en lugar de Bootstrap o Tailwind

**Contexto.** La guía de estilo define colores, radios, sombras y tipografía propios de la marca JuniorSwipe.

**Decisión.** Escribir el CSS a mano, con los tokens como variables en `styles/base.css`, y separar los estilos por zona (base, componentes, landing, auth, app).

**Consecuencias.** La interfaz respeta la guía sin pelear con estilos de un framework y el CSS final pesa unos 28 KB. A cambio, el equipo mantiene sus propias clases.

## DT-03 · Validación con funciones puras y un hook propio

**Contexto.** Hay cinco formularios con reglas parecidas (obligatorio, longitud, correo, URL, archivo).

**Decisión.** Definir cada regla como función en `utils/validators.js` y aplicarlas con `hooks/useForm.js`, sin librerías como Formik o React Hook Form.

**Consecuencias.** Las reglas se prueban sin navegador (`tests/validators.test.js`) y cada formulario declara su esquema en pocas líneas. La validación del navegador es solo para la experiencia de uso: la API vuelve a validar todo.

## DT-04 · Formularios desacoplados de la API

**Contexto.** El backend se desarrolla en paralelo y no estaba listo durante la construcción de la interfaz.

**Decisión.** Los formularios entregan los datos por `onSubmit` con el formato de la API, y solo las páginas deciden qué hacer con ellos. Mientras tanto, las páginas muestran un aviso en lugar de guardar.

**Consecuencias.** Frontend y backend avanzaron sin bloquearse. Al integrar la API solo cambiaron las páginas y se agregó `services/`; los formularios quedaron igual, salvo el perfil, que ganó el campo de nombre de empresa.

## DT-05 · Imágenes en WebP

**Contexto.** Las seis capturas de "Así funciona para ti" pesaban 8,4 MB en PNG.

**Decisión.** Convertirlas a WebP con calidad 85.

**Consecuencias.** Pasaron a 432 KB en total sin pérdida visible de nitidez.
