import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { notesAPI } from "../services/api";
import toast from "react-hot-toast";

const ViewNote = () => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadNote();
  }, [id]);

  const loadNote = async () => {
    try {
      const response = await notesAPI.getById(id);
      setNote(response.data);
    } catch (error) {
      toast.error("Error cargando nota");
      navigate("/dashboard");
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta nota?")) {
      try {
        await notesAPI.delete(id);
        toast.success("Nota eliminada");
        navigate("/dashboard");
      } catch (error) {
        toast.error("Error eliminando nota");
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const copyPublicLink = () => {
    const publicUrl = `${window.location.origin}/public/note/${note.id}`;
    navigator.clipboard.writeText(publicUrl);
    toast.success("Enlace copiado");
  };

  if (loading) {
    return (
      <div className="container py-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4">Cargando nota...</p>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="container py-4">
        <div className="card">
          <div className="card-body text-center">
            <h3>Nota no encontrada</h3>
            <Link to="/dashboard" className="btn btn-primary">
              Volver al Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="card" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div className="card-header">
          <div className="d-flex justify-between align-center">
            <div>
              <h1 style={{ margin: 0, fontSize: "1.75rem" }}>{note.title}</h1>
              <div className="d-flex gap-2 mt-2">
                {note.category_name && (
                  <span
                    style={{
                      backgroundColor: "#007bff",
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                    }}
                  >
                    {note.category_name}
                  </span>
                )}
                {note.is_public && (
                  <span
                    style={{
                      backgroundColor: "#28a745",
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                    }}
                  >
                    Pública
                  </span>
                )}
              </div>
            </div>
            <div className="d-flex gap-2">
              <Link
                to={`/notes/edit/${note.id}`}
                className="btn btn-outline btn-small"
              >
                Editar
              </Link>
              <button
                onClick={handleDelete}
                className="btn btn-danger btn-small"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>

        <div className="card-body">
          {note.image_path && (
            <div className="mb-4">
              <img
                src={`http://localhost:5000/${note.image_path}`}
                alt="Imagen de la nota"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
            </div>
          )}

          <div
            style={{
              whiteSpace: "pre-wrap",
              lineHeight: "1.6",
              fontSize: "16px",
            }}
          >
            {note.content}
          </div>
        </div>

        <div className="card-footer">
          <div
            className="d-flex justify-between align-center"
            style={{ fontSize: "14px", color: "#666" }}
          >
            <div>
              <div>Creada: {formatDate(note.created_at)}</div>
              {note.updated_at !== note.created_at && (
                <div>Última edición: {formatDate(note.updated_at)}</div>
              )}
            </div>

            {note.is_public && (
              <div>
                <button
                  onClick={copyPublicLink}
                  className="btn btn-outline btn-small"
                >
                  Copiar enlace público
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="text-center mt-4">
        <Link to="/dashboard" className="btn btn-secondary">
          ← Volver a Mis Notas
        </Link>
      </div>
    </div>
  );
};

export default ViewNote;
