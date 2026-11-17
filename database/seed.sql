-- JuniorSwipe — datos de prueba (idempotente). Ejecutar DESPUÉS de schema.sql:
--   psql "$DATABASE_URL" -f database/seed.sql
--
-- Usuarios de prueba (SOLO DESARROLLO LOCAL):
--   candidato -> dev@local.test     / Password123!
--   empresa   -> company@local.test / Password123!
-- El hash es pbkdf2:sha256 (werkzeug) de "Password123!".
-- La API también crea estos datos al arrancar cuando SEED_ON_STARTUP=true.

INSERT INTO roles (name, description) VALUES
    ('developer', 'Talento junior que busca oportunidades'),
    ('company',   'Empresa que contrata talento junior')
ON CONFLICT (name) DO NOTHING;

INSERT INTO users (email, password_hash, full_name, role_id)
SELECT 'dev@local.test',
       'pbkdf2:sha256:1000000$mdqosraMtdVinmk6$cab61b90e278429f27a16c106e4f0408332a6d296d819e945467207214569cf3',
       'Laura Gómez', r.id
FROM roles r WHERE r.name = 'developer'
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (email, password_hash, full_name, role_id)
SELECT 'company@local.test',
       'pbkdf2:sha256:1000000$mdqosraMtdVinmk6$cab61b90e278429f27a16c106e4f0408332a6d296d819e945467207214569cf3',
       'Estudio Creativo', r.id
FROM roles r WHERE r.name = 'company'
ON CONFLICT (email) DO NOTHING;

INSERT INTO profiles (user_id, headline, location, company_name, skills)
SELECT u.id,
       CASE u.email WHEN 'dev@local.test' THEN 'Diseñadora gráfica recién graduada'
                    ELSE 'Buscamos talento junior' END,
       'Bogotá, Colombia',
       CASE u.email WHEN 'company@local.test' THEN 'Estudio Creativo' ELSE NULL END,
       CASE u.email WHEN 'dev@local.test' THEN '["Figma", "Branding", "UX"]' ELSE '[]' END
FROM users u
WHERE u.email IN ('dev@local.test', 'company@local.test')
  AND NOT EXISTS (SELECT 1 FROM profiles p WHERE p.user_id = u.id);

INSERT INTO projects (owner_id, title, description, status, tech_stack)
SELECT u.id, 'Rebranding de cafetería',
       'Proyecto de grado: nueva identidad visual para una cafetería local.', 'active',
       'Figma, Illustrator, Branding'
FROM users u
WHERE u.email = 'dev@local.test'
  AND NOT EXISTS (SELECT 1 FROM projects p WHERE p.owner_id = u.id);

INSERT INTO tasks (project_id, title, status, priority)
SELECT p.id, t.title, t.status, t.priority
FROM projects p
JOIN users u ON u.id = p.owner_id AND u.email = 'dev@local.test'
CROSS JOIN (VALUES ('Investigación de marca', 'done', 'high'),
                   ('Diseño del logotipo', 'in_progress', 'high'),
                   ('Manual de marca', 'todo', 'medium')) AS t(title, status, priority)
WHERE p.title = 'Rebranding de cafetería'
  AND NOT EXISTS (SELECT 1 FROM tasks x WHERE x.project_id = p.id);
