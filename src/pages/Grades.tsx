import { useState } from 'react';
import { ClipboardList, Save, Award } from 'lucide-react';
import { Grade } from '../types';
import { useCriterios } from '../hooks';

export default function Grades() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const { criterios, loading: criteriosLoading, error: criteriosError } = useCriterios();

  const [formData, setFormData] = useState({
    workId: '',
    evaluatorId: '',
    criteriaId: '',
    score: '',
    comments: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newGrade: Grade = {
      id: Date.now().toString(),
      workId: formData.workId,
      evaluatorId: formData.evaluatorId,
      criteriaId: formData.criteriaId,
      score: parseFloat(formData.score),
      comments: formData.comments,
      createdAt: new Date().toISOString(),
    };

    setGrades([...grades, newGrade]);
    setFormData({ workId: '', evaluatorId: '', criteriaId: '', score: '', comments: '' });
  };

  const getCriteriaName = (criteriaId: string) => {
    const criterion = criterios.find((c) => c.id.toString() === criteriaId);
    return criterion?.nombre || 'Desconocido';
  };

  // Función helper para formatear ponderación
  // Si el valor es > 1, asumimos que ya está en formato porcentaje (ej: 60 = 60%)
  // Si el valor es <= 1, asumimos que está en formato decimal (ej: 0.6 = 60%)
  const formatPonderacion = (ponderacion: number): string => {
    if (ponderacion > 1) {
      // Ya está en formato porcentaje (60 = 60%)
      return `${ponderacion.toFixed(2)}%`;
    } else {
      // Está en formato decimal (0.6 = 60%)
      return `${(ponderacion * 100).toFixed(2)}%`;
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-8 animate-fade-in-down">
        <div className="bg-tertiary-100 p-3 rounded-xl mr-4">
          <ClipboardList className="h-7 w-7 text-tertiary-600" />
        </div>
        <h2 className="text-3xl font-bold text-gradient-tertiary">Ingresar Notas</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card-elegant animate-fade-in-up">
          <h3 className="text-xl font-bold text-academic-900 mb-6 flex items-center">
            <Save className="h-5 w-5 mr-2 text-tertiary-600" />
            Nueva Calificación
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
                type="text"
                value={formData.workId}
                onChange={(e) => setFormData({ ...formData, workId: e.target.value })}
                className="input-elegant"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-academic-700 mb-2">
                ID del Evaluador
              </label>
              <input
                type="text"
                value={formData.evaluatorId}
                onChange={(e) => setFormData({ ...formData, evaluatorId: e.target.value })}
                className="input-elegant"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-academic-700 mb-2">Criterio</label>
              <select
                value={formData.criteriaId}
                onChange={(e) => setFormData({ ...formData, criteriaId: e.target.value })}
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
              {criteriosError && (
                <p className="text-xs text-red-600 mt-1">Error al cargar criterios: {criteriosError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-academic-700 mb-2">
                Puntuación (0-5)
              </label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.score}
                onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                className="input-elegant"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-academic-700 mb-2">
                Comentarios (Opcional)
              </label>
              <textarea
                value={formData.comments}
                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                className="input-elegant resize-none"
                rows={3}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-tertiary-600 to-tertiary-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg shadow-tertiary-200/50 hover:shadow-xl hover:shadow-tertiary-300/50 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
            >
              <Save className="h-5 w-5 mr-2" />
              Registrar Calificación
            </button>
          </form>
        </div>

        <div className="card-elegant animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-xl font-bold text-academic-900 mb-6 flex items-center">
            <ClipboardList className="h-5 w-5 mr-2 text-tertiary-600" />
            Calificaciones Registradas
            <span className="ml-3 bg-tertiary-100 text-tertiary-700 px-3 py-1 rounded-full text-sm font-semibold">
              {grades.length}
            </span>
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {grades.length === 0 ? (
              <div className="text-center py-12 animate-fade-in">
                <Award className="h-16 w-16 text-academic-300 mx-auto mb-4" />
                <p className="text-academic-500 font-medium">No hay calificaciones registradas</p>
              </div>
            ) : (
              grades.map((grade, index) => (
                <div
                  key={grade.id}
                  className="bg-gradient-to-r from-academic-50 to-tertiary-50/30 border-2 border-academic-200/50 rounded-xl p-5 hover-lift-subtle animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-bold text-academic-900 mb-2 text-lg">
                        {getCriteriaName(grade.criteriaId)}
                      </h4>
                      <div className="space-y-1">
                        <p className="text-sm text-academic-700">
                          <span className="font-semibold">Trabajo ID:</span> {grade.workId}
                        </p>
                        <p className="text-sm text-academic-700">
                          <span className="font-semibold">Evaluador ID:</span> {grade.evaluatorId}
                        </p>
                      </div>
                    </div>
                    <div className="bg-tertiary-100 text-tertiary-700 px-4 py-2 rounded-xl font-bold text-xl shadow-md">
                      {grade.score}
                    </div>
                  </div>
                  {grade.comments && (
                    <div className="mt-3 pt-3 border-t border-academic-200">
                      <p className="text-sm text-academic-600 italic">{grade.comments}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
