import { useState } from 'react';
import { FileText, Save } from 'lucide-react';
import { Work } from '../types';

export default function Works() {
  const [works, setWorks] = useState<Work[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    studentId: '',
    workType: 'thesis' as 'thesis' | 'project' | 'monograph',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newWork: Work = {
      id: Date.now().toString(),
      ...formData,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setWorks([...works, newWork]);
    setFormData({ title: '', description: '', studentId: '', workType: 'thesis' });
  };

  const getWorkTypeLabel = (type: string) => {
    const labels = {
      thesis: 'Tesis',
      project: 'Proyecto',
      monograph: 'Monografía',
    };
    return labels[type as keyof typeof labels];
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: 'Pendiente',
      'in-progress': 'En Progreso',
      evaluated: 'Evaluado',
    };
    return labels[status as keyof typeof labels];
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <FileText className="h-6 w-6 text-green-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-900">Registrar Trabajos</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Nuevo Trabajo</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título del Trabajo
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID del Estudiante
              </label>
              <input
                type="text"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Trabajo
              </label>
              <select
                value={formData.workType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    workType: e.target.value as 'thesis' | 'project' | 'monograph',
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="thesis">Tesis</option>
                <option value="project">Proyecto</option>
                <option value="monograph">Monografía</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              <Save className="h-4 w-4 mr-2" />
              Registrar Trabajo
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Trabajos Registrados ({works.length})
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {works.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay trabajos registrados</p>
            ) : (
              works.map((work) => (
                <div key={work.id} className="border border-gray-200 rounded-md p-4">
                  <h4 className="font-semibold text-gray-900">{work.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{work.description}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      {getWorkTypeLabel(work.workType)}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                      {getStatusLabel(work.status)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
