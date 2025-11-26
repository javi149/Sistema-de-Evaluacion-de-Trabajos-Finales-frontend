import { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { Student } from '../types';
import { UpdateStudentDto } from '../services/studentService';

interface StudentEditModalProps {
    student: Student | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (id: number, data: UpdateStudentDto) => Promise<boolean>;
    loading?: boolean;
}

export function StudentEditModal({
    student,
    isOpen,
    onClose,
    onSave,
    loading = false,
}: StudentEditModalProps) {
    const [formData, setFormData] = useState<UpdateStudentDto>({
        nombre: '',
        apellido: '',
        rut: '',
        carrera: '',
        email: '',
    });
    const [error, setError] = useState<string | null>(null);

    // Cargar datos del estudiante cuando se abre el modal
    useEffect(() => {
        if (student && isOpen) {
            setFormData({
                nombre: student.nombre,
                apellido: student.apellido,
                rut: student.rut,
                carrera: student.carrera,
                email: student.email,
            });
            setError(null);
        }
    }, [student, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!student) return;

        const success = await onSave(student.id, formData);
        if (success) {
            onClose();
        } else {
            setError('Error al actualizar el estudiante');
        }
    };

    const handleClose = () => {
        setError(null);
        onClose();
    };

    if (!isOpen || !student) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-academic-200">
                    <h3 className="text-2xl font-bold text-academic-900">
                        Editar Estudiante
                    </h3>
                    <button
                        onClick={handleClose}
                        className="text-academic-400 hover:text-academic-600 transition-colors"
                        disabled={loading}
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-academic-700 mb-2">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    value={formData.nombre || ''}
                                    onChange={(e) =>
                                        setFormData({ ...formData, nombre: e.target.value })
                                    }
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
                                    value={formData.apellido || ''}
                                    onChange={(e) =>
                                        setFormData({ ...formData, apellido: e.target.value })
                                    }
                                    className="input-elegant"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-academic-700 mb-2">
                                RUT
                            </label>
                            <input
                                type="text"
                                value={formData.rut || ''}
                                onChange={(e) =>
                                    setFormData({ ...formData, rut: e.target.value })
                                }
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
                                value={formData.carrera || ''}
                                onChange={(e) =>
                                    setFormData({ ...formData, carrera: e.target.value })
                                }
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
                                value={formData.email || ''}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                                className="input-elegant"
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Footer Buttons */}
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-6 py-2.5 border-2 border-academic-300 text-academic-700 rounded-xl font-semibold hover:bg-academic-50 transition-all duration-200"
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={loading}
                            >
                                <Save className="h-5 w-5 mr-2" />
                                {loading ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
