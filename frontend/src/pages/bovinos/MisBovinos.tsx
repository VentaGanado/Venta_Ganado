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
      const mensaje = document.createElement('div');
      mensaje.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50';
      mensaje.innerHTML = `
        <div class="flex items-center gap-2">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
          </svg>
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Bovinos</h1>
            <p className="text-sm text-gray-600">Gestiona tu inventario ganadero</p>
            {bovinos.length > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                Total: <span className="font-semibold text-green-600">{bovinos.length}</span> {bovinos.length === 1 ? 'bovino' : 'bovinos'}
              </p>
            )}
          </div>
          
          {!showForm && !editingBovino && (
            <Button 
              onClick={() => setShowForm(true)} 
              variant="primary" 
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              + Registrar Bovino
            </Button>
          )}
        </div>

        {/* Mensaje de error del marketplace */}
        {marketplaceError && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg flex justify-between items-start">
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
              &times;
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
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent mb-4 mx-auto"></div>
              <p className="text-lg font-medium text-gray-600">Cargando bovinos...</p>
            </div>
          </div>
        ) : bovinos.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow border border-gray-200">
            <svg className="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              No tienes bovinos registrados
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Comienza registrando tu primer bovino para gestionar tu inventario ganadero
            </p>
            <Button 
              onClick={() => setShowForm(true)} 
              variant="primary"
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              + Registrar Primer Bovino
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
