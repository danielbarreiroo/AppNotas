import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "../services/api";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "" });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (error) {
      toast.error("Error al cargar categorías");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("El nombre de la categoría es requerido");
      return;
    }

    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, formData);
        toast.success("Categoría actualizada correctamente");
      } else {
        await api.post("/categories", formData);
        toast.success("Categoría creada correctamente");
      }

      setFormData({ name: "" });
      setShowForm(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error al guardar categoría"
      );
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name });
    setShowForm(true);
  };

  const handleDelete = async (categoryId) => {
    if (
      !window.confirm("¿Estás seguro de que quieres eliminar esta categoría?")
    ) {
      return;
    }

    try {
      await api.delete(`/categories/${categoryId}`);
      toast.success("Categoría eliminada correctamente");
      fetchCategories();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error al eliminar categoría"
      );
    }
  };

  const resetForm = () => {
    setFormData({ name: "" });
    setShowForm(false);
    setEditingCategory(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando categorías...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Gestión de Categorías
            </h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              {showForm ? "Cancelar" : "Nueva Categoría"}
            </button>
          </div>

          {showForm && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">
                {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nombre de la categoría
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Trabajo, Personal, Estudios..."
                    maxLength={100}
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                  >
                    {editingCategory ? "Actualizar" : "Crear"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Categorías Existentes</h2>
            {categories.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No hay categorías disponibles. Crea tu primera categoría.
              </p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {category.created_by
                            ? "Categoría personal"
                            : "Categoría del sistema"}
                        </p>
                        {category.created_at && (
                          <p className="text-xs text-gray-400 mt-1">
                            Creada:{" "}
                            {new Date(category.created_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      {category.created_by && (
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => handleEdit(category)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(category.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
