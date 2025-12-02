import { useState } from 'react';
import { UserCheck, Plus, Edit2, Trash2, Search, RefreshCw, FileText } from 'lucide-react';
import { useEvaluators } from '../hooks';
import { Evaluator } from '../types';
import { EvaluatorCreateModal } from '../components/EvaluatorCreateModal';
import { EvaluatorEditModal } from '../components/EvaluatorEditModal';
import { ConfirmModal } from '../components/ConfirmModal';

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
    refresh,
  } = useEvaluators();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [evaluatorToEdit, setEvaluatorToEdit] = useState<Evaluator | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [evaluatorToDelete, setEvaluatorToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleSaveCreate = async (data: any) => {
    clearError();
    const result = await createEvaluator(data);
    return !!result;
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

  const handleViewEvaluaciones = async (evaluator: Evaluator) => {
    const evaluaciones = await getEvaluatorEvaluaciones(evaluator.id);
    if (evaluaciones) {
      // TODO: Mostrar evaluaciones en un modal o navegar a una página de detalles
      console.log('Evaluaciones del evaluador:', evaluaciones);
      alert(`Evaluaciones de ${evaluator.nombre}: ${evaluaciones.length} evaluaciones encontradas`);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality when backend supports it
    console.log('Searching for:', searchTerm);
  };

  const filteredEvaluators = evaluators.filter(evaluator =>
    searchTerm === '' ||
    evaluator.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    evaluator.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (evaluator.rol && evaluator.rol.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-fade-in-down">
        <div className="flex items-center">
          <div className="bg-secondary-100 p-3 rounded-xl mr-4">
            <UserCheck className="h-7 w-7 text-secondary-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gradient-secondary">Evaluadores</h2>
            <p className="text-academic-600">Gestiona los evaluadores registrados</p>
          </div>
        </div>
        <button
          onClick={handleCreate}
          className="btn-secondary flex items-center shadow-lg shadow-secondary-200/50 hover:shadow-xl hover:shadow-secondary-300/50"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nuevo Evaluador
        </button>
      </div>

      {/* Search Bar */}
      <div className="card-elegant mb-8 animate-fade-in-up">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-academic-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar evaluadores por nombre, email o rol..."
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
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center animate-fade-in">
          <div className="bg-red-100 p-2 rounded-full mr-3">
            <span className="text-xl">⚠️</span>
          </div>
          {error}
        </div>
      )}

      {/* Evaluators List */}
      <div className="card-elegant overflow-hidden">
        {loading && evaluators.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-600 mx-auto mb-4"></div>
            <p className="text-academic-500">Cargando evaluadores...</p>
          </div>
        ) : filteredEvaluators.length === 0 ? (
          <div className="text-center py-12">
            <UserCheck className="h-16 w-16 text-academic-300 mx-auto mb-4" />
            <p className="text-academic-500 font-medium">
              {searchTerm ? 'No se encontraron evaluadores con ese criterio' : 'No hay evaluadores registrados'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-academic-50 border-b border-academic-200">
                <tr>
                  {/* <th className="px-6 py-4 text-left text-xs font-semibold text-academic-700 uppercase tracking-wider">ID</th> */}
                  <th className="px-6 py-4 text-left text-xs font-semibold text-academic-700 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-academic-700 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-academic-700 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-academic-700 uppercase tracking-wider">Rol</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-academic-700 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-academic-100">
                {filteredEvaluators.map((evaluator, index) => {
                  const tipoColor = getTipoColor(evaluator.tipo);
                  return (
                    <tr
                      key={evaluator.id}
                      className="hover:bg-secondary-50/50 transition-colors animate-fade-in-up"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      {/* <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold bg-secondary-100 text-secondary-700">
                          {evaluator.id}
                        </span>
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-academic-900">
                          {evaluator.nombre}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-academic-600">
                        <div className="max-w-xs truncate" title={evaluator.email}>
                          {evaluator.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${tipoColor.bg} ${tipoColor.text}`}>
                          {getTipoLabel(evaluator.tipo)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-academic-600">
                        {evaluator.rol || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleViewEvaluaciones(evaluator)}
                            className="p-2 text-accent-600 hover:bg-accent-50 rounded-lg transition-colors"
                            title="Ver evaluaciones"
                          >
                            <FileText className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(evaluator)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(evaluator.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <EvaluatorCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveCreate}
        loading={loading}
      />

      <EvaluatorEditModal
        evaluator={evaluatorToEdit}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEvaluatorToEdit(null);
        }}
        onSave={handleSaveEdit}
        loading={loading}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        message="¿Estás seguro de que deseas eliminar este evaluador?"
        onConfirm={confirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setEvaluatorToDelete(null);
        }}
      />
    </div>
  );
}
