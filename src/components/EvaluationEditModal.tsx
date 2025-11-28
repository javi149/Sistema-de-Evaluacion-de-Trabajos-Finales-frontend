import { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { Evaluacion } from '../types';
import { UpdateEvaluacionDto } from '../services/evaluationService';
import { EvaluationDetailsSection } from './EvaluationDetailsSection';

interface EvaluationEditModalProps {
    evaluacion: Evaluacion | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (id: number, data: UpdateEvaluacionDto) => Promise<boolean>;
    loading?: boolean;
}

export function EvaluationEditModal({
    evaluacion,
    isOpen,
    onClose,
    onSave,
    loading = false,
}: EvaluationEditModalProps) {
    const [formData, setFormData] = useState<UpdateEvaluacionDto>({
        acta_id: undefined,
        criterio_id: undefined,
        nota: undefined,
        observacion: '',
        evaluador_id: undefined,
        trabajo_id: undefined,
        fecha_evaluacion: '',
        nota_final: undefined,
        comentarios: '',
    });
    const [error, setError] = useState<string | null>(null);

    // Cargar datos de la evaluación cuando se abre el modal
    useEffect(() => {
        if (evaluacion && isOpen) {
            setFormData({
                acta_id: evaluacion.acta_id,
                criterio_id: evaluacion.criterio_id,
                nota: evaluacion.nota,
                observacion: evaluacion.observacion || '',
                evaluador_id: evaluacion.evaluador_id,
                trabajo_id: evaluacion.trabajo_id,
                fecha_evaluacion: evaluacion.fecha_evaluacion || '',
                nota_final: evaluacion.nota_final,
                comentarios: evaluacion.comentarios || '',
            });
            setError(null);
        }
    }, [evaluacion, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!evaluacion) return;

        const success = await onSave(evaluacion.id, formData);
        if (success) {
            onClose();
        } else {
            setError('Error al actualizar la evaluación');
        }
    };

    const handleClose = () => {
        setError(null);
        onClose();
    };

    if (!isOpen || !evaluacion) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-academic-200 sticky top-0 bg-white z-10">
                    <h3 className="text-2xl font-bold text-academic-900">
                        Editar Evaluación
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
                                    ID Trabajo
                                </label>
                                <input
                                    type="number"
                                    value={formData.trabajo_id || ''}
                                    onChange={(e) =>
                                        setFormData({ ...formData, trabajo_id: parseInt(e.target.value) || undefined })
                                    }
                                    className="input-elegant"
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-academic-700 mb-2">
                                    ID Evaluador
                                </label>
                                <input
                                    type="number"
                                    value={formData.evaluador_id || ''}
                                    onChange={(e) =>
                                        setFormData({ ...formData, evaluador_id: parseInt(e.target.value) || undefined })
                                    }
                                    className="input-elegant"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-academic-700 mb-2">
                                    ID Acta
                                </label>
                                <input
                                    type="number"
                                    value={formData.acta_id || ''}
                                    onChange={(e) =>
                                        setFormData({ ...formData, acta_id: parseInt(e.target.value) || undefined })
                                    }
                                    className="input-elegant"
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-academic-700 mb-2">
                                    ID Criterio (Principal)
                                </label>
                                <input
                                    type="number"
                                    value={formData.criterio_id || ''}
                                    onChange={(e) =>
                                        setFormData({ ...formData, criterio_id: parseInt(e.target.value) || undefined })
                                    }
                                    className="input-elegant"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-academic-700 mb-2">
                                    Nota (Principal)
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={formData.nota || ''}
                                    onChange={(e) =>
                                        setFormData({ ...formData, nota: e.target.value ? parseFloat(e.target.value) : undefined })
                                    }
                                    className="input-elegant"
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-academic-700 mb-2">
                                    Nota Final
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={formData.nota_final || ''}
                                    onChange={(e) =>
                                        setFormData({ ...formData, nota_final: e.target.value ? parseFloat(e.target.value) : undefined })
                                    }
                                    className="input-elegant"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-academic-700 mb-2">
                                Fecha de Evaluación
                            </label>
                            <input
                                type="date"
                                value={formData.fecha_evaluacion || ''}
                                onChange={(e) =>
                                    setFormData({ ...formData, fecha_evaluacion: e.target.value })
                                }
                                className="input-elegant"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-academic-700 mb-2">
                                Observación
                            </label>
                            <textarea
                                value={formData.observacion || ''}
                                onChange={(e) =>
                                    setFormData({ ...formData, observacion: e.target.value })
                                }
                                className="input-elegant resize-none"
                                rows={3}
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-academic-700 mb-2">
                                Comentarios
                            </label>
                            <textarea
                                value={formData.comentarios || ''}
                                onChange={(e) =>
                                    setFormData({ ...formData, comentarios: e.target.value })
                                }
                                className="input-elegant resize-none"
                                rows={3}
                                disabled={loading}
                            />
                        </div>

                        {/* Sección de Detalles */}
                        {evaluacion && <EvaluationDetailsSection evaluacionId={evaluacion.id} />}

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
