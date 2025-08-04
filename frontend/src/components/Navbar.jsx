import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada exitosamente");
    navigate("/");
  };

  return (
    <nav
      style={{
        backgroundColor: "#fff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        padding: "0",
      }}
    >
      <div className="container">
        <div
          className="flex flex-between items-center"
          style={{ height: "64px" }}
        >
          <Link
            to={isAuthenticated ? "/dashboard" : "/"}
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#007bff",
              textDecoration: "none",
            }}
          >
            📝 NotesApp
          </Link>

          <div className="flex items-center gap-md">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="btn btn-outline btn-small">
                  Mis Notas
                </Link>
                <Link to="/notes/create" className="btn btn-primary btn-small">
                  Nueva Nota
                </Link>
                <Link to="/categories" className="btn btn-outline btn-small">
                  Categorías
                </Link>
                <div className="flex items-center gap-sm">
                  <span style={{ fontSize: "14px", color: "#666" }}>
                    {user?.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="btn btn-secondary btn-small"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline btn-small">
                  Iniciar Sesión
                </Link>
                <Link to="/register" className="btn btn-primary btn-small">
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
