import { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { Trabajo } from '../types';
import { UpdateTrabajoDto } from '../services/trabajoService';

interface WorkEditModalProps {
    trabajo: Trabajo | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (id: number, data: UpdateTrabajoDto) => Promise<boolean>;
    loading?: boolean;
}

export function WorkEditModal({
    trabajo,
    isOpen,
    onClose,
    onSave,
    loading = false,
}: WorkEditModalProps) {
    const [formData, setFormData] = useState<UpdateTrabajoDto>({
        titulo: '',
        resumen: '',
        estudiante_id: 0,
        fecha_entrega: '',
        duracion_meses: undefined,
        nota_aprobacion: undefined,
        requisito_aprobacion: '',
    });
    const [error, setError] = useState<string | null>(null);

    // Cargar datos del trabajo cuando se abre el modal
    useEffect(() => {
        if (trabajo && isOpen) {
            setFormData({
                titulo: trabajo.titulo,
                resumen: trabajo.resumen || '',
                estudiante_id: trabajo.estudiante_id,
                fecha_entrega: trabajo.fecha_entrega,
                duracion_meses: trabajo.duracion_meses || undefined,
                nota_aprobacion: trabajo.nota_aprobacion || undefined,
                requisito_aprobacion: trabajo.requisito_aprobacion || '',
            });
            setError(null);
        }
    }, [trabajo, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!trabajo) return;

        const success = await onSave(trabajo.id, formData);
        if (success) {
            onClose();
        } else {
            setError('Error al actualizar el trabajo');
        }
    };

    const handleClose = () => {
        setError(null);
        onClose();
    };

    if (!isOpen || !trabajo) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] animate-fade-in p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col animate-slide-up">
                {/* Header - Fixed */}
                <div className="flex items-center justify-between p-6 border-b border-academic-200 flex-shrink-0">
                    <h3 className="text-2xl font-bold text-academic-900">
                        Editar Trabajo
                    </h3>
                    <button
                        onClick={handleClose}
                        className="text-academic-400 hover:text-academic-600 transition-colors"
                        disabled={loading}
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="p-6 overflow-y-auto flex-1">
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-academic-700 mb-2">
                                Título
                            </label>
                            <input
                                type="text"
                                value={formData.titulo || ''}
                                onChange={(e) =>
                                    setFormData({ ...formData, titulo: e.target.value })
                                }
                                className="input-elegant"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-academic-700 mb-2">
                                Resumen
                            </label>
                            <textarea
                                value={formData.resumen || ''}
                                onChange={(e) =>
                                    setFormData({ ...formData, resumen: e.target.value })
                                }
                                className="input-elegant resize-none"
                                rows={4}
                                disabled={loading}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-academic-700 mb-2">
                                    ID Estudiante
                                </label>
                                <input
                                    type="number"
                                    value={formData.estudiante_id || ''}
                                    onChange={(e) =>
                                        setFormData({ ...formData, estudiante_id: parseInt(e.target.value) || 0 })
                                    }
                                    className="input-elegant"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-academic-700 mb-2">
                                    Fecha de Entrega
                                </label>
                                <input
                                    type="date"
                                    value={formData.fecha_entrega || ''}
                                    onChange={(e) =>
                                        setFormData({ ...formData, fecha_entrega: e.target.value })
                                    }
                                    className="input-elegant"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-academic-700 mb-2">
                                    Duración (meses)
                                </label>
                                <input
                                    type="number"
                                    value={formData.duracion_meses || ''}
                                    onChange={(e) =>
                                        setFormData({ ...formData, duracion_meses: e.target.value ? parseInt(e.target.value) : undefined })
                                    }
                                    className="input-elegant"
                                    min="1"
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-academic-700 mb-2">
                                    Nota de Aprobación
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={formData.nota_aprobacion || ''}
                                    onChange={(e) =>
                                        setFormData({ ...formData, nota_aprobacion: e.target.value ? parseFloat(e.target.value) : undefined })
                                    }
                                    className="input-elegant"
                                    min="1.0"
                                    max="7.0"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-academic-700 mb-2">
                                Requisito de Aprobación
                            </label>
                            <input
                                type="text"
                                value={formData.requisito_aprobacion || ''}
                                onChange={(e) =>
                                    setFormData({ ...formData, requisito_aprobacion: e.target.value })
                                }
                                className="input-elegant"
                                disabled={loading}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer - Fixed */}
                <div className="flex justify-end gap-3 p-6 border-t border-academic-200 flex-shrink-0">
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
                        onClick={handleSubmit}
                        className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        <Save className="h-5 w-5 mr-2" />
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </div>
        </div>
    );
}
