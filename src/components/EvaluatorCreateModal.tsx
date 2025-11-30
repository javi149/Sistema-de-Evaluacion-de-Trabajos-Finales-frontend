import { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { CreateEvaluatorDto } from '../types';

interface EvaluatorCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: CreateEvaluatorDto) => Promise<boolean>;
    loading?: boolean;
}

export function EvaluatorCreateModal({
    isOpen,
    onClose,
    onSave,
    loading = false,
}: EvaluatorCreateModalProps) {
    const [formData, setFormData] = useState<CreateEvaluatorDto>({
        nombre: '',
        email: '',
        tipo: 'guia',
    });
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const success = await onSave(formData);
        if (success) {
            // Reset form
            setFormData({
                nombre: '',
                email: '',
                tipo: 'guia',
            });
            onClose();
        } else {
            setError('Error al crear el evaluador');
        }
    };

    const handleClose = () => {
        setError(null);
        setFormData({
            nombre: '',
            email: '',
            tipo: 'guia',
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] animate-fade-in p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-slide-up">
                {/* Header - Fixed */}
                <div className="flex items-center justify-between p-6 border-b border-academic-200 flex-shrink-0">
                    <h3 className="text-2xl font-bold text-academic-900">
                        Nuevo Evaluador
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
                                Nombre Completo
                            </label>
                            <input
                                type="text"
                                value={formData.nombre}
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
                                Correo Electrónico
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                                className="input-elegant"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-academic-700 mb-2">
                                Tipo de Evaluador
                            </label>
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
                        className="btn-secondary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        <Save className="h-5 w-5 mr-2" />
                        {loading ? 'Guardando...' : 'Crear Evaluador'}
                    </button>
                </div>
            </div>
        </div>
    );
}
