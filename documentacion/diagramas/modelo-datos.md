# Modelo de datos

Seis tablas. Cada proyecto, actividad, CV y perfil pertenece a un solo usuario. El esquema para PostgreSQL está en `database/schema.sql` y SQLAlchemy crea las mismas tablas en SQLite con `db.create_all()`.

```mermaid
erDiagram
    ROLES ||--o{ USERS : "tiene"
    USERS ||--|| PROFILES : "tiene"
    USERS ||--o{ PROJECTS : "registra"
    USERS ||--o{ RESUMES : "sube"
    PROJECTS ||--o{ TASKS : "contiene"

    ROLES {
        int id PK
        string name "developer | company"
        string description
    }
    USERS {
        int id PK
        string email UK
        string password_hash
        string full_name
        int role_id FK
        datetime created_at
    }
    PROFILES {
        int id PK
        int user_id FK
        string headline
        text bio
        string location
        string website
        string company_name
        text skills "lista JSON"
    }
    PROJECTS {
        int id PK
        int owner_id FK
        string title
        text description
        string status "draft | open | active | closed"
        string tech_stack
    }
    TASKS {
        int id PK
        int project_id FK
        string title
        string status "todo | in_progress | done"
        string priority
        date due_date
    }
    RESUMES {
        int id PK
        int user_id FK
        string title
        string original_filename
        int size_bytes
        string storage_key
        bool is_primary
    }
```

| Tabla | Para qué sirve | Reglas |
|---|---|---|
| `roles` | Tipos de cuenta: `developer` (talento junior) y `company` (empresa) | Nombre único |
| `users` | Cuentas | Correo único; la contraseña se guarda con hash |
| `profiles` | Perfil público de cada cuenta | Uno por usuario; las habilidades se guardan como lista JSON |
| `projects` | Evidencias: proyectos académicos, prácticas, voluntariados | Estado: `draft`, `open`, `active` o `closed` |
| `tasks` | Actividades de cada proyecto | Estado: `todo`, `in_progress` o `done`; se borran con su proyecto |
| `resumes` | Datos de cada CV | El archivo vive en disco; solo uno puede ser el principal |
