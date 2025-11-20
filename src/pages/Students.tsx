import { useState } from 'react';
import { UserPlus, Save, Users } from 'lucide-react';
import { Student } from '../types';

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [formData, setFormData] = useState({
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
              <label className="block text-sm font-semibold text-academic-700 mb-2">
                Código de Estudiante
              </label>
              <input
                type="text"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                className="input-elegant"
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center"
            >
              <Save className="h-5 w-5 mr-2" />
              Registrar Estudiante
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
                  <h4 className="font-bold text-academic-900 mb-2 text-lg">{student.name}</h4>
                  <div className="space-y-1">
                    <p className="text-sm text-academic-700 flex items-center">
                      <span className="font-semibold mr-2">Código:</span>
                      {student.studentId}
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
        </div>
      </div>
    </div>
  );
}
