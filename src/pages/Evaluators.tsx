import { useState } from 'react';
import { ConfirmModal } from '../components/ConfirmModal';
import { EvaluatorEditModal } from '../components/EvaluatorEditModal';
import { UserCheck, Save, Users, Trash2, AlertCircle, Edit2, FileText } from 'lucide-react';
import { useEvaluators } from '../hooks';
import { Evaluator } from '../types';

export default function Evaluators() {
  const {
    evaluators,
    loading,
    error,
    createEvaluator,
    partialUpdateEvaluator,
    deleteEvaluator,
    getEvaluatorEvaluaciones,
    clearError,
  } = useEvaluators();

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    tipo: 'guia' as 'guia' | 'comision' | 'informante',
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [evaluatorToDelete, setEvaluatorToDelete] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [evaluatorToEdit, setEvaluatorToEdit] = useState<Evaluator | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const result = await createEvaluator(formData);

    if (result) {
      setFormData({
        nombre: '',
        email: '',
        tipo: 'guia',
      });
    }
  };

  const handleDelete = (id: number) => {
    setEvaluatorToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (evaluatorToDelete !== null) {
      clearError();
      await deleteEvaluator(evaluatorToDelete);
    }
    setIsDeleteModalOpen(false);
    setEvaluatorToDelete(null);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setEvaluatorToDelete(null);
  };

  const handleEdit = (evaluator: Evaluator) => {
    setEvaluatorToEdit(evaluator);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (id: number, data: any) => {
    clearError();
    const result = await partialUpdateEvaluator(id, data);
    if (result) {
      setIsEditModalOpen(false);
      setEvaluatorToEdit(null);
      return true;
    }
    return false;
  };

  const handleCloseEdit = () => {
    setIsEditModalOpen(false);
    setEvaluatorToEdit(null);
  };

  const handleViewEvaluaciones = async (evaluator: Evaluator) => {
    const evaluaciones = await getEvaluatorEvaluaciones(evaluator.id);
    if (evaluaciones) {
      // TODO: Mostrar evaluaciones en un modal o navegar a una página de detalles
      console.log('Evaluaciones del evaluador:', evaluaciones);
      alert(`Evaluaciones de ${evaluator.nombre}: ${evaluaciones.length} evaluaciones encontradas`);
    }
  };

  const getTipoLabel = (tipo: string) => {
    const labels = {
      guia: 'Guia',
      comision: 'Comision',
      informante: 'Informante',
    };
    return labels[tipo as keyof typeof labels] || tipo;
  };

  const getTipoColor = (tipo: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      guia: { bg: 'bg-primary-100', text: 'text-primary-700' },
      comision: { bg: 'bg-secondary-100', text: 'text-secondary-700' },
      informante: { bg: 'bg-accent-100', text: 'text-accent-700' },
    };
    return colors[tipo] || colors.guia;
  };

  return (
    <div className="animate-fade-in">
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        message="¿Estás seguro de que deseas eliminar este evaluador?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
      <EvaluatorEditModal
        evaluator={evaluatorToEdit}
        isOpen={isEditModalOpen}
        onClose={handleCloseEdit}
        onSave={handleSaveEdit}
        loading={loading}
      />

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
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-academic-700 mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="input-elegant"
                required
                disabled={loading}
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
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-academic-700 mb-2">Tipo de Evaluador</label>
              <select
                value={formData.tipo}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tipo: e.target.value as 'guia' | 'comision' | 'informante',
                  })
                }
                className="input-elegant"
                disabled={loading}
              >
                <option value="guia">Profesor Guía</option>
                <option value="comision">Comisión Evaluadora</option>
                <option value="informante">Profesor Informante</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn-secondary w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              <Save className="h-5 w-5 mr-2" />
              {loading ? 'Registrando...' : 'Registrar Evaluador'}
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
          {loading && evaluators.length === 0 ? (
            <div className="text-center py-12 animate-fade-in">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-600 mx-auto mb-4"></div>
              <p className="text-academic-500 font-medium">Cargando evaluadores...</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {evaluators.length === 0 ? (
                <div className="text-center py-12 animate-fade-in">
                  <UserCheck className="h-16 w-16 text-academic-300 mx-auto mb-4" />
                  <p className="text-academic-500 font-medium">No hay evaluadores registrados</p>
                </div>
              ) : (
                evaluators.map((evaluator, index) => {
                  const tipoColor = getTipoColor(evaluator.tipo);
                  return (
                    <div
                      key={evaluator.id}
                      className="bg-gradient-to-r from-academic-50 to-secondary-50/30 border-2 border-academic-200/50 rounded-xl p-5 hover-lift-subtle animate-fade-in-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-academic-900 text-lg">{evaluator.nombre}</h4>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewEvaluaciones(evaluator)}
                            className="text-accent-600 hover:text-accent-800 transition-colors p-1"
                            title="Ver evaluaciones"
                            disabled={loading}
                          >
                            <FileText className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(evaluator)}
                            className="text-primary-600 hover:text-primary-800 transition-colors p-1"
                            title="Editar evaluador"
                            disabled={loading}
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(evaluator.id)}
                            className="text-red-600 hover:text-red-800 transition-colors p-1"
                            title="Eliminar evaluador"
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1 mb-3">
                        <p className="text-sm text-academic-700 flex items-center">
                          <span className="font-semibold mr-2">Email:</span>
                          {evaluator.email}
                        </p>
                        <p className="text-sm text-academic-700 flex items-center">
                          <span className="font-semibold mr-2">Rol:</span>
                          {evaluator.rol}
                        </p>
                      </div>
                      <span className={`inline-block text-xs font-semibold ${tipoColor.bg} ${tipoColor.text} px-3 py-1.5 rounded-lg`}>
                        {getTipoLabel(evaluator.tipo)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
