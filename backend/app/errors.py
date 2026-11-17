"""Manejo uniforme de errores en formato JSON."""
from flask import jsonify
from werkzeug.exceptions import HTTPException
 
 
class ApiError(Exception):
    def __init__(self, code, message, status=400, details=None):
        super().__init__(message)
        self.code = code
        self.message = message
        self.status = status
        self.details = details or {}
 
    def to_response(self):
        body = {"error": {"code": self.code, "message": self.message}}
        if self.details:
            body["error"]["details"] = self.details
        return jsonify(body), self.status
 
 
def register_error_handlers(app):
    @app.errorhandler(ApiError)
    def _handle_api_error(err):
        return err.to_response()
 
    @app.errorhandler(HTTPException)
    def _handle_http(err):
        return (
            jsonify({"error": {"code": err.name.lower().replace(" ", "_"),
                               "message": err.description}}),
            err.code,
        )
 
    @app.errorhandler(Exception)
    def _handle_unexpected(err):  # pragma: no cover - red de seguridad
        app.logger.exception("Error no controlado")
        return (
            jsonify({"error": {"code": "internal_error",
                               "message": "Error inesperado del servidor"}}),
            500,
        )
