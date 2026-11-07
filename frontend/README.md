# JuniorSwipe

## Descripcion

JuniorSwipe es una plataforma web que conecta a talento junior (estudiantes de últimos semestres y recién graduados, sin experiencia laboral o con poca) con empresas que buscan perfiles de entrada, en cualquier área profesional: ingeniería, diseño, administración, salud, comunicación, entre otras.

Las empresas suelen pedir experiencia que un recién graduado todavía no tiene. JuniorSwipe resuelve ese problema reemplazando el CV genérico por evidencias verificables: proyectos académicos, prácticas, voluntariados, trabajos de grado o proyectos personales que muestran lo que el candidato sabe hacer. Así las empresas evalúan el potencial real de cada candidato, y los juniors reciben una hoja de ruta de empleabilidad para conseguir su primer empleo.

## Objetivo

Facilitar la inserción laboral de estudiantes y recién graduados de cualquier disciplina con un perfil profesional basado en evidencias (proyectos, actividades y habilidades) que compense la falta de experiencia laboral formal.

### Objetivos secundarios

1. Para candidatos junior: construir un portafolio centralizado (perfil, habilidades, proyectos, actividades y CV) que muestre su formación práctica, sea cual sea su carrera.

2. Para empresas: encontrar candidatos de nivel de entrada prefiltrados por habilidades y área profesional, y ahorrar tiempo en reclutamiento.

3. Empleabilidad: detectar brechas entre el perfil del candidato y lo que pide el mercado, y sugerir proyectos o actividades para cerrarlas.

4. Matching: conectar candidatos y ofertas según su compatibilidad, con IA en fases futuras.

## Alcance inicial MVP

### Incluido

| Módulo | Funcionalidad |
|---|---|
| **Landing page** | Presentación de la plataforma para candidatos junior y empresas de cualquier sector |
| **Autenticación** | Registro e inicio de sesión con email y contraseña, sesión con JWT y contraseñas cifradas |
| **Roles** | Dos tipos de usuario: **candidato** (estudiante o recién graduado) y **empresa** |
| **Perfil** | Titular, biografía, ubicación, sitio web, habilidades y nombre de la empresa (solo en perfiles de empresa) |
| **Proyectos / evidencias** | CRUD de proyectos académicos, prácticas, voluntariados o proyectos personales, con descripción, herramientas o habilidades aplicadas y estado |
| **Actividades** | CRUD de tareas o entregables dentro de cada proyecto, con estado, prioridad y fecha |
| **CVs** | Subida y gestión de CVs, y elección de uno como principal |
| **Dashboard** | Área autenticada en React para gestionar todo lo anterior |

### Fuera del alcance del MVP (fases futuras)

- Matching automático con IA entre candidatos y ofertas.
- Extracción automática de habilidades desde el CV.
- Análisis de brechas y rutas de aprendizaje por área profesional.
- Publicación de ofertas de práctica o empleo por parte de las empresas.
- Buscador y filtros por carrera, área, habilidades y ubicación.
- Notificaciones de matches relevantes.
- Inicio de sesión con Google o LinkedIn.

### Criterio de éxito del MVP

Un estudiante o recién graduado de **cualquier carrera** puede **registrarse, completar su perfil con habilidades, registrar proyectos con sus actividades y subir su CV**, todo guardado en la base de datos y visible desde su dashboard.

## Identidad visual

Revisar: [Guía de estilo](docs/design/style-guide.md)