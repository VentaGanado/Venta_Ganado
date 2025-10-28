import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/layout/Navbar';
import { HistorialSanitario } from '../../components/bovino/HistorialSanitario';
import { Button } from '../../components/common/Button';
import { bovinoApi } from '../../api/bovino.api';
import type { Bovino, RegistroSanitario, RegistroReproductivo } from '../../types/bovino.types';

const API_URL = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:3000/uploads';

export const DetalleBovino: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bovino, setBovino] = useState<Bovino | null>(null);
  const [historialSanitario, setHistorialSanitario] = useState<RegistroSanitario[]>([]);
  const [historialReproductivo, setHistorialReproductivo] = useState<RegistroReproductivo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'sanitario' | 'reproductivo'>('general');

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await bovinoApi.getById(parseInt(id!));
      console.log('Bovino cargado:', data);
      setBovino(data);
      
      // Intentar cargar historial sanitario (puede no estar implementado)
      try {
        const sanitario = await bovinoApi.getSanitario(parseInt(id!));
        setHistorialSanitario(sanitario);
      } catch (err) {
        console.log('Historial sanitario no disponible');
        setHistorialSanitario([]);
      }
      
      // Intentar cargar historial reproductivo (puede no estar implementado)
      try {
        const reproductivo = await bovinoApi.getReproductivo(parseInt(id!));
        setHistorialReproductivo(reproductivo);
      } catch (err) {
        console.log('Historial reproductivo no disponible');
        setHistorialReproductivo([]);
      }
    } catch (error) {
      console.error('Error al cargar bovino:', error);
      setBovino(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    try {
      setUploadingPhotos(true);
      const files = Array.from(e.target.files);
      await bovinoApi.uploadFotos(parseInt(id!), files);
      await fetchData();
    } catch (error) {
      console.error('Error al subir fotos:', error);
      alert('Error al subir fotos');
    } finally {
      setUploadingPhotos(false);
    }
  };

  const handleAddSanitario = async (data: Partial<RegistroSanitario>) => {
    await bovinoApi.addSanitario(parseInt(id!), data);
    await fetchData();
  };

  const handleAddReproductivo = async (data: Partial<RegistroReproductivo>) => {
    await bovinoApi.addReproductivo(parseInt(id!), data);
    await fetchData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
        <Navbar />
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="animate-spin text-6xl mb-4">🐄</div>
            <p className="text-gray-600">Cargando información...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!bovino) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Bovino no encontrado</h2>
          <Button onClick={() => navigate('/bovinos')} variant="primary">
            Volver a Mis Bovinos
          </Button>
        </div>
      </div>
    );
  }

  const calcularEdad = (fechaNacimiento?: string) => {
    if (!fechaNacimiento) {
      return { años: 0, meses: 0, total: 0 };
    }
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    const meses = (hoy.getFullYear() - nacimiento.getFullYear()) * 12 + (hoy.getMonth() - nacimiento.getMonth());
    const años = Math.floor(meses / 12);
    const mesesRestantes = meses % 12;
    return { años, meses: mesesRestantes, total: meses };
  };

  const edad = bovino.fecha_nacimiento 
    ? calcularEdad(bovino.fecha_nacimiento) 
    : bovino.edad 
      ? { años: bovino.edad, meses: 0, total: bovino.edad * 12 }
      : { años: 0, meses: 0, total: 0 };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button onClick={() => navigate('/bovinos')} variant="outline" className="mb-4">
            ← Volver
          </Button>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Foto principal */}
              <div className="md:w-1/3">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-green-100 to-green-200">
                  {bovino.foto_principal ? (
                    <img
                      src={`${API_URL}/${bovino.foto_principal}`}
                      alt={bovino.raza}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-8xl">🐄</div>
                  )}
                </div>

                {/* Subir fotos */}
                <div className="mt-4">
                  <label className="block w-full">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleUploadPhotos}
                      disabled={uploadingPhotos}
                      className="hidden"
                    />
                    <div className="w-full bg-green-600 text-white px-4 py-2 rounded-lg text-center cursor-pointer hover:bg-green-700 transition">
                      {uploadingPhotos ? 'Subiendo...' : '📷 Subir Fotos'}
                    </div>
                  </label>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Máximo 10 fotos • JPG, PNG
                  </p>
                </div>

                {/* Galería de fotos */}
                {bovino.fotografias && bovino.fotografias.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {bovino.fotografias.map((foto) => (
                      <div key={foto.id} className="aspect-square rounded-lg overflow-hidden border-2 border-green-200">
                        <img
                          src={`${API_URL}/${foto.ruta_imagen}`}
                          alt="Foto del bovino"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Información principal */}
              <div className="md:w-2/3">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    {bovino.nombre && (
                      <p className="text-lg text-green-600 font-semibold mb-1">
                        {bovino.nombre}
                      </p>
                    )}
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{bovino.raza}</h1>
                    <p className="text-gray-600">
                      {bovino.sexo === 'M' ? 'Macho' : 'Hembra'} • {edad.años > 0 ? `${edad.años}a ${edad.meses}m` : bovino.edad ? `${bovino.edad} años` : 'Edad no disponible'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {bovino.codigo_interno && (
                      <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-medium">
                        {bovino.codigo_interno}
                      </span>
                    )}
                    {bovino.estado && (
                      <span className={`px-4 py-2 rounded-full font-medium ${
                        bovino.estado === 'Disponible' ? 'bg-green-100 text-green-800' :
                        bovino.estado === 'En negociación' ? 'bg-yellow-100 text-yellow-800' :
                        bovino.estado === 'Vendido' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {bovino.estado}
                      </span>
                    )}
                  </div>
                </div>

                {/* Grid de datos */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600 mb-1">Peso Actual</p>
                    <p className="text-2xl font-bold text-green-700">{bovino.peso || bovino.peso_actual || 'N/A'} kg</p>
                  </div>

                  {bovino.valor_estimado && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-600 mb-1">Valor Estimado</p>
                      <p className="text-2xl font-bold text-green-700">
                        ${bovino.valor_estimado.toLocaleString('es-CO')}
                      </p>
                    </div>
                  )}

                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600 mb-1">Ubicación</p>
                    <p className="text-lg font-bold text-green-700">{bovino.ubicacion_municipio || 'N/A'}</p>
                    {bovino.ubicacion_departamento && (
                      <p className="text-xs text-green-600">{bovino.ubicacion_departamento}</p>
                    )}
                  </div>

                  {bovino.fecha_nacimiento && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-600 mb-1">Fecha de Nacimiento</p>
                      <p className="text-lg font-bold text-green-700">
                        {new Date(bovino.fecha_nacimiento).toLocaleDateString('es-CO')}
                      </p>
                    </div>
                  )}

                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600 mb-1">Edad</p>
                    <p className="text-2xl font-bold text-green-700">
                      {edad.años > 0 ? `${edad.años}a ${edad.meses}m` : bovino.edad ? `${bovino.edad} años` : 'N/A'}
                    </p>
                  </div>

                  {bovino.fecha_creacion && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-600 mb-1">Fecha Registro</p>
                      <p className="text-sm font-bold text-green-700">
                        {new Date(bovino.fecha_creacion).toLocaleDateString('es-CO')}
                      </p>
                    </div>
                  )}
                </div>

                {/* Descripción */}
                {bovino.descripcion && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-bold text-gray-800 mb-2">Descripción</h3>
                    <p className="text-gray-700">{bovino.descripcion}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-md p-2 inline-flex gap-2">
            <button
              onClick={() => setActiveTab('general')}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                activeTab === 'general'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:bg-green-50'
              }`}
            >
              📋 General
            </button>
            <button
              onClick={() => setActiveTab('sanitario')}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                activeTab === 'sanitario'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:bg-green-50'
              }`}
            >
              💉 Sanitario ({historialSanitario.length})
            </button>
            <button
              onClick={() => setActiveTab('reproductivo')}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                activeTab === 'reproductivo'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:bg-green-50'
              }`}
            >
              🐄 Reproductivo ({historialReproductivo.length})
            </button>
          </div>
        </div>

        {/* Contenido de tabs */}
        {activeTab === 'general' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Información General</h3>
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-3">
                <span className="font-medium text-gray-600">Raza:</span>
                <span className="text-gray-800">{bovino.raza}</span>
              </div>
              <div className="flex justify-between border-b pb-3">
                <span className="font-medium text-gray-600">Sexo:</span>
                <span className="text-gray-800">{bovino.sexo}</span>
              </div>
              <div className="flex justify-between border-b pb-3">
                <span className="font-medium text-gray-600">Peso:</span>
                <span className="text-gray-800">{bovino.peso_actual} kg</span>
              </div>
              <div className="flex justify-between border-b pb-3">
                <span className="font-medium text-gray-600">Estado:</span>
                <span className="text-gray-800">{bovino.estado}</span>
              </div>
              {bovino.ubicacion_municipio && (
                <div className="flex justify-between border-b pb-3">
                  <span className="font-medium text-gray-600">Ubicación:</span>
                  <span className="text-gray-800">{bovino.ubicacion_municipio}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'sanitario' && (
          <HistorialSanitario
            historial={historialSanitario}
            onAdd={handleAddSanitario}
          />
        )}

        {activeTab === 'reproductivo' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Historial Reproductivo</h3>
            <div className="space-y-3">
              {historialReproductivo.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-4xl mb-3">🐄</p>
                  <p>No hay registros reproductivos aún</p>
                </div>
              ) : (
                historialReproductivo.map((registro) => (
                  <div key={registro.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-800">{registro.tipo}</h4>
                      <span className="text-sm text-gray-500">
                        {new Date(registro.fecha).toLocaleDateString('es-CO')}
                      </span>
                    </div>
                    {registro.detalles && (
                      <p className="text-sm text-gray-600 mb-2">{registro.detalles}</p>
                    )}
                    {registro.observaciones && (
                      <p className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                        {registro.observaciones}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
