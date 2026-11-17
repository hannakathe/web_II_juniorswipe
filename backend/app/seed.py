"""Datos semilla idempotentes: roles y dos usuarios de prueba (candidato y empresa)."""
from .extensions import db
from .models.profile import Profile
from .models.project import Project
from .models.task import Task
from .models.user import Role, User
from .security import hash_password
 
ROLES = [
    ("developer", "Talento junior que busca oportunidades"),
    ("company", "Empresa que contrata talento junior"),
]
 
DEMO_USERS = [
    {
        "email": "dev@local.test",
        "password": "Password123!",
        "full_name": "Laura Gómez",
        "role": "developer",
        "headline": "Diseñadora gráfica recién graduada",
    },
    {
        "email": "company@local.test",
        "password": "Password123!",
        "full_name": "Estudio Creativo",
        "role": "company",
        "headline": "Buscamos talento junior",
    },
]
 
 
def seed(app):
    with app.app_context():
        for name, desc in ROLES:
            if not Role.query.filter_by(name=name).first():
                db.session.add(Role(name=name, description=desc))
        db.session.commit()
 
        roles = {r.name: r for r in Role.query.all()}
        created = 0
        for spec in DEMO_USERS:
            if User.query.filter_by(email=spec["email"]).first():
                continue
            user = User(
                email=spec["email"],
                password_hash=hash_password(spec["password"]),
                full_name=spec["full_name"],
                role_id=roles[spec["role"]].id,
            )
            db.session.add(user)
            db.session.flush()
            profile = Profile(
                user_id=user.id,
                headline=spec["headline"],
                location="Bogotá, Colombia",
                company_name=spec["full_name"] if spec["role"] == "company" else None,
            )
            if spec["role"] == "developer":
                profile.skills_list = ["Figma", "Branding", "UX"]
            db.session.add(profile)
            created += 1
        db.session.commit()
 
        # Un proyecto de ejemplo con actividades para que las listas no salgan vacías.
        dev = User.query.filter_by(email="dev@local.test").first()
        if dev and not Project.query.filter_by(owner_id=dev.id).first():
            proj = Project(
                owner_id=dev.id,
                title="Rebranding de cafetería",
                description="Proyecto de grado: nueva identidad visual para una cafetería local.",
                status="active",
                tech_stack="Figma, Illustrator, Branding",
            )
            db.session.add(proj)
            db.session.flush()
            db.session.add_all([
                Task(project_id=proj.id, title="Investigación de marca", status="done",
                     priority="high"),
                Task(project_id=proj.id, title="Diseño del logotipo", status="in_progress",
                     priority="high"),
                Task(project_id=proj.id, title="Manual de marca", status="todo",
                     priority="medium"),
            ])
            db.session.commit()
 
        app.logger.info("Semilla completa (%d usuarios nuevos)", created)
