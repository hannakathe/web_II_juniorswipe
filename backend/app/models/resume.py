from datetime import datetime, timezone

from ..extensions import db


def _utcnow():
    return datetime.now(timezone.utc)


class Resume(db.Model):
    """Datos del CV. El archivo se guarda en disco (STORAGE_DIR);
    en la base de datos solo se guarda una referencia segura (storage_key)."""

    __tablename__ = "resumes"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    title = db.Column(db.String(150), nullable=False)
    summary = db.Column(db.Text)
    original_filename = db.Column(db.String(255))
    content_type = db.Column(db.String(100))
    size_bytes = db.Column(db.Integer, default=0)
    storage_key = db.Column(db.String(255))  # ruta relativa dentro de STORAGE_DIR
    is_primary = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=_utcnow)
    updated_at = db.Column(db.DateTime, default=_utcnow, onupdate=_utcnow)

    user = db.relationship("User", back_populates="resumes")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "summary": self.summary,
            "original_filename": self.original_filename,
            "content_type": self.content_type,
            "size_bytes": self.size_bytes,
            "is_primary": self.is_primary,
            "has_file": bool(self.storage_key),
            "download_url": f"/api/resumes/{self.id}/file" if self.storage_key else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }