import { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { TipoTrabajo, CreateTipoTrabajoDto, UpdateTipoTrabajoDto } from '../types';

interface WorkTypeEditModalProps {
    tipoTrabajo: TipoTrabajo | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: CreateTipoTrabajoDto | UpdateTipoTrabajoDto) => Promise<boolean>;
    loading?: boolean;
}

export function WorkTypeEditModal({
    tipoTrabajo,
    isOpen,
    onClose,
    onSave,
    loading = false,
}: WorkTypeEditModalProps) {
    const [formData, setFormData] = useState<CreateTipoTrabajoDto>({
        nombre: '',
        descripcion: '',
    });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            if (tipoTrabajo) {
                setFormData({
                    nombre: tipoTrabajo.nombre,
                    descripcion: tipoTrabajo.descripcion || '',
                });
            } else {
                setFormData({
                    nombre: '',
                    descripcion: '',
                });
            }
            setError(null);
        }
    }, [tipoTrabajo, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.nombre.trim()) {
            setError('El nombre es obligatorio');
            return;
        }

        const success = await onSave(formData);
        if (success) {
            onClose();
        } else {
            setError('Error al guardar el tipo de trabajo');
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
                <div className="flex items-center justify-between p-6 border-b border-academic-200">
                    <h3 className="text-2xl font-bold text-academic-900">
                        {tipoTrabajo ? 'Editar Tipo de Trabajo' : 'Nuevo Tipo de Trabajo'}
                    </h3>
                    <button
                        onClick={handleClose}
                        className="text-academic-400 hover:text-academic-600 transition-colors"
                        disabled={loading}
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

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
                                placeholder="Ej: Tesis, Proyecto de Grado"
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
                                placeholder="Descripción del tipo de trabajo..."
                            />
                        </div>

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
