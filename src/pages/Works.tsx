import { useState } from 'react';
import { FileText, Plus, Edit2, Trash2, Search, RefreshCw, Eye, ChevronUp } from 'lucide-react';
import { useTrabajos } from '../hooks/useTrabajos';
import { useStudents } from '../hooks/useStudents';
import { Trabajo } from '../types';
import { WorkCreateModal } from '../components/WorkCreateModal';
import { WorkEditModal } from '../components/WorkEditModal';
import { ConfirmModal } from '../components/ConfirmModal';

export default function Works() {
  const {
    trabajos,
    loading,
    error,
    createTrabajo,
    updateTrabajo,
    deleteTrabajo,
    getEvaluaciones,
    refresh,
  } = useTrabajos();

  const { students } = useStudents();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [trabajoToEdit, setTrabajoToEdit] = useState<Trabajo | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [trabajoToDelete, setTrabajoToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedTrabajo, setExpandedTrabajo] = useState<number | null>(null);
  const [evaluaciones, setEvaluaciones] = useState<any[]>([]);

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleSaveCreate = async (data: any) => {
    const result = await createTrabajo(data);
    return !!result;
  };

  const handleEdit = (trabajo: Trabajo) => {
    setTrabajoToEdit(trabajo);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (id: number, data: any) => {
    const result = await updateTrabajo(id, data);
    if (result) {
      setIsEditModalOpen(false);
      setTrabajoToEdit(null);
      return true;
    }
    return false;
  };

  const handleDelete = (id: number) => {
    setTrabajoToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (trabajoToDelete !== null) {
      await deleteTrabajo(trabajoToDelete);
    }
    setIsDeleteModalOpen(false);
    setTrabajoToDelete(null);
  };

  const handleToggleEvaluaciones = async (trabajoId: number) => {
    if (expandedTrabajo === trabajoId) {
      setExpandedTrabajo(null);
      setEvaluaciones([]);
    } else {
      const evals = await getEvaluaciones(trabajoId);
      setEvaluaciones(evals);
      setExpandedTrabajo(trabajoId);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
  };

  const getEstudianteNombre = (estudianteId: number) => {
    const estudiante = students.find(s => s.id === estudianteId);
    return estudiante ? `${estudiante.nombre} ${estudiante.apellido}` : `ID: ${estudianteId}`;
  };

  const filteredTrabajos = trabajos.filter(trabajo =>
    searchTerm === '' ||
    trabajo.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (trabajo.resumen && trabajo.resumen.toLowerCase().includes(searchTerm.toLowerCase())) ||
    getEstudianteNombre(trabajo.estudiante_id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-fade-in-down">
        <div className="flex items-center">
          <div className="bg-accent-100 p-3 rounded-xl mr-4">
            <FileText className="h-7 w-7 text-accent-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gradient-accent">Trabajos Finales</h2>
            <p className="text-academic-600">Gestiona los trabajos finales registrados</p>
          </div>
        </div>
        <button
          onClick={handleCreate}
          className="btn-accent flex items-center shadow-lg shadow-accent-200/50 hover:shadow-xl hover:shadow-accent-300/50"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nuevo Trabajo
        </button>
      </div>

      {/* Search Bar */}
      <div className="card-elegant mb-8 animate-fade-in-up">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-academic-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar trabajos por título, resumen o estudiante..."
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

      {/* Works List */}
      <div className="card-elegant overflow-hidden">
        {loading && trabajos.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600 mx-auto mb-4"></div>
            <p className="text-academic-500">Cargando trabajos...</p>
          </div>
        ) : filteredTrabajos.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-academic-300 mx-auto mb-4" />
            <p className="text-academic-500 font-medium">
              {searchTerm ? 'No se encontraron trabajos con ese criterio' : 'No hay trabajos registrados'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-academic-50 border-b border-academic-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-academic-700 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-academic-700 uppercase tracking-wider">Título</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-academic-700 uppercase tracking-wider">Estudiante</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-academic-700 uppercase tracking-wider">Fecha Entrega</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-academic-700 uppercase tracking-wider">Duración</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-academic-700 uppercase tracking-wider">Nota</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-academic-700 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-academic-100">
                {filteredTrabajos.map((trabajo, index) => (
                  <tr
                    key={trabajo.id}
                    className="hover:bg-accent-50/50 transition-colors animate-fade-in-up"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold bg-accent-100 text-accent-700">
                        {trabajo.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-academic-900 max-w-md">
                        {trabajo.titulo}
                      </div>
                      {trabajo.resumen && (
                        <div className="text-xs text-academic-500 mt-1 line-clamp-1 max-w-md">
                          {trabajo.resumen}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-academic-600">
                      {getEstudianteNombre(trabajo.estudiante_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-academic-600">
                      {new Date(trabajo.fecha_entrega).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-academic-600">
                      {trabajo.duracion_meses ? `${trabajo.duracion_meses} meses` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-academic-600">
                      {trabajo.nota_aprobacion || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleToggleEvaluaciones(trabajo.id)}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Ver evaluaciones"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(trabajo)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(trabajo.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Evaluaciones Modal/Expandable Section */}
      {expandedTrabajo !== null && (
        <div className="card-elegant mt-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-accent-700">
              Evaluaciones del Trabajo #{expandedTrabajo}
            </h3>
            <button
              onClick={() => {
                setExpandedTrabajo(null);
                setEvaluaciones([]);
              }}
              className="p-2 text-academic-400 hover:text-academic-600 transition-colors"
            >
              <ChevronUp className="h-5 w-5" />
            </button>
          </div>
          {evaluaciones.length === 0 ? (
            <p className="text-sm text-academic-500">No hay evaluaciones registradas</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {evaluaciones.map((evaluacion) => (
                <div key={evaluacion.id} className="bg-accent-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-semibold text-academic-900">
                      Evaluación #{evaluacion.id}
                    </span>
                    {evaluacion.nota_final && (
                      <span className="text-lg font-bold text-accent-600">
                        {evaluacion.nota_final}
                      </span>
                    )}
                  </div>
                  {evaluacion.comentarios && (
                    <p className="text-sm text-academic-600">{evaluacion.comentarios}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <WorkCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveCreate}
        loading={loading}
      />

      <WorkEditModal
        trabajo={trabajoToEdit}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setTrabajoToEdit(null);
        }}
        onSave={handleSaveEdit}
        loading={loading}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        message="¿Estás seguro de que deseas eliminar este trabajo?"
        onConfirm={confirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setTrabajoToDelete(null);
        }}
      />
    </div>
  );
}
