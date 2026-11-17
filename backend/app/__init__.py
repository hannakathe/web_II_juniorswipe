"""Fábrica de la aplicación Flask de JuniorSwipe."""
import os
 
from flask import Flask, jsonify
from flask_cors import CORS
 
from .config import get_config
from .errors import register_error_handlers
from .extensions import db
 
 
def create_app(config_name=None):
    app = Flask(__name__)
    app.config.from_object(get_config(config_name))
 
    db.init_app(app)
    CORS(
        app,
        resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}},
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    )
 
    os.makedirs(app.config["STORAGE_DIR"], exist_ok=True)
 
    from . import models  # noqa: F401  (registra los modelos en SQLAlchemy)
    from .routes import ALL_BLUEPRINTS
 
    for bp in ALL_BLUEPRINTS:
        app.register_blueprint(bp)
 
    register_error_handlers(app)
 
    @app.get("/")
    def index():
        return jsonify({
            "service": "juniorswipe-api",
            "status": "running",
            "docs": "/api/health, /api/auth/*, /api/profiles/me, /api/projects, /api/tasks",
        })
 
    with app.app_context():
        db.create_all()
        if app.config.get("SEED_ON_STARTUP"):
            from .seed import seed
            seed(app)
 
    return app
