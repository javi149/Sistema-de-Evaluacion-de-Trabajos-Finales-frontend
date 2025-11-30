import { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { Criterio } from '../types';
import { CreateCriterioDto, UpdateCriterioDto } from '../services/criterioService';

interface CriteriaEditModalProps {
    criterio: Criterio | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: CreateCriterioDto | UpdateCriterioDto) => Promise<boolean>;
    loading?: boolean;
}

export function CriteriaEditModal({
    criterio,
    isOpen,
    onClose,
    onSave,
    loading = false,
}: CriteriaEditModalProps) {
    const [formData, setFormData] = useState<CreateCriterioDto>({
        nombre: '',
        descripcion: '',
        ponderacion: 0,
    });
    const [error, setError] = useState<string | null>(null);

    // Cargar datos del criterio cuando se abre el modal
    useEffect(() => {
        if (isOpen) {
            if (criterio) {
                setFormData({
                    nombre: criterio.nombre,
                    descripcion: criterio.descripcion || '',
                    ponderacion: criterio.ponderacion,
                });
            } else {
                setFormData({
                    nombre: '',
                    descripcion: '',
                    ponderacion: 0,
                });
            }
            setError(null);
        }
    }, [criterio, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validar ponderación
        if (formData.ponderacion < 0) {
            setError('La ponderación no puede ser negativa');
            return;
        }

        const success = await onSave(formData);
        if (success) {
            onClose();
        } else {
            setError('Error al guardar el criterio');
        }
    };

    const handleClose = () => {
        setError(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-academic-200">
                    <h3 className="text-2xl font-bold text-academic-900">
                        {criterio ? 'Editar Criterio' : 'Nuevo Criterio'}
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
                        <div>
                            <label className="block text-sm font-semibold text-academic-700 mb-2">
                                Nombre
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
                                placeholder="Ej: Calidad del Código"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-academic-700 mb-2">
                                Descripción
                            </label>
                            <textarea
                                value={formData.descripcion || ''}
                                onChange={(e) =>
                                    setFormData({ ...formData, descripcion: e.target.value })
                                }
                                className="input-elegant resize-none"
                                rows={3}
                                disabled={loading}
                                placeholder="Descripción detallada del criterio..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-academic-700 mb-2">
                                Ponderación (0.0 - 1.0 o %)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.ponderacion}
                                onChange={(e) =>
                                    setFormData({ ...formData, ponderacion: parseFloat(e.target.value) || 0 })
                                }
                                className="input-elegant"
                                required
                                disabled={loading}
                            />
                            <p className="text-xs text-academic-500 mt-1">
                                Ingrese el valor decimal (ej: 0.4 para 40%) o el porcentaje directo.
                            </p>
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
                                {loading ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
