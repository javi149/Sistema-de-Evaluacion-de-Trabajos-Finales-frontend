import { useState } from 'react';
import { ClipboardList, Plus, Edit2, Trash2, Search, RefreshCw } from 'lucide-react';
import { Evaluacion } from '../types';
import { useEvaluaciones, useCriterios } from '../hooks';
import { EvaluationCreateModal } from '../components/EvaluationCreateModal';
import { EvaluationEditModal } from '../components/EvaluationEditModal';
import { ConfirmModal } from '../components/ConfirmModal';

export default function Grades() {
  const {
    evaluaciones,
    loading: evaluacionesLoading,
    error: evaluacionesError,
    createEvaluacion,
    updateEvaluacion,
    deleteEvaluacion,
    refresh
  } = useEvaluaciones();

  const { criterios } = useCriterios();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvaluacion, setSelectedEvaluacion] = useState<Evaluacion | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [evaluacionToDelete, setEvaluacionToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleSaveCreate = async (data: any) => {
    const result = await createEvaluacion(data);
    return !!result;
  };

  const handleEdit = (evaluacion: Evaluacion) => {
    setSelectedEvaluacion(evaluacion);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (id: number, data: any) => {
    const result = await updateEvaluacion(id, data);
    return !!result;
  };

  const handleDelete = (id: number) => {
    setEvaluacionToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (evaluacionToDelete !== null) {
      await deleteEvaluacion(evaluacionToDelete);
    }
    setIsDeleteModalOpen(false);
    setEvaluacionToDelete(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
  };

  const getCriteriaName = (criteriaId: number | undefined) => {
    if (!criteriaId) return 'Sin criterio';
    const criterion = criterios.find((c) => c.id === criteriaId);
    return criterion?.nombre || 'Desconocido';
  };

  const filteredEvaluaciones = evaluaciones.filter(evaluacion =>
    searchTerm === '' ||
    getCriteriaName(evaluacion.criterio_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
    (evaluacion.observacion && evaluacion.observacion.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (evaluacion.comentarios && evaluacion.comentarios.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-fade-in-down">
        <div className="flex items-center">
          <div className="bg-tertiary-100 p-3 rounded-xl mr-4">
            <ClipboardList className="h-7 w-7 text-tertiary-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gradient-tertiary">Evaluaciones</h2>
            <p className="text-academic-600">Gestiona las evaluaciones de trabajos finales</p>
          </div>
        </div>
        <button
          onClick={handleCreate}
          className="bg-gradient-to-r from-tertiary-600 to-tertiary-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg shadow-tertiary-200/50 hover:shadow-xl hover:shadow-tertiary-300/50 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nueva Evaluación
        </button>
      </div>

      {/* Search Bar */}
      <div className="card-elegant mb-8 animate-fade-in-up">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-academic-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar evaluaciones por criterio u observación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-elegant pl-12"
            />
          </div>
          <button type="submit" className="btn-secondary">
            Buscar
          </button>
          <button
            type="button"
            onClick={refresh}
            className="p-3 text-academic-500 hover:bg-academic-50 rounded-xl transition-colors"
            title="Actualizar lista"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </form>
      </div>

      {/* Error Message */}
      {evaluacionesError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center animate-fade-in">
          <div className="bg-red-100 p-2 rounded-full mr-3">
            <span className="text-xl">⚠️</span>
          </div>
          {evaluacionesError}
        </div>
      )}

      {/* Evaluations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {evaluacionesLoading && evaluaciones.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tertiary-600 mx-auto mb-4"></div>
            <p className="text-academic-500">Cargando evaluaciones...</p>
          </div>
        ) : filteredEvaluaciones.length === 0 ? (
          <div className="col-span-full text-center py-12 card-elegant">
            <ClipboardList className="h-16 w-16 text-academic-300 mx-auto mb-4" />
            <p className="text-academic-500 font-medium">
              {searchTerm ? 'No se encontraron evaluaciones con ese criterio' : 'No hay evaluaciones registradas'}
            </p>
          </div>
        ) : (
          filteredEvaluaciones.map((evaluacion, index) => (
            <div
              key={evaluacion.id}
              className="card-elegant group hover:border-tertiary-200 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="bg-tertiary-50 text-tertiary-700 px-3 py-1 rounded-lg text-sm font-bold">
                  ID: {evaluacion.id}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(evaluacion)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(evaluacion.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-bold text-academic-900 mb-3">
                {getCriteriaName(evaluacion.criterio_id)}
              </h3>

              <div className="space-y-2 text-sm text-academic-600 mb-4">
                <p>
                  <span className="font-semibold">Trabajo ID:</span> {evaluacion.trabajo_id || 'N/A'}
                </p>
                <p>
                  <span className="font-semibold">Evaluador ID:</span> {evaluacion.evaluador_id || 'N/A'}
                </p>
                {evaluacion.fecha_evaluacion && (
                  <p>
                    <span className="font-semibold">Fecha:</span> {evaluacion.fecha_evaluacion}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-academic-100">
                <span className="text-sm text-academic-500 font-medium">Nota</span>
                <div className="bg-tertiary-100 text-tertiary-700 px-4 py-2 rounded-xl font-bold text-xl shadow-md">
                  {evaluacion.nota}
                </div>
              </div>

              {(evaluacion.observacion || evaluacion.comentarios) && (
                <div className="mt-3 pt-3 border-t border-academic-100">
                  <p className="text-sm text-academic-600 italic line-clamp-2">
                    {evaluacion.observacion || evaluacion.comentarios}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      <EvaluationCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveCreate}
        loading={evaluacionesLoading}
      />

      <EvaluationEditModal
        evaluacion={selectedEvaluacion}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEvaluacion(null);
        }}
        onSave={handleSaveEdit}
        loading={evaluacionesLoading}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        message="¿Estás seguro de que deseas eliminar esta evaluación?"
        onConfirm={confirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setEvaluacionToDelete(null);
        }}
      />
    </div>
  );
}
