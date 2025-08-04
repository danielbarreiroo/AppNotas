import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { notesAPI } from "../services/api";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const response = await notesAPI.getAll();
      setNotes(response.data);
    } catch (error) {
      toast.error("Error al cargar las notas");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta nota?")) {
      try {
        await notesAPI.delete(id);
        setNotes(notes.filter((note) => note.id !== id));
        toast.success("Nota eliminada exitosamente");
      } catch (error) {
        toast.error("Error al eliminar la nota");
      }
    }
  };

  const filteredNotes = notes.filter((note) => {
    if (filter === "public") return note.is_public;
    if (filter === "private") return !note.is_public;
    return true;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="container py20">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <p className="mt20">Cargando notas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py20">
      <div className="flex flex-between items-center mb20">
        <h1>Mis Notas</h1>
        <Link to="/notes/create" className="btn btn-primary">
          Nueva Nota
        </Link>
      </div>

      <div className="mb20">
        <div className="flex gap-sm">
          <button
            className={`btn btn-small ${
              filter === "all" ? "btn-primary" : "btn-outline"
            }`}
            onClick={() => setFilter("all")}
          >
            Todas ({notes.length})
          </button>
          <button
            className={`btn btn-small ${
              filter === "private" ? "btn-primary" : "btn-outline"
            }`}
            onClick={() => setFilter("private")}
          >
            Privadas ({notes.filter((n) => !n.is_public).length})
          </button>
          <button
            className={`btn btn-small ${
              filter === "public" ? "btn-primary" : "btn-outline"
            }`}
            onClick={() => setFilter("public")}
          >
            Públicas ({notes.filter((n) => n.is_public).length})
          </button>
        </div>
      </div>

      {filteredNotes.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py20">
            <h3>No tienes notas aún</h3>
            <p className="mb20">¡Crea tu primera nota para comenzar!</p>
            <Link to="/notes/create" className="btn btn-primary">
              Crear Primera Nota
            </Link>
          </div>
        </div>
      ) : (
        <div className="notes-grid">
          {filteredNotes.map((note) => (
            <div key={note.id} className="card fade-in">
              <div className="card-header">
                <h3 className="m0">{note.title}</h3>
                <div className="flex flex-between items-center mt10">
                  <span
                    className={`text-sm ${
                      note.is_public ? "success" : "text-muted"
                    }`}
                  >
                    {note.is_public ? "Pública" : "Privada"}
                  </span>
                  <span className="text-sm text-muted">
                    {formatDate(note.created_at)}
                  </span>
                </div>
              </div>

              <div className="card-body">
                <p className="text-gray">
                  {note.content.length > 150
                    ? `${note.content.substring(0, 150)}...`
                    : note.content}
                </p>
                {note.category && (
                  <span className="text-sm font-medium text-gray">
                    Categoría: {note.category}
                  </span>
                )}
              </div>

              <div className="card-footer">
                <div className="flex gap-sm">
                  <Link
                    to={`/notes/${note.id}`}
                    className="btn btn-small btn-secondary"
                  >
                    Ver
                  </Link>
                  <Link
                    to={`/notes/${note.id}/edit`}
                    className="btn btn-small btn-primary"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="btn btn-small btn-danger"
                  >
                    Eliminar
                  </button>
                  {note.is_public && (
                    <Link
                      to={`/public/${note.id}`}
                      className="btn btn-small btn-outline"
                      target="_blank"
                    >
                      Ver Público
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
