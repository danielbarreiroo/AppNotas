import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { publicAPI } from '../services/api';

const PublicNote = () => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    loadNote();
  }, [id]);

  const loadNote = async () => {
    try {
      const response = await publicAPI.getNote(id);
      setNote(response.data);
    } catch (error) {
      setError('Nota no encontrada o no es pública');
    }
    setLoading(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  if (error) {
    return (
      <div className="container py-4">
        <div className="card">
          <div className="card-body text-center">
            <h3>❌ Nota no encontrada</h3>
            <p>{error}</p>
            <Link to="/" className="btn btn-primary">
              Ir al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>

        <div className="card-header">
          <div className="text-center">
            <span style={{
              backgroundColor: '#28a745',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              📖 Nota Pública
            </span>
            <h1 style={{ margin: '1rem 0 0.5rem 0', fontSize: '1.75rem' }}>
              {note.title}
            </h1>
            {note.category_name && (
              <span style={{
                backgroundColor: '#007bff',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                {note.category_name}
              </span>
            )}
          </div>
        </div>


        <div className="card-body">

          {note.image_path && (
            <div className="mb-4">
              <img 
                src={`http://localhost:5000/${note.image_path}`} 
                alt="Imagen de la nota" 
                style={{ 
                  maxWidth: '100%', 
                  height: 'auto',
                  borderRadius: '8px',
                  border: '1px solid #ddd'
                }} 
              />
            </div>
          )}


          <div style={{ 
            whiteSpace: 'pre-wrap',
            lineHeight: '1.6',
            fontSize: '16px'
          }}>
            {note.content}
          </div>
        </div>


        <div className="card-footer">
          <div className="text-center" style={{ fontSize: '14px', color: '#666' }}>
            <div>Publicada el: {formatDate(note.created_at)}</div>
            {note.updated_at !== note.created_at && (
              <div>Última edición: {formatDate(note.updated_at)}</div>
            )}
            <div className="mt-2">
              Por: {note.user_email}
            </div>
          </div>
        </div>
      </div>


      <div className="card mt-4" style={{ maxWidth: '800px', margin: '2rem auto 0' }}>
        <div className="card-body text-center">
          <h3>¿Te gustó esta nota?</h3>
          <p>Únete a NotesApp y crea tus propias notas</p>
          <div className="d-flex gap-2 justify-center">
            <Link to="/register" className="btn btn-primary">
              Registrarse Gratis
            </Link>
            <Link to="/login" className="btn btn-outline">
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicNote;
