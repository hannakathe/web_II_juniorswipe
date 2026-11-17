# Diagramas

Los diagramas están en Mermaid, así que GitHub los muestra como imagen directamente en esta página.

## Componentes del sistema

```mermaid
flowchart LR
    U[Persona usuaria<br/>navegador] --> F[Frontend React<br/>Vite · puerto 5173]
    F -- "HTTP + JSON<br/>Bearer JWT" --> A[API REST Flask<br/>puerto 5000]
    A --> D[(Base de datos<br/>SQLite / PostgreSQL)]
    A --> S[/storage<br/>archivos de CV/]

    classDef hecho fill:#d9ebff,stroke:#0f49fa,color:#020617
    classDef pendiente fill:#f1f5f9,stroke:#94a3b8,color:#475569,stroke-dasharray:4 3
    class F,A,D,S hecho
```

Todos los componentes están implementados en la Fase II. En desarrollo la base de datos es SQLite; PostgreSQL queda para el despliegue.

## Mapa de navegación

```mermaid
flowchart TD
    L["/ · Landing"] -->|Registrarse| R["/register"]
    L -->|Acceder| I["/login"]
    R -->|¿Ya tienes cuenta?| I
    I -->|¿No tienes cuenta?| R
    I -->|Inicio de sesión| P["/app · Panel"]
    R -->|Registro| P
    P --> PR["/app/proyectos"]
    P --> PE["/app/perfil"]
    P --> CV["/app/cv"]
    PR -->|"?nuevo=1"| M[Modal nuevo proyecto]
    X["Cualquier otra ruta"] --> N[404]
```

## Componentes del frontend

```mermaid
flowchart TD
    App --> Landing
    App --> Login & Register
    App --> AppLayout
    App --> NotFound

    Login & Register --> AuthLayout
    AppLayout --> Dashboard & Projects & Profile & Resumes

    Projects --> ProjectFilters
    Projects --> Modal --> ProjectForm
    Profile --> ProfileForm & ProfilePreview
    Resumes --> ResumeUploadForm

    ProjectForm & ProfileForm & ResumeUploadForm & Login & Register --> useForm --> validators[utils/validators]
    ProjectForm & ProfileForm & ResumeUploadForm --> FormField & TagInput & Button
```

## Secuencia de inicio de sesión

```mermaid
sequenceDiagram
    actor U as Persona usuaria
    participant F as Frontend
    participant A as API Flask
    participant D as Base de datos

    U->>F: Escribe correo y contraseña
    F->>F: Valida formato (useForm + validators)
    alt datos inválidos
        F-->>U: Muestra el error bajo el campo
    else datos válidos
        F->>A: POST /api/auth/login
        A->>D: Busca el usuario por correo
        A->>A: Verifica el hash de la contraseña
        alt credenciales correctas
            A-->>F: 200 { token, user }
            F->>F: Guarda el token y redirige a /app
        else credenciales incorrectas
            A-->>F: 401 invalid_credentials
            F-->>U: "El correo o la contraseña no son correctos"
        end
    end
```
