import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Contraseña muy corta");
      setLoading(false);
      return;
    }

    try {
      const result = await register(formData.email, formData.password);

      if (result.success) {
        toast.success("Cuenta creada!");
        navigate("/dashboard");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Error creando cuenta");
    }

    setLoading(false);
  };

  return (
    <div className="container py-4">
      <div className="card" style={{ maxWidth: "400px", margin: "0 auto" }}>
        <div className="card-header">
          <h2 className="text-center mb-0">Registro</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="group">
              <label className="label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input"
                required
                disabled={loading}
              />
            </div>

            <div className="group">
              <label className="label">Contraseña</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input"
                required
                minLength="6"
                disabled={loading}
              />
              <small className="error">Mínimo 6 caracteres</small>
            </div>

            <div className="group">
              <label className="label">Confirmar Contraseña</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className={`btn primary w-full ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? "Creando..." : "Registrarse"}
            </button>
          </form>

          <div className="text-center mt-3">
            <p>
              ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
