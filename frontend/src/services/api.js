import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (email, password) =>
    api.post("/auth/register", { email, password }),
  login: (email, password) => api.post("/auth/login", { email, password }),
  verifyToken: () => api.get("/auth/verify"),
};

export const notesAPI = {
  getAll: () => api.get("/notes"),
  getById: (id) => api.get(`/notes/${id}`),
  create: (noteData) => {
    const formData = new FormData();
    Object.keys(noteData).forEach((key) => {
      if (noteData[key] !== null && noteData[key] !== undefined) {
        formData.append(key, noteData[key]);
      }
    });
    return api.post("/notes", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  update: (id, noteData) => {
    const formData = new FormData();
    Object.keys(noteData).forEach((key) => {
      if (noteData[key] !== null && noteData[key] !== undefined) {
        formData.append(key, noteData[key]);
      }
    });
    return api.put(`/notes/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  delete: (id) => api.delete(`/notes/${id}`),
};

export const categoriesAPI = {
  getAll: () => api.get("/categories"),
  create: (name) => api.post("/categories", { name }),
  update: (id, name) => api.put(`/categories/${id}`, { name }),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const publicAPI = {
  getNote: (id) => axios.get(`${API_URL}/public/notes/${id}`),
};

export default api;
