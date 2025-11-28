import { useState } from 'react';
import { Award, Plus, Edit2, Trash2, Search, RefreshCw } from 'lucide-react';
import { useCriterios } from '../hooks/useCriterios';
import { Criterio } from '../types';
import { CriteriaEditModal } from '../components/CriteriaEditModal';
import { CreateCriterioDto, UpdateCriterioDto } from '../services/criterioService';

export default function Criteria() {
    const {
        criterios,
        loading,
        error,
        createCriterio,
        updateCriterio,
        deleteCriterio,
        searchCriterios,
        refresh
    } = useCriterios();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCriterio, setSelectedCriterio] = useState<Criterio | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        searchCriterios(searchTerm);
    };

    const handleCreate = () => {
        setSelectedCriterio(null);
        setIsModalOpen(true);
    };

    const handleEdit = (criterio: Criterio) => {
        setSelectedCriterio(criterio);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este criterio?')) {
            await deleteCriterio(id);
        }
    };

    const handleSave = async (data: CreateCriterioDto | UpdateCriterioDto) => {
        let result;
        if (selectedCriterio) {
            result = await updateCriterio(selectedCriterio.id, data as UpdateCriterioDto);
        } else {
            result = await createCriterio(data as CreateCriterioDto);
        }
        return !!result;
    };

    const formatPonderacion = (ponderacion: number) => {
        if (ponderacion <= 1) {
            return `${(ponderacion * 100).toFixed(0)}%`;
        }
        return `${ponderacion}%`;
    };

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-fade-in-down">
                <div className="flex items-center">
                    <div className="bg-primary-100 p-3 rounded-xl mr-4">
                        <Award className="h-7 w-7 text-primary-600" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-gradient-primary">Criterios de Evaluación</h2>
                        <p className="text-academic-600">Gestiona los criterios y sus ponderaciones</p>
                    </div>
                </div>
                <button
                    onClick={handleCreate}
                    className="btn-primary flex items-center shadow-lg shadow-primary-200/50 hover:shadow-xl hover:shadow-primary-300/50"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Nuevo Criterio
                </button>
            </div>

            {/* Search Bar */}
            <div className="card-elegant mb-8 animate-fade-in-up">
                <form onSubmit={handleSearch} className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-academic-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Buscar criterios..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-elegant pl-12"
                        />
                    </div>
                    <button type="submit" className="btn-secondary">
                        Buscar
                    </button>
                    <button
                        type="button"
                        onClick={refresh}
                        className="p-3 text-academic-500 hover:bg-academic-50 rounded-xl transition-colors"
                        title="Actualizar lista"
                    >
                        <RefreshCw className="h-5 w-5" />
                    </button>
                </form>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center animate-fade-in">
                    <div className="bg-red-100 p-2 rounded-full mr-3">
                        <span className="text-xl">⚠️</span>
                    </div>
                    {error}
                </div>
            )}

            {/* Criteria List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading && criterios.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                        <p className="text-academic-500">Cargando criterios...</p>
                    </div>
                ) : criterios.length === 0 ? (
                    <div className="col-span-full text-center py-12 card-elegant">
                        <Award className="h-16 w-16 text-academic-300 mx-auto mb-4" />
                        <p className="text-academic-500 font-medium">No se encontraron criterios</p>
                    </div>
                ) : (
                    criterios.map((criterio, index) => (
                        <div
                            key={criterio.id}
                            className="card-elegant group hover:border-primary-200 transition-all duration-300 animate-fade-in-up"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-primary-50 text-primary-700 px-3 py-1 rounded-lg text-sm font-bold">
                                    ID: {criterio.id}
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEdit(criterio)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Editar"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(criterio.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Eliminar"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-academic-900 mb-2">
                                {criterio.nombre}
                            </h3>

                            {criterio.descripcion && (
                                <p className="text-academic-600 text-sm mb-4 line-clamp-2">
                                    {criterio.descripcion}
                                </p>
                            )}

                            <div className="mt-auto pt-4 border-t border-academic-100 flex justify-between items-center">
                                <span className="text-sm text-academic-500 font-medium">Ponderación</span>
                                <span className="text-lg font-bold text-primary-600">
                                    {formatPonderacion(criterio.ponderacion)}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <CriteriaEditModal
                criterio={selectedCriterio}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                loading={loading}
            />
        </div>
    );
}
