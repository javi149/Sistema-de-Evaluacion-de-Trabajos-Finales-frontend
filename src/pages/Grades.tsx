import { useState, useEffect } from 'react';
import { ClipboardList, Plus, Edit2, Trash2, Search, RefreshCw } from 'lucide-react';
import { Evaluacion } from '../types';
import { useEvaluaciones, useCriterios, useTrabajos, useEvaluators } from '../hooks';
import { useEvaluationDetails } from '../hooks/useEvaluationDetails';
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
  const { trabajos, loading: trabajosLoading } = useTrabajos();
  const { evaluators, loading: evaluatorsLoading } = useEvaluators();
  const { detalles, loading: detailsLoading, fetchAllDetails } = useEvaluationDetails();

  // Cargar detalles al montar
  useEffect(() => {
    fetchAllDetails();
  }, [fetchAllDetails]);

  const isLoading = evaluacionesLoading || trabajosLoading || evaluatorsLoading || detailsLoading;

  // Combinar evaluaciones con sus detalles para obtener nota y criterio
  const enrichedEvaluaciones = evaluaciones.map(evaluacion => {
    const detalle = detalles.find(d => d.evaluacion_id === evaluacion.id);
    return {
      ...evaluacion,
      nota: detalle?.nota || evaluacion.nota,
      criterio_id: detalle?.criterio_id || evaluacion.criterio_id,
      observacion: detalle?.observacion || evaluacion.observacion
    };
  });

  console.log('Enriched Evaluaciones:', enrichedEvaluaciones);

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

  const getTrabajoTitle = (id: number | undefined) => {
    if (!id) return 'N/A';
    const trabajo = trabajos.find(t => t.id === id);
    return trabajo ? trabajo.titulo : `ID: ${id}`;
  };

  const getEvaluatorName = (id: number | undefined) => {
    if (!id) return 'N/A';
    const evaluator = evaluators.find(e => e.id === id);
    return evaluator ? evaluator.nombre : `ID: ${id}`;
  };

  const filteredEvaluaciones = enrichedEvaluaciones.filter(evaluacion =>
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
      {/* Evaluations Table */}
      <div className="card-elegant overflow-hidden animate-fade-in-up">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-tertiary-50 border-b border-tertiary-200">
              <tr>
                {/* <th className="px-6 py-4 text-left text-xs font-semibold text-tertiary-800 uppercase tracking-wider">
                  ID
                </th> */}
                <th className="px-6 py-4 text-left text-xs font-semibold text-tertiary-800 uppercase tracking-wider">
                  Criterio
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-tertiary-800 uppercase tracking-wider">
                  Trabajo
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-tertiary-800 uppercase tracking-wider">
                  Evaluador
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-tertiary-800 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-tertiary-800 uppercase tracking-wider">
                  Nota
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-tertiary-800 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-academic-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-academic-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tertiary-600 mb-2"></div>
                      <p>Cargando evaluaciones...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredEvaluaciones.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-academic-500">
                    <div className="flex flex-col items-center justify-center">
                      <ClipboardList className="h-12 w-12 text-academic-300 mb-2" />
                      <p>{searchTerm ? 'No se encontraron evaluaciones con ese criterio' : 'No hay evaluaciones registradas'}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEvaluaciones.map((evaluacion, index) => (
                  <tr
                    key={evaluacion.id}
                    className="hover:bg-tertiary-50/50 transition-colors animate-fade-in-up"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-tertiary-100 text-tertiary-700 px-2 py-1 rounded-lg text-xs font-bold">
                        #{evaluacion.id}
                      </span>
                    </td> */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-academic-900">
                        {getCriteriaName(evaluacion.criterio_id)}
                      </div>
                      {(evaluacion.observacion || evaluacion.comentarios) && (
                        <div className="text-xs text-academic-500 truncate max-w-xs" title={evaluacion.observacion || evaluacion.comentarios}>
                          {evaluacion.observacion || evaluacion.comentarios}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-academic-600">
                      <div className="font-medium text-academic-900 truncate max-w-xs" title={getTrabajoTitle(evaluacion.trabajo_id)}>
                        {getTrabajoTitle(evaluacion.trabajo_id)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-academic-600">
                      {getEvaluatorName(evaluacion.evaluador_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-academic-600">
                      {evaluacion.fecha_evaluacion || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-tertiary-100 text-tertiary-700 px-3 py-1 rounded-lg font-bold text-sm">
                        {evaluacion.nota}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
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
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
