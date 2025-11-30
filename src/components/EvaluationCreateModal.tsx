import { useState } from 'react';
import { X, Save, AlertCircle, Award } from 'lucide-react';
import { CreateEvaluacionDto } from '../services/evaluationService';
import { useCriterios } from '../hooks/useCriterios';

interface EvaluationCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: CreateEvaluacionDto) => Promise<boolean>;
    loading?: boolean;
}

export function EvaluationCreateModal({
    isOpen,
    onClose,
    onSave,
    loading = false,
}: EvaluationCreateModalProps) {
    const { criterios, loading: criteriosLoading } = useCriterios();

    const [formData, setFormData] = useState({
        trabajo_id: '',
        evaluador_id: '',
        criterio_id: '',
        nota: '',
        observacion: '',
    });
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const newEvaluacion: CreateEvaluacionDto = {
            trabajo_id: parseInt(formData.trabajo_id),
            evaluador_id: parseInt(formData.evaluador_id),
            criterio_id: parseInt(formData.criterio_id),
            nota: parseFloat(formData.nota),
            observacion: formData.observacion,
            fecha_evaluacion: new Date().toISOString().split('T')[0],
        };

        const success = await onSave(newEvaluacion);
        if (success) {
            // Reset form
            setFormData({
                trabajo_id: '',
                evaluador_id: '',
                criterio_id: '',
                nota: '',
                observacion: '',
            });
            onClose();
        } else {
            setError('Error al crear la evaluación');
        }
    };

    const handleClose = () => {
        setError(null);
        setFormData({
            trabajo_id: '',
            evaluador_id: '',
            criterio_id: '',
            nota: '',
            observacion: '',
        });
        onClose();
    };

    const formatPonderacion = (ponderacion: number): string => {
        if (ponderacion > 1) {
            return `${ponderacion.toFixed(2)}%`;
        } else {
            return `${(ponderacion * 100).toFixed(2)}%`;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] animate-fade-in p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col animate-slide-up">
                {/* Header - Fixed */}
                <div className="flex items-center justify-between p-6 border-b border-academic-200 flex-shrink-0">
                    <h3 className="text-2xl font-bold text-academic-900">
                        Nueva Evaluación
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

                    {/* Criterios Info */}
                    <div className="mb-6 p-5 bg-gradient-to-r from-primary-50 to-primary-100/50 rounded-xl border-2 border-primary-200/50">
                        <h4 className="font-bold text-primary-900 mb-3 flex items-center">
                            <Award className="h-5 w-5 mr-2 text-primary-600" />
                            Criterios de Evaluación Disponibles
                        </h4>
                        {criteriosLoading ? (
                            <p className="text-sm text-primary-700">Cargando criterios...</p>
                        ) : criterios.length === 0 ? (
                            <p className="text-sm text-primary-700">No hay criterios disponibles</p>
                        ) : (
                            <ul className="space-y-2 text-sm text-primary-800 max-h-40 overflow-y-auto">
                                {criterios.map((criterio) => (
                                    <li key={criterio.id} className="flex items-start">
                                        <span className="text-primary-600 mr-2 font-bold">•</span>
                                        <span>
                                            <span className="font-semibold">{criterio.nombre}</span>
                                            {criterio.descripcion && (
                                                <span className="text-primary-600 ml-2">- {criterio.descripcion}</span>
                                            )}
                                            <span className="block text-xs text-primary-600 mt-1">
                                                Ponderación: {formatPonderacion(criterio.ponderacion)}
                                            </span>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-academic-700 mb-2">
                                    ID del Trabajo
                                </label>
                                <input
                                    type="number"
                                    value={formData.trabajo_id}
                                    onChange={(e) => setFormData({ ...formData, trabajo_id: e.target.value })}
                                    className="input-elegant"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-academic-700 mb-2">
                                    ID del Evaluador
                                </label>
                                <input
                                    type="number"
                                    value={formData.evaluador_id}
                                    onChange={(e) => setFormData({ ...formData, evaluador_id: e.target.value })}
                                    className="input-elegant"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-academic-700 mb-2">
                                Criterio
                            </label>
                            <select
                                value={formData.criterio_id}
                                onChange={(e) => setFormData({ ...formData, criterio_id: e.target.value })}
                                className="input-elegant"
                                required
                                disabled={criteriosLoading || criterios.length === 0 || loading}
                            >
                                <option value="">Seleccione un criterio</option>
                                {criterios.map((criterio) => (
                                    <option key={criterio.id} value={criterio.id.toString()}>
                                        {criterio.nombre} (Ponderación: {formatPonderacion(criterio.ponderacion)})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-academic-700 mb-2">
                                Nota (1.0 - 7.0)
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="7"
                                step="0.1"
                                value={formData.nota}
                                onChange={(e) => setFormData({ ...formData, nota: e.target.value })}
                                className="input-elegant"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-academic-700 mb-2">
                                Observación (Opcional)
                            </label>
                            <textarea
                                value={formData.observacion}
                                onChange={(e) => setFormData({ ...formData, observacion: e.target.value })}
                                className="input-elegant resize-none"
                                rows={3}
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
                        className="bg-gradient-to-r from-tertiary-600 to-tertiary-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg shadow-tertiary-200/50 hover:shadow-xl hover:shadow-tertiary-300/50 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        <Save className="h-5 w-5 mr-2" />
                        {loading ? 'Guardando...' : 'Crear Evaluación'}
                    </button>
                </div>
            </div>
        </div>
    );
}
