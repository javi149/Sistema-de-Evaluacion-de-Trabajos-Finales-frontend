import { useState } from 'react';
import { Briefcase, Plus, Edit2, Trash2, RefreshCw } from 'lucide-react';
import { useTiposTrabajo } from '../hooks/useTiposTrabajo';
import { TipoTrabajo, CreateTipoTrabajoDto, UpdateTipoTrabajoDto } from '../types';
import { WorkTypeEditModal } from '../components/WorkTypeEditModal';

export default function WorkTypes() {
    const {
        tiposTrabajo,
        loading,
        error,
        createTipoTrabajo,
        updateTipoTrabajo,
        deleteTipoTrabajo,
        refresh
    } = useTiposTrabajo();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTipo, setSelectedTipo] = useState<TipoTrabajo | null>(null);

    const handleCreate = () => {
        setSelectedTipo(null);
        setIsModalOpen(true);
    };

    const handleEdit = (tipo: TipoTrabajo) => {
        setSelectedTipo(tipo);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este tipo de trabajo?')) {
            await deleteTipoTrabajo(id);
        }
    };

    const handleSave = async (data: CreateTipoTrabajoDto | UpdateTipoTrabajoDto) => {
        let result;
        if (selectedTipo) {
            result = await updateTipoTrabajo(selectedTipo.id, data as UpdateTipoTrabajoDto);
        } else {
            result = await createTipoTrabajo(data as CreateTipoTrabajoDto);
        }
        return !!result;
    };

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-fade-in-down">
                <div className="flex items-center">
                    <div className="bg-accent-100 p-3 rounded-xl mr-4">
                        <Briefcase className="h-7 w-7 text-accent-600" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-gradient-accent">Tipos de Trabajo</h2>
                        <p className="text-academic-600">Gestiona los tipos de trabajos finales disponibles</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={refresh}
                        className="p-3 text-academic-500 hover:bg-academic-50 rounded-xl transition-colors"
                        title="Actualizar lista"
                    >
                        <RefreshCw className="h-5 w-5" />
                    </button>
                    <button
                        onClick={handleCreate}
                        className="btn-accent flex items-center shadow-lg shadow-accent-200/50 hover:shadow-xl hover:shadow-accent-300/50"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Nuevo Tipo
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center animate-fade-in">
                    <div className="bg-red-100 p-2 rounded-full mr-3">
                        <span className="text-xl">⚠️</span>
                    </div>
                    {error}
                </div>
            )}

            <div className="card-elegant overflow-hidden">
                {loading && tiposTrabajo.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600 mx-auto mb-4"></div>
                        <p className="text-academic-500">Cargando tipos de trabajo...</p>
                    </div>
                ) : tiposTrabajo.length === 0 ? (
                    <div className="text-center py-12">
                        <Briefcase className="h-16 w-16 text-academic-300 mx-auto mb-4" />
                        <p className="text-academic-500 font-medium">No se encontraron tipos de trabajo</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-academic-50 border-b border-academic-200">
                                <tr>
                                    {/* <th className="px-6 py-4 text-left text-xs font-semibold text-academic-700 uppercase tracking-wider">ID</th> */}
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-academic-700 uppercase tracking-wider">Nombre</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-academic-700 uppercase tracking-wider">Descripción</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-academic-700 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-academic-100">
                                {tiposTrabajo.map((tipo, index) => (
                                    <tr
                                        key={tipo.id}
                                        className="hover:bg-accent-50/50 transition-colors animate-fade-in-up"
                                        style={{ animationDelay: `${index * 30}ms` }}
                                    >
                                        {/* <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold bg-accent-100 text-accent-700">
                                                {tipo.id}
                                            </span>
                                        </td> */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-academic-900">
                                                {tipo.nombre}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-academic-600">
                                            <div className="max-w-2xl line-clamp-2">
                                                {tipo.descripcion || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(tipo)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(tipo.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <WorkTypeEditModal
                tipoTrabajo={selectedTipo}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                loading={loading}
            />
        </div>
    );
}
