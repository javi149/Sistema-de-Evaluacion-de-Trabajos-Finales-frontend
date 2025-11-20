import { useState } from 'react';
import { FileText, Save, BookOpen } from 'lucide-react';
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

  const getWorkTypeColor = (type: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      thesis: { bg: 'bg-primary-100', text: 'text-primary-700' },
      project: { bg: 'bg-accent-100', text: 'text-accent-700' },
      monograph: { bg: 'bg-secondary-100', text: 'text-secondary-700' },
    };
    return colors[type] || colors.thesis;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      pending: { bg: 'bg-tertiary-100', text: 'text-tertiary-700' },
      'in-progress': { bg: 'bg-accent-100', text: 'text-accent-700' },
      evaluated: { bg: 'bg-primary-100', text: 'text-primary-700' },
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-8 animate-fade-in-down">
        <div className="bg-accent-100 p-3 rounded-xl mr-4">
          <FileText className="h-7 w-7 text-accent-600" />
        </div>
        <h2 className="text-3xl font-bold text-gradient-accent">Registrar Trabajos</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card-elegant animate-fade-in-up">
          <h3 className="text-xl font-bold text-academic-900 mb-6 flex items-center">
            <Save className="h-5 w-5 mr-2 text-accent-600" />
            Nuevo Trabajo
          </h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-academic-700 mb-2">
                Título del Trabajo
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-elegant"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-academic-700 mb-2">Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-elegant resize-none"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-academic-700 mb-2">
                ID del Estudiante
              </label>
              <input
                type="text"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                className="input-elegant"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-academic-700 mb-2">
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
                className="input-elegant"
              >
                <option value="thesis">Tesis</option>
                <option value="project">Proyecto</option>
                <option value="monograph">Monografía</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn-accent w-full flex items-center justify-center"
            >
              <Save className="h-5 w-5 mr-2" />
              Registrar Trabajo
            </button>
          </form>
        </div>

        <div className="card-elegant animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-xl font-bold text-academic-900 mb-6 flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-accent-600" />
            Trabajos Registrados
            <span className="ml-3 bg-accent-100 text-accent-700 px-3 py-1 rounded-full text-sm font-semibold">
              {works.length}
            </span>
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {works.length === 0 ? (
              <div className="text-center py-12 animate-fade-in">
                <FileText className="h-16 w-16 text-academic-300 mx-auto mb-4" />
                <p className="text-academic-500 font-medium">No hay trabajos registrados</p>
              </div>
            ) : (
              works.map((work, index) => {
                const typeColor = getWorkTypeColor(work.workType);
                const statusColor = getStatusColor(work.status);
                return (
                  <div
                    key={work.id}
                    className="bg-gradient-to-r from-academic-50 to-accent-50/30 border-2 border-academic-200/50 rounded-xl p-5 hover-lift-subtle animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <h4 className="font-bold text-academic-900 mb-2 text-lg">{work.title}</h4>
                    <p className="text-sm text-academic-700 mb-4 leading-relaxed">{work.description}</p>
                    <div className="flex gap-2 flex-wrap">
                      <span className={`text-xs font-semibold ${typeColor.bg} ${typeColor.text} px-3 py-1.5 rounded-lg`}>
                        {getWorkTypeLabel(work.workType)}
                      </span>
                      <span className={`text-xs font-semibold ${statusColor.bg} ${statusColor.text} px-3 py-1.5 rounded-lg`}>
                        {getStatusLabel(work.status)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
