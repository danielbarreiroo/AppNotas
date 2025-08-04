import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="container py-4">
      <div
        className="text-center"
        style={{ maxWidth: "800px", margin: "0 auto" }}
      >
        <div className="mb-4">
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: "bold",
              color: "#333",
              marginBottom: "1rem",
            }}
          >
            📝 Bienvenido a NotesApp
          </h1>
          <p
            style={{
              fontSize: "1.25rem",
              color: "#666",
              marginBottom: "2rem",
              lineHeight: "1.6",
            }}
          >
            La aplicación perfecta para organizar tus ideas, pensamientos y
            recordatorios. Crea, organiza y comparte tus notas de manera fácil y
            segura.
          </p>
        </div>

        <div className="grid grid-cols-3 mb-4" style={{ marginBottom: "3rem" }}>
          <div className="card">
            <div className="card-body text-center">
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🔒</div>
              <h3 style={{ marginBottom: "0.5rem" }}>Privacidad</h3>
              <p style={{ color: "#666", fontSize: "14px" }}>
                Tus notas son privadas por defecto. Solo tú puedes verlas.
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-body text-center">
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>📁</div>
              <h3 style={{ marginBottom: "0.5rem" }}>Organización</h3>
              <p style={{ color: "#666", fontSize: "14px" }}>
                Organiza tus notas con categorías personalizables.
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-body text-center">
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🔗</div>
              <h3 style={{ marginBottom: "0.5rem" }}>Compartir</h3>
              <p style={{ color: "#666", fontSize: "14px" }}>
                Comparte notas públicas mediante enlaces únicos.
              </p>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: "2rem" }}>
          {isAuthenticated ? (
            <div>
              <h2 style={{ marginBottom: "1rem" }}>¡Bienvenido de vuelta!</h2>
              <p style={{ marginBottom: "1.5rem", color: "#666" }}>
                Continúa trabajando en tus notas o crea una nueva.
              </p>
              <div className="d-flex justify-center gap-3">
                <Link to="/dashboard" className="btn btn-primary">
                  Ver Mis Notas
                </Link>
                <Link to="/notes/create" className="btn btn-success">
                  Crear Nueva Nota
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <h2 style={{ marginBottom: "1rem" }}>¿Listo para comenzar?</h2>
              <p style={{ marginBottom: "1.5rem", color: "#666" }}>
                Únete a miles de usuarios que ya organizan sus ideas con
                NotesApp.
              </p>
              <div className="d-flex justify-center gap-3">
                <Link to="/register" className="btn btn-primary">
                  Registrarse Gratis
                </Link>
                <Link to="/login" className="btn btn-outline">
                  Iniciar Sesión
                </Link>
              </div>
            </div>
          )}
        </div>

        <div style={{ marginTop: "3rem" }}>
          <h2 style={{ marginBottom: "2rem" }}>Características principales</h2>
          <div className="grid grid-cols-2 gap-3">
            <div style={{ textAlign: "left", padding: "1rem" }}>
              <h4 style={{ color: "#007bff", marginBottom: "0.5rem" }}>
                ✍️ Editor de Texto
              </h4>
              <p style={{ color: "#666", fontSize: "14px" }}>
                Escribe con un editor de texto enriquecido que soporta formato y
                estructura.
              </p>
            </div>

            <div style={{ textAlign: "left", padding: "1rem" }}>
              <h4 style={{ color: "#007bff", marginBottom: "0.5rem" }}>
                🖼️ Imágenes
              </h4>
              <p style={{ color: "#666", fontSize: "14px" }}>
                Añade imágenes a tus notas para hacerlas más expresivas y
                completas.
              </p>
            </div>

            <div style={{ textAlign: "left", padding: "1rem" }}>
              <h4 style={{ color: "#007bff", marginBottom: "0.5rem" }}>
                🔍 Búsqueda
              </h4>
              <p style={{ color: "#666", fontSize: "14px" }}>
                Encuentra rápidamente cualquier nota usando nuestra función de
                búsqueda.
              </p>
            </div>

            <div style={{ textAlign: "left", padding: "1rem" }}>
              <h4 style={{ color: "#007bff", marginBottom: "0.5rem" }}>
                📱 Responsive
              </h4>
              <p style={{ color: "#666", fontSize: "14px" }}>
                Accede a tus notas desde cualquier dispositivo, móvil, tablet o
                escritorio.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
