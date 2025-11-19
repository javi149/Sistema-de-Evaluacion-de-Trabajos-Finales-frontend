import { useState } from 'react';
import { UserPlus, Save, Pencil, Trash2, X } from 'lucide-react';
import { Student } from '../types';

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
  });
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    studentId: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newStudent: Student = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
    };

    setStudents([...students, newStudent]);
    setFormData({ name: '', email: '', studentId: '' });
  };

  const startEditing = (student: Student) => {
    setEditingStudentId(student.id);
    setEditFormData({
      name: student.name,
      email: student.email,
      studentId: student.studentId,
    });
  };

  const cancelEditing = () => {
    setEditingStudentId(null);
    setEditFormData({ name: '', email: '', studentId: '' });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudentId) return;

    setStudents((prev) =>
      prev.map((student) =>
        student.id === editingStudentId ? { ...student, ...editFormData } : student
      )
    );
    cancelEditing();
  };

  const handleDelete = (studentId: string) => {
    setStudents((prev) => prev.filter((student) => student.id !== studentId));
    if (editingStudentId === studentId) {
      cancelEditing();
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <UserPlus className="h-6 w-6 text-blue-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-900">Registrar Estudiantes</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Nuevo Estudiante</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Completo
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código de Estudiante
              </label>
              <input
                type="text"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <Save className="h-4 w-4 mr-2" />
              Registrar Estudiante
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Estudiantes Registrados ({students.length})
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {students.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay estudiantes registrados</p>
            ) : (
              students.map((student) => (
                <div key={student.id} className="border border-gray-200 rounded-md p-4">
                  {editingStudentId === student.id ? (
                    <form onSubmit={handleUpdate} className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Nombre
                        </label>
                        <input
                          type="text"
                          value={editFormData.name}
                          onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Correo
                        </label>
                        <input
                          type="email"
                          value={editFormData.email}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, email: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Código
                        </label>
                        <input
                          type="text"
                          value={editFormData.studentId}
                          onChange={(e) =>
                            setEditFormData({ ...editFormData, studentId: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          type="button"
                          onClick={cancelEditing}
                          className="inline-flex items-center px-3 py-2 rounded-md border border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="inline-flex items-center px-3 py-2 rounded-md bg-green-600 text-white text-sm hover:bg-green-700"
                        >
                          <Save className="h-4 w-4 mr-1" />
                          Guardar cambios
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">{student.name}</h4>
                          <p className="text-sm text-gray-600">Código: {student.studentId}</p>
                          <p className="text-sm text-gray-600">{student.email}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => startEditing(student)}
                            className="inline-flex items-center px-2 py-1 text-sm text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50"
                          >
                            <Pencil className="h-4 w-4 mr-1" />
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(student.id)}
                            className="inline-flex items-center px-2 py-1 text-sm text-red-600 border border-red-200 rounded-md hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Eliminar
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400">
                        Registrado el {new Date(student.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
