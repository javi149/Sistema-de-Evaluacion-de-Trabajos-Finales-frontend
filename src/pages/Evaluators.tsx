import { useState } from 'react';
import { UserCheck, Save } from 'lucide-react';
import { Evaluator } from '../types';

export default function Evaluators() {
  const [evaluators, setEvaluators] = useState<Evaluator[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialty: '',
    role: 'juror' as 'director' | 'juror' | 'external',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newEvaluator: Evaluator = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
    };

    setEvaluators([...evaluators, newEvaluator]);
    setFormData({ name: '', email: '', specialty: '', role: 'juror' });
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      director: 'Director',
      juror: 'Jurado',
      external: 'Externo',
    };
    return labels[role as keyof typeof labels];
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <UserCheck className="h-6 w-6 text-violet-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-900">Registrar Evaluadores</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Nuevo Evaluador</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Completo
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Especialidad</label>
              <input
                type="text"
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value as 'director' | 'juror' | 'external',
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="director">Director</option>
                <option value="juror">Jurado</option>
                <option value="external">Externo</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-violet-600 text-white py-2 px-4 rounded-md hover:bg-violet-700 transition-colors flex items-center justify-center"
            >
              <Save className="h-4 w-4 mr-2" />
              Registrar Evaluador
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Evaluadores Registrados ({evaluators.length})
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {evaluators.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay evaluadores registrados</p>
            ) : (
              evaluators.map((evaluator) => (
                <div key={evaluator.id} className="border border-gray-200 rounded-md p-4">
                  <h4 className="font-semibold text-gray-900">{evaluator.name}</h4>
                  <p className="text-sm text-gray-600">{evaluator.email}</p>
                  <p className="text-sm text-gray-600">Especialidad: {evaluator.specialty}</p>
                  <span className="inline-block mt-2 text-xs bg-violet-100 text-violet-800 px-2 py-1 rounded">
                    {getRoleLabel(evaluator.role)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
