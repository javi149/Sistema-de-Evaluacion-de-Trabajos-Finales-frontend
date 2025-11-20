import { useState } from 'react';
import { UserCheck, Save, Users } from 'lucide-react';
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

  const getRoleColor = (role: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      director: { bg: 'bg-primary-100', text: 'text-primary-700' },
      juror: { bg: 'bg-secondary-100', text: 'text-secondary-700' },
      external: { bg: 'bg-accent-100', text: 'text-accent-700' },
    };
    return colors[role] || colors.juror;
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-8 animate-fade-in-down">
        <div className="bg-secondary-100 p-3 rounded-xl mr-4">
          <UserCheck className="h-7 w-7 text-secondary-600" />
        </div>
        <h2 className="text-3xl font-bold text-gradient-secondary">Registrar Evaluadores</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card-elegant animate-fade-in-up">
          <h3 className="text-xl font-bold text-academic-900 mb-6 flex items-center">
            <Save className="h-5 w-5 mr-2 text-secondary-600" />
            Nuevo Evaluador
          </h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-academic-700 mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-elegant"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-academic-700 mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-elegant"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-academic-700 mb-2">Especialidad</label>
              <input
                type="text"
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                className="input-elegant"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-academic-700 mb-2">Rol</label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value as 'director' | 'juror' | 'external',
                  })
                }
                className="input-elegant"
              >
                <option value="director">Director</option>
                <option value="juror">Jurado</option>
                <option value="external">Externo</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn-secondary w-full flex items-center justify-center"
            >
              <Save className="h-5 w-5 mr-2" />
              Registrar Evaluador
            </button>
          </form>
        </div>

        <div className="card-elegant animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-xl font-bold text-academic-900 mb-6 flex items-center">
            <Users className="h-5 w-5 mr-2 text-secondary-600" />
            Evaluadores Registrados
            <span className="ml-3 bg-secondary-100 text-secondary-700 px-3 py-1 rounded-full text-sm font-semibold">
              {evaluators.length}
            </span>
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {evaluators.length === 0 ? (
              <div className="text-center py-12 animate-fade-in">
                <UserCheck className="h-16 w-16 text-academic-300 mx-auto mb-4" />
                <p className="text-academic-500 font-medium">No hay evaluadores registrados</p>
              </div>
            ) : (
              evaluators.map((evaluator, index) => {
                const roleColor = getRoleColor(evaluator.role);
                return (
                  <div
                    key={evaluator.id}
                    className="bg-gradient-to-r from-academic-50 to-secondary-50/30 border-2 border-academic-200/50 rounded-xl p-5 hover-lift-subtle animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <h4 className="font-bold text-academic-900 mb-2 text-lg">{evaluator.name}</h4>
                    <div className="space-y-1 mb-3">
                      <p className="text-sm text-academic-700 flex items-center">
                        <span className="font-semibold mr-2">Email:</span>
                        {evaluator.email}
                      </p>
                      <p className="text-sm text-academic-700 flex items-center">
                        <span className="font-semibold mr-2">Especialidad:</span>
                        {evaluator.specialty}
                      </p>
                    </div>
                    <span className={`inline-block text-xs font-semibold ${roleColor.bg} ${roleColor.text} px-3 py-1.5 rounded-lg`}>
                      {getRoleLabel(evaluator.role)}
                    </span>
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
