import React, { useState } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { BovinoCard } from '../../components/bovino/BovinoCard';
import { BovinoForm } from '../../components/bovino/BovinoForm';
import { PublicarBovinoModal } from '../../components/marketplace/PublicarBovinoModal';
import { Button } from '../../components/common/Button';
import { useBovinos } from '../../hooks/useBovinos';
import { useMarketplace } from '../../hooks/useMarketplace';
import type { Bovino } from '../../types/bovino.types';
import type { CrearPublicacionData } from '../../types/marketplace.types';

export const MisBovinos: React.FC = () => {
  const { bovinos, loading, createBovino, updateBovino, deleteBovino } = useBovinos();
  const { crearPublicacion, error: marketplaceError, setError } = useMarketplace();
  const [showForm, setShowForm] = useState(false);
  const [editingBovino, setEditingBovino] = useState<Bovino | null>(null);
  const [publicandoBovino, setPublicandoBovino] = useState<Bovino | null>(null);

  const handleCreate = async (data: Partial<Bovino>) => {
    await createBovino(data);
    setShowForm(false);
  };

  const handleUpdate = async (data: Partial<Bovino>) => {
    if (editingBovino) {
      await updateBovino(editingBovino.id, data);
      setEditingBovino(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este bovino?')) {
      await deleteBovino(id);
    }
  };

  const handlePublicar = (bovino: Bovino) => {
    setPublicandoBovino(bovino);
  };

  const handleConfirmarPublicacion = async (data: CrearPublicacionData) => {
    const publicacion = await crearPublicacion(data);
    if (publicacion) {
      setPublicandoBovino(null);
      // Mostrar mensaje de éxito
      const mensaje = document.createElement('div');
      mensaje.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-fade-in';
      mensaje.innerHTML = `
        <div class="flex items-center gap-2">
          <span class="text-2xl">✅</span>
          <div>
            <p class="font-bold">¡Publicación creada!</p>
            <p class="text-sm">Tu bovino ya está en el marketplace</p>
          </div>
        </div>
      `;
      document.body.appendChild(mensaje);
      setTimeout(() => {
        mensaje.remove();
      }, 4000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent mb-3 flex items-center gap-3">
              🐮 Mis Bovinos
            </h1>
            <p className="text-lg text-gray-600">Gestiona tu inventario ganadero de forma profesional</p>
            {bovinos.length > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                📊 Total de bovinos registrados: <span className="font-bold text-green-600">{bovinos.length}</span>
              </p>
            )}
          </div>
          
          {!showForm && !editingBovino && (
            <Button 
              onClick={() => setShowForm(true)} 
              variant="primary" 
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all"
            >
              ➕ Registrar Bovino
            </Button>
          )}
        </div>

        {/* Mensaje de error del marketplace */}
        {marketplaceError && (
          <div className="mb-6 p-5 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl flex justify-between items-start shadow-lg">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{marketplaceError}</span>
            </div>
            <button 
              onClick={() => setError(null)} 
              className="text-red-700 hover:text-red-900 font-bold text-xl"
            >
              ✕
            </button>
          </div>
        )}

        {(showForm || editingBovino) && (
          <div className="mb-8">
            <BovinoForm
              bovino={editingBovino || undefined}
              onSubmit={editingBovino ? handleUpdate : handleCreate}
              onCancel={() => {
                setShowForm(false);
                setEditingBovino(null);
              }}
            />
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="text-center">
              <div className="animate-bounce text-8xl mb-6">🐄</div>
              <div className="flex items-center gap-2 justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-green-600"></div>
                <p className="text-xl font-semibold text-gray-700">Cargando bovinos...</p>
              </div>
            </div>
          </div>
        ) : bovinos.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl shadow-2xl border-2 border-dashed border-gray-300">
            <div className="text-9xl mb-6 opacity-50">🐄</div>
            <h3 className="text-3xl font-extrabold text-gray-800 mb-3">
              No tienes bovinos registrados
            </h3>
            <p className="text-gray-600 mb-8 text-lg">
              Comienza registrando tu primer bovino para gestionar tu inventario
            </p>
            <Button 
              onClick={() => setShowForm(true)} 
              variant="primary"
              className="px-10 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all"
            >
              ➕ Registrar Primer Bovino
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bovinos.map((bovino) => (
              <BovinoCard
                key={bovino.id}
                bovino={bovino}
                onEdit={() => setEditingBovino(bovino)}
                onDelete={() => handleDelete(bovino.id)}
                onPublicar={() => handlePublicar(bovino)}
              />
            ))}
          </div>
        )}

        {/* Modal de publicación */}
        {publicandoBovino && (
          <PublicarBovinoModal
            bovino={publicandoBovino}
            onSubmit={handleConfirmarPublicacion}
            onCancel={() => setPublicandoBovino(null)}
          />
        )}
      </div>
    </div>
  );
};