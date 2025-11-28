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
    refresh: refreshActas
  } = useActas();

  const { trabajos, loading: trabajosLoading } = useTrabajos();

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {actasLoading && actas.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-academic-500">Cargando actas...</p>
            </div>
          ) : actas.length === 0 ? (
            <div className="col-span-full text-center py-12 card-elegant">
              <FileCheck className="h-16 w-16 text-academic-300 mx-auto mb-4" />
              <p className="text-academic-500 font-medium">No se encontraron actas generadas</p>
            </div>
          ) : (
            actas.map((acta, index) => (
              <div
                key={acta.id}
                className="card-elegant group hover:border-primary-200 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-primary-50 text-primary-700 px-3 py-1 rounded-lg text-sm font-bold">
                    ID: {acta.id}
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${acta.estado === 'Aprobado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {acta.estado || 'Generada'}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-academic-900 mb-2 line-clamp-2">
                  {acta.titulo || getTrabajoTitle(acta.trabajo_id as number)}
                </h3>

                <div className="text-sm text-academic-600 mb-4 space-y-1">
                  <p>Fecha: {acta.fecha ? new Date(acta.fecha).toLocaleDateString() : 'N/A'}</p>
                  <p>Nota Final: <span className="font-bold text-primary-600">{acta.calificacion_final}</span></p>
                </div>

                <div className="mt-auto pt-4 border-t border-academic-100 flex gap-2">
                  <button
                    onClick={() => handleDownloadText(acta.trabajo_id as number)}
                    className="flex-1 btn-secondary text-sm py-2 flex justify-center items-center"
                    title="Descargar Texto"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Texto
                  </button>
                  {/* Si tuviéramos un endpoint para ver el HTML guardado, lo usaríamos aquí. 
                      Por ahora usamos el de generar HTML al vuelo */}
                  <button
                    onClick={() => {
                      setSelectedTrabajoId(String(acta.trabajo_id));
                      setViewMode('generate');
                      handleGenerateHtml(); // Esto regenerará el HTML
                    }}
                    className="flex-1 btn-primary text-sm py-2 flex justify-center items-center"
                    title="Ver HTML"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver
                  </button>
                </div>
              </div>
            ))
          )}
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
