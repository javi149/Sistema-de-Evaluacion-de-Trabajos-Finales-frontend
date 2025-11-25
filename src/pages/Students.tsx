import { useState } from 'react';
import { UserPlus, Save, Users, Trash2, AlertCircle } from 'lucide-react';
import { useStudents } from '../hooks';

export default function Students() {
  const {
    students,
    loading,
    error,
    createStudent,
    deleteStudent,
    clearError,
  } = useStudents();

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    rut: '',
    carrera: '',
    email: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const result = await createStudent(formData);
    
    if (result) {
      setFormData({
        nombre: '',
        apellido: '',
        rut: '',
        carrera: '',
        email: '',
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este estudiante?')) {
      clearError();
      await deleteStudent(id);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-8 animate-fade-in-down">
        <div className="bg-primary-100 p-3 rounded-xl mr-4">
          <UserPlus className="h-7 w-7 text-primary-600" />
        </div>
        <h2 className="text-3xl font-bold text-gradient-primary">Registrar Estudiantes</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card-elegant animate-fade-in-up">
          <h3 className="text-xl font-bold text-academic-900 mb-6 flex items-center">
            <Save className="h-5 w-5 mr-2 text-primary-600" />
            Nuevo Estudiante
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
                Nombre
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
                Apellido
              </label>
              <input
                type="text"
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                className="input-elegant"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-academic-700 mb-2">
                RUT
              </label>
              <input
                type="text"
                value={formData.rut}
                onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
                className="input-elegant"
                placeholder="12.345.678-9"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-academic-700 mb-2">
                Carrera
              </label>
              <input
                type="text"
                value={formData.carrera}
                onChange={(e) => setFormData({ ...formData, carrera: e.target.value })}
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

            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              <Save className="h-5 w-5 mr-2" />
              {loading ? 'Registrando...' : 'Registrar Estudiante'}
            </button>
          </form>
        </div>

        <div className="card-elegant animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-xl font-bold text-academic-900 mb-6 flex items-center">
            <Users className="h-5 w-5 mr-2 text-primary-600" />
            Estudiantes Registrados
            <span className="ml-3 bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold">
              {students.length}
            </span>
          </h3>
          {loading && students.length === 0 ? (
            <div className="text-center py-12 animate-fade-in">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-academic-500 font-medium">Cargando estudiantes...</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {students.length === 0 ? (
                <div className="text-center py-12 animate-fade-in">
                  <Users className="h-16 w-16 text-academic-300 mx-auto mb-4" />
                  <p className="text-academic-500 font-medium">No hay estudiantes registrados</p>
                </div>
              ) : (
                students.map((student, index) => (
                  <div
                    key={student.id}
                    className="bg-gradient-to-r from-academic-50 to-primary-50/30 border-2 border-academic-200/50 rounded-xl p-5 hover-lift-subtle animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-academic-900 text-lg">
                        {student.nombre} {student.apellido}
                      </h4>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="text-red-600 hover:text-red-800 transition-colors p-1"
                        title="Eliminar estudiante"
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-academic-700 flex items-center">
                        <span className="font-semibold mr-2">RUT:</span>
                        {student.rut}
                      </p>
                      <p className="text-sm text-academic-700 flex items-center">
                        <span className="font-semibold mr-2">Carrera:</span>
                        {student.carrera}
                      </p>
                      <p className="text-sm text-academic-700 flex items-center">
                        <span className="font-semibold mr-2">Email:</span>
                        {student.email}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
