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
            <div className="card-elegant overflow-hidden">
                {loading && criterios.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                        <p className="text-academic-500">Cargando criterios...</p>
                    </div>
                ) : criterios.length === 0 ? (
                    <div className="text-center py-12">
                        <Award className="h-16 w-16 text-academic-300 mx-auto mb-4" />
                        <p className="text-academic-500 font-medium">No se encontraron criterios</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-academic-50 border-b border-academic-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-academic-700 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-academic-700 uppercase tracking-wider">Nombre</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-academic-700 uppercase tracking-wider">Descripción</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-academic-700 uppercase tracking-wider">Ponderación</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-academic-700 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-academic-100">
                                {criterios.map((criterio, index) => (
                                    <tr
                                        key={criterio.id}
                                        className="hover:bg-primary-50/50 transition-colors animate-fade-in-up"
                                        style={{ animationDelay: `${index * 30}ms` }}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold bg-primary-100 text-primary-700">
                                                {criterio.id}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-academic-900">
                                                {criterio.nombre}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-academic-600">
                                            <div className="max-w-md line-clamp-2">
                                                {criterio.descripcion || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-bold bg-primary-50 text-primary-700">
                                                {formatPonderacion(criterio.ponderacion)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
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
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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
