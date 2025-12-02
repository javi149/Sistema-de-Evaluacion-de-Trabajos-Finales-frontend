import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, X } from 'lucide-react';
import { EvaluacionDetalle, Criterio } from '../types';
import { useEvaluationDetails } from '../hooks/useEvaluationDetails';
import { useCriterios } from '../hooks/useCriterios';

interface EvaluationDetailsSectionProps {
    evaluacionId: number;
}

export function EvaluationDetailsSection({ evaluacionId }: EvaluationDetailsSectionProps) {
    const {
        detalles,
        loading: detailsLoading,
        error: detailsError,
        getDetailsByEvaluacionId,
        createDetail,
        deleteDetail,
        updateDetail
    } = useEvaluationDetails();

    const { criterios, loading: criteriosLoading } = useCriterios();

    const [isAdding, setIsAdding] = useState(false);
    const [newDetail, setNewDetail] = useState({
        criterio_id: '',
        nota: '',
        observacion: ''
    });

    useEffect(() => {
        if (evaluacionId) {
            getDetailsByEvaluacionId(evaluacionId);
        }
    }, [evaluacionId, getDetailsByEvaluacionId]);

    const handleAddDetail = async () => {
        if (!newDetail.criterio_id || !newDetail.nota) return;

        const result = await createDetail({
            evaluacion_id: evaluacionId,
            criterio_id: parseInt(newDetail.criterio_id),
            nota: parseFloat(newDetail.nota),
            observacion: newDetail.observacion
        });

        if (result) {
            setIsAdding(false);
            setNewDetail({ criterio_id: '', nota: '', observacion: '' });
        }
    };

    const handleDeleteDetail = async (id: number) => {
        if (window.confirm('¿Eliminar este detalle?')) {
            await deleteDetail(id);
        }
    };

    const getCriterioName = (id: number) => {
        return criterios.find(c => c.id === id)?.nombre || 'Desconocido';
    };

    return (
        <div className="mt-8 border-t border-academic-200 pt-6">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-academic-900">Detalles de Evaluación</h4>
                <button
                    type="button"
                    onClick={() => setIsAdding(true)}
                    className="flex items-center text-sm text-primary-600 hover:text-primary-700 font-semibold"
                    disabled={isAdding}
                >
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar Criterio
                </button>
            </div>

            {detailsError && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg">
                    {detailsError}
                </div>
            )}

            <div className="space-y-3">
                {/* Lista de detalles existentes */}
                {detalles.map((detalle) => (
                    <div key={detalle.id} className="flex items-center justify-between p-3 bg-academic-50 rounded-lg border border-academic-100">
                        <div>
                            <p className="font-semibold text-academic-800">
                                {getCriterioName(detalle.criterio_id)}
                            </p>
                            {detalle.observacion && (
                                <p className="text-xs text-academic-600">{detalle.observacion}</p>
                            )}
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="font-bold text-academic-900 bg-white px-3 py-1 rounded shadow-sm">
                                {detalle.nota}
                            </span>
                            <button
                                type="button"
                                onClick={() => handleDeleteDetail(detalle.id)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}

                {/* Formulario para agregar nuevo detalle */}
                {isAdding && (
                    <div className="p-4 bg-white border-2 border-primary-100 rounded-xl shadow-sm animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                            <select
                                value={newDetail.criterio_id}
                                onChange={(e) => setNewDetail({ ...newDetail, criterio_id: e.target.value })}
                                className="input-elegant text-sm py-2"
                                disabled={criteriosLoading}
                            >
                                <option value="">Seleccionar Criterio</option>
                                {criterios.map(c => (
                                    <option key={c.id} value={c.id}>{c.nombre}</option>
                                ))}
                            </select>
                            <input
                                type="number"
                                placeholder="Nota"
                                value={newDetail.nota}
                                onChange={(e) => setNewDetail({ ...newDetail, nota: e.target.value })}
                                className="input-elegant text-sm py-2"
                                step="0.1"
                                min="1"
                                max="7"
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="Observación (opcional)"
                            value={newDetail.observacion}
                            onChange={(e) => setNewDetail({ ...newDetail, observacion: e.target.value })}
                            className="input-elegant text-sm py-2 mb-3"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setIsAdding(false)}
                                className="p-2 text-academic-500 hover:bg-academic-50 rounded-lg"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={handleAddDetail}
                                className="flex items-center px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium"
                            >
                                <Save className="h-4 w-4 mr-1.5" />
                                Guardar
                            </button>
                        </div>
                    </div>
                )}

                {!detailsLoading && detalles.length === 0 && !isAdding && (
                    <p className="text-center text-academic-400 text-sm py-4">
                        No hay detalles registrados para esta evaluación.
                    </p>
                )}
            </div>
        </div>
    );
}
