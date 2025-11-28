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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading && tiposTrabajo.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600 mx-auto mb-4"></div>
                        <p className="text-academic-500">Cargando tipos de trabajo...</p>
                    </div>
                ) : tiposTrabajo.length === 0 ? (
                    <div className="col-span-full text-center py-12 card-elegant">
                        <Briefcase className="h-16 w-16 text-academic-300 mx-auto mb-4" />
                        <p className="text-academic-500 font-medium">No se encontraron tipos de trabajo</p>
                    </div>
                ) : (
                    tiposTrabajo.map((tipo, index) => (
                        <div
                            key={tipo.id}
                            className="card-elegant group hover:border-accent-200 transition-all duration-300 animate-fade-in-up"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-accent-50 text-accent-700 px-3 py-1 rounded-lg text-sm font-bold">
                                    ID: {tipo.id}
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
                            </div>

                            <h3 className="text-xl font-bold text-academic-900 mb-2">
                                {tipo.nombre}
                            </h3>

                            {tipo.descripcion && (
                                <p className="text-academic-600 text-sm line-clamp-3">
                                    {tipo.descripcion}
                                </p>
                            )}
                        </div>
                    ))
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
