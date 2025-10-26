import React, { useState } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { BovinoCard } from '../../components/bovino/BovinoCard';
import { BovinoForm } from '../../components/bovino/BovinoForm';
import { Button } from '../../components/common/Button';
import { useBovinos } from '../../hooks/useBovinos';
import type { Bovino } from '../../types/bovino.types';

export const MisBovinos: React.FC = () => {
  const { bovinos, loading, createBovino, updateBovino, deleteBovino } = useBovinos();
  const [showForm, setShowForm] = useState(false);
  const [editingBovino, setEditingBovino] = useState<Bovino | null>(null);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Mis Bovinos</h1>
            <p className="text-gray-600">Gestiona tu inventario ganadero</p>
          </div>
          
          {!showForm && !editingBovino && (
            <Button onClick={() => setShowForm(true)} variant="primary" className="px-8">
              + Registrar Bovino
            </Button>
          )}
        </div>

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
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin text-6xl mb-4">🐄</div>
              <p className="text-gray-600">Cargando bovinos...</p>
            </div>
          </div>
        ) : bovinos.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-md">
            <div className="text-8xl mb-4">🐄</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No tienes bovinos registrados
            </h3>
            <p className="text-gray-600 mb-6">
              Comienza registrando tu primer bovino
            </p>
            <Button onClick={() => setShowForm(true)} variant="primary">
              Registrar Primer Bovino
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
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};