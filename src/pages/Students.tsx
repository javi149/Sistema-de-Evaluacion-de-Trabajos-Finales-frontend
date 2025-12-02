import { useState } from 'react';
import { Users, Plus, Edit2, Trash2, Search, RefreshCw } from 'lucide-react';
import { useStudents } from '../hooks';
import { Student } from '../types';
import { StudentCreateModal } from '../components/StudentCreateModal';
import { StudentEditModal } from '../components/StudentEditModal';
import { ConfirmModal } from '../components/ConfirmModal';

export default function Students() {
  const {
    students,
    loading,
    error,
    createStudent,
    partialUpdateStudent,
    deleteStudent,
    clearError,
    refresh,
  } = useStudents();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleSaveCreate = async (data: any) => {
    clearError();
    const result = await createStudent(data);
    return !!result;
  };

  const handleEdit = (student: Student) => {
    setStudentToEdit(student);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (id: number, data: any) => {
    clearError();
    const result = await partialUpdateStudent(id, data);
    if (result) {
      setIsEditModalOpen(false);
      setStudentToEdit(null);
      return true;
    }
    return false;
  };

  const handleDelete = (id: number) => {
    setStudentToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (studentToDelete !== null) {
      clearError();
      await deleteStudent(studentToDelete);
    }
    setIsDeleteModalOpen(false);
    setStudentToDelete(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality when backend supports it
    console.log('Searching for:', searchTerm);
  };

  const filteredStudents = students.filter(student =>
    searchTerm === '' ||
    student.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rut.includes(searchTerm) ||
    student.carrera.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-fade-in-down">
        <div className="flex items-center">
          <div className="bg-primary-100 p-3 rounded-xl mr-4">
            <Users className="h-7 w-7 text-primary-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gradient-primary">Estudiantes</h2>
            <p className="text-academic-600">Gestiona los estudiantes registrados</p>
          </div>
        </div>
        <button
          onClick={handleCreate}
          className="btn-primary flex items-center shadow-lg shadow-primary-200/50 hover:shadow-xl hover:shadow-primary-300/50"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nuevo Estudiante
        </button>
      </div>

      {/* Search Bar */}
      <div className="card-elegant mb-8 animate-fade-in-up">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-academic-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar estudiantes por nombre, RUT o carrera..."
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

      {/* Students List */}
      <div className="card-elegant overflow-hidden">
        {loading && students.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-academic-500">Cargando estudiantes...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-academic-300 mx-auto mb-4" />
            <p className="text-academic-500 font-medium">
              {searchTerm ? 'No se encontraron estudiantes con ese criterio' : 'No hay estudiantes registrados'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-academic-50 border-b border-academic-200">
                <tr>
                  {/* <th className="px-6 py-4 text-left text-xs font-semibold text-academic-700 uppercase tracking-wider">ID</th> */}
                  <th className="px-6 py-4 text-left text-xs font-semibold text-academic-700 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-academic-700 uppercase tracking-wider">RUT</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-academic-700 uppercase tracking-wider">Carrera</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-academic-700 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-academic-700 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-academic-100">
                {filteredStudents.map((student, index) => (
                  <tr
                    key={student.id}
                    className="hover:bg-primary-50/50 transition-colors animate-fade-in-up"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold bg-primary-100 text-primary-700">
                        {student.id}
                      </span>
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-academic-900">
                        {student.nombre} {student.apellido}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-academic-600">
                      {student.rut}
                    </td>
                    <td className="px-6 py-4 text-sm text-academic-600">
                      {student.carrera}
                    </td>
                    <td className="px-6 py-4 text-sm text-academic-600">
                      <div className="max-w-xs truncate" title={student.email}>
                        {student.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(student)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
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

      {/* Modals */}
      <StudentCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveCreate}
        loading={loading}
      />

      <StudentEditModal
        student={studentToEdit}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setStudentToEdit(null);
        }}
        onSave={handleSaveEdit}
        loading={loading}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        message="¿Estás seguro de que deseas eliminar este estudiante?"
        onConfirm={confirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setStudentToDelete(null);
        }}
      />
    </div>
  );
}
