from flask import Blueprint, g, jsonify
 
from ..security import jwt_required
 
users_bp = Blueprint("users", __name__, url_prefix="/api/users")
 
 
@users_bp.get("/me")
@jwt_required
def get_me():
    """Resumen del usuario autenticado: perfil y conteo de CV y proyectos."""
    user = g.current_user
    return jsonify({
        **user.to_dict(),
        "profile": user.profile.to_dict() if user.profile else None,
        "resume_count": len(user.resumes),
        "project_count": len(user.projects),
    }), 200
