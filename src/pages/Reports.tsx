import { useState } from 'react';
import { FileCheck, Download } from 'lucide-react';
import { StandardReport } from '../patterns/ReportTemplate';
import { WeightedAverageStrategy } from '../patterns/CalculationStrategy';

export default function Reports() {
  const [workId, setWorkId] = useState('');
  const [generatedReport, setGeneratedReport] = useState('');

  const handleGenerateReport = () => {
    const mockStudent = {
      id: '1',
      name: 'Juan Pérez García',
      email: 'juan.perez@universidad.edu',
      studentId: 'EST-2020-001',
      createdAt: new Date().toISOString(),
    };

    const mockWork = {
      id: workId,
      title: 'Desarrollo de Sistema de Gestión Académica',
      description:
        'Sistema web para la gestión integral de procesos académicos universitarios',
      studentId: '1',
      workType: 'thesis' as const,
      status: 'evaluated' as const,
      createdAt: new Date().toISOString(),
    };

    const mockEvaluators = [
      {
        id: '1',
        name: 'Dr. María López',
        email: 'maria.lopez@universidad.edu',
        specialty: 'Ingeniería de Software',
        role: 'director' as const,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Dr. Carlos Ramírez',
        email: 'carlos.ramirez@universidad.edu',
        specialty: 'Base de Datos',
        role: 'juror' as const,
        createdAt: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Dra. Ana Torres',
        email: 'ana.torres@empresa.com',
        specialty: 'Sistemas de Información',
        role: 'external' as const,
        createdAt: new Date().toISOString(),
      },
    ];

    const mockGrades = [
      {
        id: '1',
        workId: workId,
        evaluatorId: '1',
        criteriaId: '0',
        score: 4.5,
        comments: 'Excelente contenido y fundamentación teórica',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        workId: workId,
        evaluatorId: '1',
        criteriaId: '1',
        score: 4.2,
        comments: 'Metodología bien estructurada',
        createdAt: new Date().toISOString(),
      },
      {
        id: '3',
        workId: workId,
        evaluatorId: '2',
        criteriaId: '0',
        score: 4.7,
        comments: 'Contenido sólido y bien documentado',
        createdAt: new Date().toISOString(),
      },
      {
        id: '4',
        workId: workId,
        evaluatorId: '2',
        criteriaId: '2',
        score: 4.0,
        comments: 'Buena presentación general',
        createdAt: new Date().toISOString(),
      },
      {
        id: '5',
        workId: workId,
        evaluatorId: '3',
        criteriaId: '3',
        score: 4.8,
        comments: 'Excelente defensa y dominio del tema',
        createdAt: new Date().toISOString(),
      },
    ];

    const strategy = new WeightedAverageStrategy();
    const reportGenerator = new StandardReport(strategy);
    const report = reportGenerator.generateReport(mockWork, mockStudent, mockGrades, mockEvaluators);

    setGeneratedReport(report);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedReport], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `acta_trabajo_${workId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <FileCheck className="h-6 w-6 text-blue-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-900">Ver Actas Generadas</h2>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Generar Acta de Evaluación</h3>

          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID del Trabajo
              </label>
              <input
                type="text"
                value={workId}
                onChange={(e) => setWorkId(e.target.value)}
                placeholder="Ingrese el ID del trabajo"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleGenerateReport}
                disabled={!workId}
                className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Generar Acta
              </button>
            </div>
          </div>

          {generatedReport && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-gray-900">Acta Generada</h4>
                <button
                  onClick={handleDownload}
                  className="flex items-center text-sm bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Descargar
                </button>
              </div>
              <div className="bg-gray-50 border border-gray-300 rounded-md p-4 font-mono text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
                {generatedReport}
              </div>
            </div>
          )}

          {!generatedReport && (
            <div className="bg-gray-50 border border-gray-300 rounded-md p-8 text-center text-gray-500">
              Ingrese un ID de trabajo y haga clic en "Generar Acta" para ver el documento
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Información sobre el Sistema de Actas
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li>• Las actas se generan automáticamente usando el patrón Template Method</li>
            <li>• El cálculo de notas utiliza el patrón Strategy con ponderaciones configurables</li>
            <li>• Los criterios de evaluación son parametrizables desde la configuración</li>
            <li>
              • Las notas finales se calculan considerando los pesos de cada criterio de evaluación
            </li>
            <li>• El sistema determina automáticamente el estado de aprobación</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
