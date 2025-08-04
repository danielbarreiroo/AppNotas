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
          <div className="card-body text-center py-4">
            <h3>No tienes notas aún</h3>
            <p className="mb-3">¡Crea tu primera nota para comenzar!</p>
            <Link to="/notes/create" className="btn btn-primary">
              Crear Primera Nota
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredNotes.map((note) => (
            <div key={note.id} className="card">
              <div className="card-body">
                <div className="d-flex justify-between align-center mb-2">
                  <h3 style={{ margin: 0, fontSize: "1.25rem" }}>
                    <Link
                      to={`/notes/view/${note.id}`}
                      style={{ textDecoration: "none", color: "#333" }}
                    >
                      {note.title}
                    </Link>
                  </h3>
                  <div className="d-flex gap-2">
                    {note.is_public && (
                      <span className="badge badge-success">Pública</span>
                    )}
                    <Link
                      to={`/notes/edit/${note.id}`}
                      className="btn btn-outline btn-small"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="btn btn-danger btn-small"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
                <div className="mb-2">
                  <span className="badge badge-secondary">
                    {note.category_name || "Sin categoría"}
                  </span>
                </div>
                <p
                  style={{
                    color: "#666",
                    margin: "0.5rem 0",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {note.content}
                </p>
                <div
                  className="d-flex justify-between align-center"
                  style={{ fontSize: "12px", color: "#999" }}
                >
                  <span>Creada: {formatDate(note.created_at)}</span>
                  {note.updated_at !== note.created_at && (
                    <span>Editada: {formatDate(note.updated_at)}</span>
                  )}
                </div>
                {note.is_public && (
                  <div className="mt-2">
                    <small style={{ color: "#007bff" }}>
                      Enlace público:
                      <a
                        href={`${window.location.origin}/public/note/${note.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2"
                      >
                        Ver enlace público
                      </a>
                    </small>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
const Badge = ({ children, variant = "secondary" }) => {
  const styles = {
    secondary: { backgroundColor: "#6c757d", color: "white" },
    success: { backgroundColor: "#28a745", color: "white" },
  };
  return (
    <span
      style={{
        ...styles[variant],
        padding: "4px 8px",
        borderRadius: "4px",
        fontSize: "12px",
        fontWeight: "500",
      }}
    >
      {children}
    </span>
  );
};
const badge = (variant) => (props) => <Badge variant={variant} {...props} />;
Dashboard.Badge = Badge;
Dashboard.badge = badge;
export default Dashboard;
