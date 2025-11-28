import { useState, useEffect } from 'react';
import { FileText, Save, BookOpen, Edit2, Trash2, Eye } from 'lucide-react';
import { useTrabajos } from '../hooks/useTrabajos';
import { useStudents } from '../hooks/useStudents';
import { CreateTrabajoDto } from '../services/trabajoService';
import { WorkEditModal } from '../components/WorkEditModal';

export default function Works() {
  const {
    trabajos,
    loading,
    error,
    createTrabajo,
    updateTrabajo,
    deleteTrabajo,
    getEvaluaciones,
  } = useTrabajos();

  const { students } = useStudents();

  const [formData, setFormData] = useState<CreateTrabajoDto>({
    titulo: '',
    resumen: '',
    estudiante_id: 0,
    fecha_entrega: '',
    duracion_meses: undefined,
    nota_aprobacion: undefined,
    requisito_aprobacion: '',
  });

  const [editingTrabajo, setEditingTrabajo] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [evaluaciones, setEvaluaciones] = useState<any[]>([]);
  const [showEvaluaciones, setShowEvaluaciones] = useState<number | null>(null);

  // Set default estudiante_id when students load
  useEffect(() => {
    if (students.length > 0 && formData.estudiante_id === 0) {
      setFormData(prev => ({ ...prev, estudiante_id: students[0].id }));
    }
  }, [students, formData.estudiante_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await createTrabajo(formData);
    if (result) {
      setFormData({
        titulo: '',
        resumen: '',
        estudiante_id: students.length > 0 ? students[0].id : 0,
        fecha_entrega: '',
        duracion_meses: undefined,
        nota_aprobacion: undefined,
        requisito_aprobacion: '',
      });
    }
  };

  const handleEdit = (trabajo: any) => {
    setEditingTrabajo(trabajo);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (id: number, data: any) => {
    const result = await updateTrabajo(id, data);
    if (result) {
      setIsEditModalOpen(false);
      setEditingTrabajo(null);
      return true;
    }
    return false;
  };

  const handleDelete = async (id: number) => {
    const success = await deleteTrabajo(id);
    if (success) {
      setDeleteConfirm(null);
    }
  };

  const handleViewEvaluaciones = async (trabajoId: number) => {
    if (showEvaluaciones === trabajoId) {
      setShowEvaluaciones(null);
      setEvaluaciones([]);
    } else {
      const evals = await getEvaluaciones(trabajoId);
      setEvaluaciones(evals);
      setShowEvaluaciones(trabajoId);
    }
  };

  const getEstudianteNombre = (estudianteId: number) => {
    const estudiante = students.find(s => s.id === estudianteId);
    return estudiante ? `${estudiante.nombre} ${estudiante.apellido}` : `ID: ${estudianteId}`;
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-8 animate-fade-in-down">
        <div className="bg-accent-100 p-3 rounded-xl mr-4">
          <FileText className="h-7 w-7 text-accent-600" />
        </div>
        <h2 className="text-3xl font-bold text-gradient-accent">Gestión de Trabajos</h2>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario de Creación */}
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
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                className="input-elegant"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-academic-700 mb-2">Resumen</label>
              <textarea
                value={formData.resumen}
                onChange={(e) => setFormData({ ...formData, resumen: e.target.value })}
                className="input-elegant resize-none"
                rows={3}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-academic-700 mb-2">
                Estudiante
              </label>
              <select
                value={formData.estudiante_id}
                onChange={(e) => setFormData({ ...formData, estudiante_id: parseInt(e.target.value) })}
                className="input-elegant"
                required
                disabled={loading}
              >
                <option value={0}>Seleccionar estudiante</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.nombre} {student.apellido} - {student.rut}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-academic-700 mb-2">
                  Fecha de Entrega
                </label>
                <input
                  type="date"
                  value={formData.fecha_entrega}
                  onChange={(e) => setFormData({ ...formData, fecha_entrega: e.target.value })}
                  className="input-elegant"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-academic-700 mb-2">
                  Duración (meses)
                </label>
                <input
                  type="number"
                  value={formData.duracion_meses || ''}
                  onChange={(e) => setFormData({ ...formData, duracion_meses: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="input-elegant"
                  min="1"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-academic-700 mb-2">
                  Nota de Aprobación
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.nota_aprobacion || ''}
                  onChange={(e) => setFormData({ ...formData, nota_aprobacion: e.target.value ? parseFloat(e.target.value) : undefined })}
                  className="input-elegant"
                  min="1.0"
                  max="7.0"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-academic-700 mb-2">
                  Requisito
                </label>
                <input
                  type="text"
                  value={formData.requisito_aprobacion || ''}
                  onChange={(e) => setFormData({ ...formData, requisito_aprobacion: e.target.value })}
                  className="input-elegant"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-accent w-full flex items-center justify-center"
              disabled={loading}
            >
              <Save className="h-5 w-5 mr-2" />
              {loading ? 'Registrando...' : 'Registrar Trabajo'}
            </button>
          </form>
        </div>

        {/* Lista de Trabajos */}
        <div className="card-elegant animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-xl font-bold text-academic-900 mb-6 flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-accent-600" />
            Trabajos Registrados
            <span className="ml-3 bg-accent-100 text-accent-700 px-3 py-1 rounded-full text-sm font-semibold">
              {trabajos.length}
            </span>
          </h3>
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {loading && trabajos.length === 0 ? (
              <div className="text-center py-12 animate-fade-in">
                <FileText className="h-16 w-16 text-academic-300 mx-auto mb-4" />
                <p className="text-academic-500 font-medium">Cargando trabajos...</p>
              </div>
            ) : trabajos.length === 0 ? (
              <div className="text-center py-12 animate-fade-in">
                <FileText className="h-16 w-16 text-academic-300 mx-auto mb-4" />
                <p className="text-academic-500 font-medium">No hay trabajos registrados</p>
              </div>
            ) : (
              trabajos.map((trabajo, index) => (
                <div
                  key={trabajo.id}
                  className="bg-gradient-to-r from-academic-50 to-accent-50/30 border-2 border-academic-200/50 rounded-xl p-5 hover-lift-subtle animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-academic-900 text-lg flex-1">{trabajo.titulo}</h4>
                    <div className="flex gap-2 ml-2">
                      <button
                        onClick={() => handleViewEvaluaciones(trabajo.id)}
                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Ver evaluaciones"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(trabajo)}
                        className="p-2 text-accent-600 hover:bg-accent-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(trabajo.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {trabajo.resumen && (
                    <p className="text-sm text-academic-700 mb-3 leading-relaxed">{trabajo.resumen}</p>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-xs text-academic-600 mb-3">
                    <div><span className="font-semibold">Estudiante:</span> {getEstudianteNombre(trabajo.estudiante_id)}</div>
                    <div><span className="font-semibold">Entrega:</span> {new Date(trabajo.fecha_entrega).toLocaleDateString()}</div>
                    {trabajo.duracion_meses && (
                      <div><span className="font-semibold">Duración:</span> {trabajo.duracion_meses} meses</div>
                    )}
                    {trabajo.nota_aprobacion && (
                      <div><span className="font-semibold">Nota aprob.:</span> {trabajo.nota_aprobacion}</div>
                    )}
                  </div>

                  {/* Evaluaciones */}
                  {showEvaluaciones === trabajo.id && (
                    <div className="mt-3 pt-3 border-t border-academic-200">
                      <h5 className="font-semibold text-sm text-academic-800 mb-2">Evaluaciones:</h5>
                      {evaluaciones.length === 0 ? (
                        <p className="text-xs text-academic-500">No hay evaluaciones registradas</p>
                      ) : (
                        <div className="space-y-2">
                          {evaluaciones.map((evaluacion) => (
                            <div key={evaluacion.id} className="bg-white p-2 rounded-lg text-xs">
                              <div className="flex justify-between">
                                <span className="font-semibold">Evaluación #{evaluacion.id}</span>
                                {evaluacion.nota_final && <span className="text-primary-600">Nota: {evaluacion.nota_final}</span>}
                              </div>
                              {evaluacion.comentarios && (
                                <p className="text-academic-600 mt-1">{evaluacion.comentarios}</p>
                              )}
                              {evaluacion.fecha_evaluacion && (
                                <p className="text-academic-500 mt-1">
                                  Fecha: {new Date(evaluacion.fecha_evaluacion).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Delete Confirmation */}
                  {deleteConfirm === trabajo.id && (
                    <div className="mt-3 pt-3 border-t border-red-200 bg-red-50 -mx-5 -mb-5 px-5 py-3 rounded-b-xl">
                      <p className="text-sm text-red-700 mb-3 font-semibold">
                        ¿Estás seguro de eliminar este trabajo?
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(trabajo.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
                        >
                          Sí, eliminar
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-4 py-2 bg-academic-200 text-academic-700 rounded-lg text-sm font-semibold hover:bg-academic-300 transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <WorkEditModal
        trabajo={editingTrabajo}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTrabajo(null);
        }}
        onSave={handleSaveEdit}
        loading={loading}
      />
    </div>
  );
}

