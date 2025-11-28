import { useState } from 'react';
import { ClipboardList, Save, Award, Edit2, Trash2 } from 'lucide-react';
import { Evaluacion } from '../types';
import { useEvaluaciones, useCriterios } from '../hooks';
import { CreateEvaluacionDto } from '../services/evaluationService';
import { EvaluationEditModal } from '../components/EvaluationEditModal';

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

  const { criterios, loading: criteriosLoading, error: criteriosError } = useCriterios();

  const [formData, setFormData] = useState({
    trabajo_id: '',
    evaluador_id: '',
    criterio_id: '',
    nota: '',
    observacion: '',
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvaluacion, setSelectedEvaluacion] = useState<Evaluacion | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newEvaluacion: CreateEvaluacionDto = {
      trabajo_id: parseInt(formData.trabajo_id),
      evaluador_id: parseInt(formData.evaluador_id),
      criterio_id: parseInt(formData.criterio_id),
      nota: parseFloat(formData.nota),
      observacion: formData.observacion,
      fecha_evaluacion: new Date().toISOString().split('T')[0], // Fecha actual YYYY-MM-DD
    };

    const result = await createEvaluacion(newEvaluacion);
    if (result) {
      setFormData({
        trabajo_id: '',
        evaluador_id: '',
        criterio_id: '',
        nota: '',
        observacion: ''
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta evaluación?')) {
      await deleteEvaluacion(id);
    }
  };

  const handleEdit = (evaluacion: Evaluacion) => {
    setSelectedEvaluacion(evaluacion);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (id: number, data: any) => {
    const result = await updateEvaluacion(id, data);
    return !!result;
  };

  const getCriteriaName = (criteriaId: number | undefined) => {
    if (!criteriaId) return 'Sin criterio';
    const criterion = criterios.find((c) => c.id === criteriaId);
    return criterion?.nombre || 'Desconocido';
  };

  const formatPonderacion = (ponderacion: number): string => {
    if (ponderacion > 1) {
      return `${ponderacion.toFixed(2)}%`;
    } else {
      return `${(ponderacion * 100).toFixed(2)}%`;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-8 animate-fade-in-down">
        <div className="bg-tertiary-100 p-3 rounded-xl mr-4">
          <ClipboardList className="h-7 w-7 text-tertiary-600" />
        </div>
        <h2 className="text-3xl font-bold text-gradient-tertiary">Gestión de Evaluaciones</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card-elegant animate-fade-in-up">
          <h3 className="text-xl font-bold text-academic-900 mb-6 flex items-center">
            <Save className="h-5 w-5 mr-2 text-tertiary-600" />
            Nueva Evaluación
          </h3>

          <div className="mb-6 p-5 bg-gradient-to-r from-primary-50 to-primary-100/50 rounded-xl border-2 border-primary-200/50 animate-fade-in-up">
            <h4 className="font-bold text-primary-900 mb-3 flex items-center">
              <Award className="h-5 w-5 mr-2 text-primary-600" />
              Criterios de Evaluación
            </h4>
            {criteriosLoading ? (
              <p className="text-sm text-primary-700">Cargando criterios...</p>
            ) : criteriosError ? (
              <p className="text-sm text-red-600">Error: {criteriosError}</p>
            ) : criterios.length === 0 ? (
              <p className="text-sm text-primary-700">No hay criterios disponibles</p>
            ) : (
              <ul className="space-y-2 text-sm text-primary-800">
                {criterios.map((criterio) => (
                  <li key={criterio.id} className="flex items-start">
                    <span className="text-primary-600 mr-2 font-bold">•</span>
                    <span>
                      <span className="font-semibold">{criterio.nombre}</span>
                      {criterio.descripcion && (
                        <span className="text-primary-600 ml-2">- {criterio.descripcion}</span>
                      )}
                      <span className="block text-xs text-primary-600 mt-1">
                        Ponderación: {formatPonderacion(criterio.ponderacion)}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-academic-700 mb-2">ID del Trabajo</label>
              <input
                type="number"
                value={formData.trabajo_id}
                onChange={(e) => setFormData({ ...formData, trabajo_id: e.target.value })}
                className="input-elegant"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-academic-700 mb-2">
                ID del Evaluador
              </label>
              <input
                type="number"
                value={formData.evaluador_id}
                onChange={(e) => setFormData({ ...formData, evaluador_id: e.target.value })}
                className="input-elegant"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-academic-700 mb-2">Criterio</label>
              <select
                value={formData.criterio_id}
                onChange={(e) => setFormData({ ...formData, criterio_id: e.target.value })}
                className="input-elegant"
                required
                disabled={criteriosLoading || criterios.length === 0}
              >
                <option value="">Seleccione un criterio</option>
                {criterios.map((criterio) => (
                  <option key={criterio.id} value={criterio.id.toString()}>
                    {criterio.nombre} (Ponderación: {formatPonderacion(criterio.ponderacion)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-academic-700 mb-2">
                Nota
              </label>
              <input
                type="number"
                min="0"
                max="7"
                step="0.1"
                value={formData.nota}
                onChange={(e) => setFormData({ ...formData, nota: e.target.value })}
                className="input-elegant"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-academic-700 mb-2">
                Observación (Opcional)
              </label>
              <textarea
                value={formData.observacion}
                onChange={(e) => setFormData({ ...formData, observacion: e.target.value })}
                className="input-elegant resize-none"
                rows={3}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-tertiary-600 to-tertiary-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg shadow-tertiary-200/50 hover:shadow-xl hover:shadow-tertiary-300/50 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
              disabled={evaluacionesLoading}
            >
              <Save className="h-5 w-5 mr-2" />
              {evaluacionesLoading ? 'Guardando...' : 'Registrar Evaluación'}
            </button>
          </form>
        </div>

        <div className="card-elegant animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-xl font-bold text-academic-900 mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <ClipboardList className="h-5 w-5 mr-2 text-tertiary-600" />
              Evaluaciones Registradas
              <span className="ml-3 bg-tertiary-100 text-tertiary-700 px-3 py-1 rounded-full text-sm font-semibold">
                {evaluaciones.length}
              </span>
            </div>
            <button
              onClick={refresh}
              className="text-sm text-tertiary-600 hover:text-tertiary-800 underline"
            >
              Actualizar
            </button>
          </h3>

          {evaluacionesError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              Error: {evaluacionesError}
            </div>
          )}

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {evaluacionesLoading && evaluaciones.length === 0 ? (
              <p className="text-center text-academic-500">Cargando evaluaciones...</p>
            ) : evaluaciones.length === 0 ? (
              <div className="text-center py-12 animate-fade-in">
                <Award className="h-16 w-16 text-academic-300 mx-auto mb-4" />
                <p className="text-academic-500 font-medium">No hay evaluaciones registradas</p>
              </div>
            ) : (
              evaluaciones.map((evaluacion, index) => (
                <div
                  key={evaluacion.id}
                  className="bg-gradient-to-r from-academic-50 to-tertiary-50/30 border-2 border-academic-200/50 rounded-xl p-5 hover-lift-subtle animate-fade-in-up group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-bold text-academic-900 mb-2 text-lg">
                        {getCriteriaName(evaluacion.criterio_id)}
                      </h4>
                      <div className="space-y-1">
                        <p className="text-sm text-academic-700">
                          <span className="font-semibold">Trabajo ID:</span> {evaluacion.trabajo_id || 'N/A'}
                        </p>
                        <p className="text-sm text-academic-700">
                          <span className="font-semibold">Evaluador ID:</span> {evaluacion.evaluador_id || 'N/A'}
                        </p>
                        {evaluacion.fecha_evaluacion && (
                          <p className="text-sm text-academic-700">
                            <span className="font-semibold">Fecha:</span> {evaluacion.fecha_evaluacion}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="bg-tertiary-100 text-tertiary-700 px-4 py-2 rounded-xl font-bold text-xl shadow-md">
                        {evaluacion.nota}
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(evaluacion)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(evaluacion.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  {(evaluacion.observacion || evaluacion.comentarios) && (
                    <div className="mt-3 pt-3 border-t border-academic-200">
                      <p className="text-sm text-academic-600 italic">
                        {evaluacion.observacion || evaluacion.comentarios}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <EvaluationEditModal
        evaluacion={selectedEvaluacion}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        loading={evaluacionesLoading}
      />
    </div>
  );
}
