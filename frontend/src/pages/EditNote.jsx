import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { notesAPI, categoriesAPI } from "../services/api";
import toast from "react-hot-toast";

const EditNote = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category_id: "",
    is_public: false,
  });
  const [categories, setCategories] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingNote, setLoadingNote] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    loadNote();
    loadCategories();
  }, [id]);

  const loadNote = async () => {
    try {
      const response = await notesAPI.getById(id);
      const note = response.data;

      setFormData({
        title: note.title,
        content: note.content,
        category_id: note.category_id || "",
        is_public: note.is_public,
      });

      if (note.image_path) {
        setCurrentImage(note.image_path);
      }
    } catch (error) {
      toast.error("Error cargando nota");
      navigate("/dashboard");
    }
    setLoadingNote(false);
  };

  const loadCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      toast.error("Error cargando categorías");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("La imagen debe ser menor a 5MB");
        return;
      }

      setSelectedImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setCurrentImage(null);
    document.getElementById("image").value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const noteData = {
        ...formData,
        category_id: formData.category_id || null,
      };

      if (selectedImage) {
        noteData.image = selectedImage;
      }

      await notesAPI.update(id, noteData);
      toast.success("Nota actualizada");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Error actualizando nota");
    }

    setLoading(false);
  };

  if (loadingNote) {
    return (
      <div className="container py-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4">Cargando nota...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="card" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div className="card-header">
          <h2>Editar Nota</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="group">
              <label className="label">Título *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input"
                required
                disabled={loading}
                maxLength="255"
              />
            </div>

            <div className="group">
              <label className="label">Categoría</label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="select"
                disabled={loading}
              >
                <option value="">Sin categoría</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="group">
              <label className="label">Contenido *</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="textarea"
                rows="10"
                required
                disabled={loading}
                placeholder="Escribe aquí el contenido de tu nota..."
              />
            </div>

            <div className="group">
              <label className="label">Imagen</label>

              {currentImage && !imagePreview && (
                <div className="mb-3">
                  <div className="d-flex justify-between align-center mb-2">
                    <span>Imagen actual:</span>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="btn danger small"
                    >
                      Eliminar imagen
                    </button>
                  </div>
                  <img
                    src={`http://localhost:5000/${currentImage}`}
                    alt="Imagen actual"
                    style={{
                      maxWidth: "300px",
                      maxHeight: "200px",
                      borderRadius: "5px",
                      border: "1px solid #ddd",
                    }}
                  />
                </div>
              )}

              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="input"
                disabled={loading}
              />

              {imagePreview && (
                <div className="mt-2">
                  <div className="d-flex justify-between align-center mb-2">
                    <span>Nueva imagen:</span>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="btn danger small"
                    >
                      Cancelar cambio
                    </button>
                  </div>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: "300px",
                      maxHeight: "200px",
                      borderRadius: "5px",
                      border: "1px solid #ddd",
                    }}
                  />
                </div>
              )}
            </div>

            <div className="group">
              <label className="d-flex align-center gap-2">
                <input
                  type="checkbox"
                  name="is_public"
                  checked={formData.is_public}
                  onChange={handleChange}
                  className="checkbox"
                  disabled={loading}
                />
                Hacer esta nota pública
              </label>
              <small style={{ color: "#666", fontSize: "12px" }}>
                Las notas públicas pueden ser vistas por cualquier persona con
                el enlace
              </small>
            </div>

            <div className="d-flex gap-2 justify-between">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="btn secondary"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={`btn primary ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                {loading ? "Actualizando..." : "Actualizar Nota"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditNote;
