import { useState } from 'react';
import { ClipboardList, Save } from 'lucide-react';
import { Grade } from '../types';
import { AppConfig } from '../config/AppConfig';

export default function Grades() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const config = AppConfig.getInstance();
  const criteria = config.getEvaluationCriteria();

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
    const criterion = criteria.find((c, index) => index.toString() === criteriaId);
    return criterion?.name || 'Desconocido';
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <ClipboardList className="h-6 w-6 text-orange-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-900">Ingresar Notas</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Nueva Calificación</h3>

          <div className="mb-4 p-4 bg-blue-50 rounded-md">
            <h4 className="font-semibold text-blue-900 mb-2">Criterios de Evaluación</h4>
            <ul className="space-y-1 text-sm text-blue-800">
              {criteria.map((criterion, index) => (
                <li key={index}>
                  • {criterion.name} - Peso: {(criterion.weight * 100).toFixed(0)}% (Max:{' '}
                  {criterion.maxScore})
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID del Trabajo</label>
              <input
                type="text"
                value={formData.workId}
                onChange={(e) => setFormData({ ...formData, workId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID del Evaluador
              </label>
              <input
                type="text"
                value={formData.evaluatorId}
                onChange={(e) => setFormData({ ...formData, evaluatorId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Criterio</label>
              <select
                value={formData.criteriaId}
                onChange={(e) => setFormData({ ...formData, criteriaId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="">Seleccione un criterio</option>
                {criteria.map((criterion, index) => (
                  <option key={index} value={index.toString()}>
                    {criterion.name} (Max: {criterion.maxScore})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Puntuación (0-5)
              </label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.score}
                onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comentarios (Opcional)
              </label>
              <textarea
                value={formData.comments}
                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows={3}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors flex items-center justify-center"
            >
              <Save className="h-4 w-4 mr-2" />
              Registrar Calificación
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Calificaciones Registradas ({grades.length})
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {grades.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay calificaciones registradas</p>
            ) : (
              grades.map((grade) => (
                <div key={grade.id} className="border border-gray-200 rounded-md p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {getCriteriaName(grade.criteriaId)}
                      </h4>
                      <p className="text-sm text-gray-600">Trabajo ID: {grade.workId}</p>
                      <p className="text-sm text-gray-600">Evaluador ID: {grade.evaluatorId}</p>
                    </div>
                    <span className="text-lg font-bold text-orange-600">{grade.score}</span>
                  </div>
                  {grade.comments && (
                    <p className="text-sm text-gray-600 mt-2 italic">{grade.comments}</p>
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
