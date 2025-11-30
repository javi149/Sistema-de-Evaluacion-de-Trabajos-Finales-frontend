import { useState } from 'react';
import { FileCheck, Download, Eye, RefreshCw, Search, FileText } from 'lucide-react';
import { useActas } from '../hooks/useActas';
import { useTrabajos } from '../hooks/useTrabajos';

export default function Reports() {
  const {
    actas,
    loading: actasLoading,
    error: actasError,
    generateActaHtml,
    generateActaText,
    downloadActaPdf,
    refresh: refreshActas
  } = useActas();

  const { trabajos, loading: trabajosLoading } = useTrabajos();

  const isLoading = actasLoading || trabajosLoading;

  const [selectedTrabajoId, setSelectedTrabajoId] = useState<string>('');
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'generate'>('list');

  const handleGenerateHtml = async () => {
    if (!selectedTrabajoId) return;
    const html = await generateActaHtml(Number(selectedTrabajoId));
    if (html) {
      setGeneratedHtml(html);
    }
  };

  const handleDownloadText = async (trabajoId: number) => {
    const text = await generateActaText(trabajoId);
    if (text) {
      const element = document.createElement('a');
      const file = new Blob([text], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `acta_trabajo_${trabajoId}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const handleDownloadPdf = async (trabajoId: number) => {
    await downloadActaPdf(trabajoId);
  };

  const getTrabajoTitle = (id: number) => {
    const trabajo = trabajos.find(t => t.id === id);
    return trabajo ? trabajo.titulo : `Trabajo ID: ${id}`;
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-fade-in-down">
        <div className="flex items-center">
          <div className="bg-primary-100 p-3 rounded-xl mr-4">
            <FileCheck className="h-7 w-7 text-primary-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gradient-primary">Actas y Reportes</h2>
            <p className="text-academic-600">Genera y descarga las actas de evaluación final</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={refreshActas}
            className="p-3 text-academic-500 hover:bg-academic-50 rounded-xl transition-colors"
            title="Actualizar lista"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-academic-200">
        <button
          className={`pb-2 px-4 font-medium transition-colors ${viewMode === 'list'
            ? 'text-primary-600 border-b-2 border-primary-600'
            : 'text-academic-500 hover:text-academic-700'
            }`}
          onClick={() => setViewMode('list')}
        >
          Historial de Actas
        </button>
        <button
          className={`pb-2 px-4 font-medium transition-colors ${viewMode === 'generate'
            ? 'text-primary-600 border-b-2 border-primary-600'
            : 'text-academic-500 hover:text-academic-700'
            }`}
          onClick={() => setViewMode('generate')}
        >
          Generar Nueva Acta
        </button>
      </div>

      {actasError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center animate-fade-in">
          <div className="bg-red-100 p-2 rounded-full mr-3">
            <span className="text-xl">⚠️</span>
          </div>
          {actasError}
        </div>
      )}

      {viewMode === 'list' ? (
        <div className="card-elegant overflow-hidden animate-fade-in-up">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary-50 border-b border-primary-200">
                <tr>
                  {/* <th className="px-6 py-4 text-left text-xs font-semibold text-primary-800 uppercase tracking-wider">
                    ID
                  </th> */}
                  <th className="px-6 py-4 text-left text-xs font-semibold text-primary-800 uppercase tracking-wider">
                    Título del Trabajo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-primary-800 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-primary-800 uppercase tracking-wider">
                    Nota Final
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-primary-800 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-primary-800 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-academic-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-academic-500">
                      <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-2"></div>
                        <p>Cargando actas...</p>
                      </div>
                    </td>
                  </tr>
                ) : actas.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-academic-500">
                      <div className="flex flex-col items-center justify-center">
                        <FileCheck className="h-12 w-12 text-academic-300 mb-2" />
                        <p>No se encontraron actas generadas</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  actas.map((acta, index) => (
                    <tr
                      key={acta.id}
                      className="hover:bg-primary-50/50 transition-colors animate-fade-in-up"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      {/* <td className="px-6 py-4 whitespace-nowrap">
                        <span className="bg-primary-50 text-primary-700 px-2 py-1 rounded-lg text-xs font-bold">
                          #{acta.id}
                        </span>
                      </td> */}
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-academic-900 line-clamp-2" title={acta.titulo || getTrabajoTitle(acta.trabajo_id as number)}>
                          {acta.titulo || getTrabajoTitle(acta.trabajo_id as number)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-academic-600">
                        {acta.fecha ? new Date(acta.fecha).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-bold text-primary-600 text-lg">
                          {acta.calificacion_final}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${acta.estado === 'Aprobado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {acta.estado || 'Generada'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleDownloadPdf(acta.trabajo_id as number)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Descargar PDF"
                          >
                            <FileText className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDownloadText(acta.trabajo_id as number)}
                            className="p-2 text-academic-600 hover:bg-academic-100 rounded-lg transition-colors"
                            title="Descargar Texto"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedTrabajoId(String(acta.trabajo_id));
                              setViewMode('generate');
                              handleGenerateHtml();
                            }}
                            className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="Ver HTML"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="card-elegant">
              <h3 className="text-lg font-bold text-academic-900 mb-4">Seleccionar Trabajo</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-academic-700 mb-2">
                    Trabajo a Evaluar
                  </label>
                  <select
                    value={selectedTrabajoId}
                    onChange={(e) => setSelectedTrabajoId(e.target.value)}
                    className="input-elegant"
                    disabled={actasLoading || trabajosLoading}
                  >
                    <option value="">Seleccione un trabajo...</option>
                    {trabajos.map((trabajo) => (
                      <option key={trabajo.id} value={trabajo.id}>
                        {trabajo.titulo} (ID: {trabajo.id})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleGenerateHtml}
                  disabled={!selectedTrabajoId || actasLoading}
                  className="btn-primary w-full flex justify-center items-center"
                >
                  {actasLoading ? (
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  ) : (
                    <FileText className="h-5 w-5 mr-2" />
                  )}
                  Generar Vista Previa
                </button>

                <button
                  onClick={() => selectedTrabajoId && handleDownloadText(Number(selectedTrabajoId))}
                  disabled={!selectedTrabajoId || actasLoading}
                  className="btn-secondary w-full flex justify-center items-center"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Descargar Texto
                </button>

                <button
                  onClick={() => selectedTrabajoId && handleDownloadPdf(Number(selectedTrabajoId))}
                  disabled={!selectedTrabajoId || actasLoading}
                  className="btn-secondary w-full flex justify-center items-center text-red-700 border-red-200 hover:bg-red-50"
                >
                  <FileText className="h-5 w-5 mr-2" />
                  Descargar PDF
                </button>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800">
              <p className="font-semibold mb-2">Nota:</p>
              <p>Al generar el acta, el sistema calculará automáticamente la nota final basándose en las evaluaciones registradas y los criterios vigentes.</p>
            </div>
          </div>

          <div className="lg:col-span-2">
            {generatedHtml ? (
              <div className="card-elegant h-full min-h-[500px] flex flex-col">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-academic-100">
                  <h3 className="font-bold text-academic-900">Vista Previa del Acta</h3>
                  <button
                    onClick={() => setGeneratedHtml(null)}
                    className="text-sm text-academic-500 hover:text-academic-700"
                  >
                    Limpiar
                  </button>
                </div>
                <div
                  className="prose max-w-none flex-1 overflow-auto p-4 bg-white border border-gray-200 rounded-lg shadow-inner"
                  dangerouslySetInnerHTML={{ __html: generatedHtml }}
                />
              </div>
            ) : (
              <div className="card-elegant h-full min-h-[400px] flex flex-col items-center justify-center text-academic-400">
                <FileText className="h-16 w-16 mb-4 opacity-50" />
                <p>Seleccione un trabajo y genere una vista previa para ver el acta aquí.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
