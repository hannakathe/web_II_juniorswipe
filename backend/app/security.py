"""Hash de contraseñas, tokens JWT y decoradores de autorización."""
from datetime import datetime, timezone
from functools import wraps
 
import jwt
from flask import current_app, g, request
from werkzeug.security import check_password_hash, generate_password_hash
 
from .errors import ApiError
from .extensions import db
 
 
def hash_password(raw):
    return generate_password_hash(raw, method="pbkdf2:sha256")
 
 
def verify_password(raw, hashed):
    return check_password_hash(hashed, raw)
 
 
def create_access_token(user):
    now = datetime.now(timezone.utc)
    payload = {
        "sub": str(user.id),
        "email": user.email,
        "role": user.role.name if user.role else None,
        "iat": now,
        "exp": now + current_app.config["JWT_EXPIRES"],
    }
    return jwt.encode(
        payload,
        current_app.config["JWT_SECRET"],
        algorithm=current_app.config["JWT_ALGORITHM"],
    )
 
 
def decode_token(token):
    try:
        return jwt.decode(
            token,
            current_app.config["JWT_SECRET"],
            algorithms=[current_app.config["JWT_ALGORITHM"]],
        )
    except jwt.ExpiredSignatureError:
        raise ApiError("token_expired", "La sesión expiró, inicia sesión de nuevo", 401)
    except jwt.InvalidTokenError:
        raise ApiError("token_invalid", "El token de acceso no es válido", 401)
 
 
def _get_user(raw_id):
    # Importado aquí para evitar una importación circular al cargar el módulo.
    from .models.user import User
 
    try:
        return db.session.get(User, int(raw_id))
    except (TypeError, ValueError):
        return None
 
 
def _load_user_from_request():
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        raise ApiError("token_missing", "Se requiere un token Bearer", 401)
    data = decode_token(auth.split(" ", 1)[1].strip())
 
    user = _get_user(data.get("sub"))
    if user is None:
        raise ApiError("user_not_found", "El usuario del token ya no existe", 401)
    g.current_user = user
    g.token_claims = data
    return user
 
 
def jwt_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        _load_user_from_request()
        return fn(*args, **kwargs)
 
    return wrapper
 
 
def roles_required(*roles):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            user = _load_user_from_request()
            if user.role is None or user.role.name not in roles:
                raise ApiError(
                    "forbidden",
                    f"Se requiere uno de estos roles: {', '.join(roles)}",
                    403,
                )
            return fn(*args, **kwargs)
 
        return wrapper
 
    return decorator
 
 
def current_user():
    return getattr(g, "current_user", None)
