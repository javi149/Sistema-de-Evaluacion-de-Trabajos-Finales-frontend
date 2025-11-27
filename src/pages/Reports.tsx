import { useState } from 'react';
import { FileCheck, Download, Info } from 'lucide-react';
import { StandardReport } from '../patterns/ReportTemplate';
import { WeightedAverageStrategy } from '../patterns/CalculationStrategy';
import { useCriterios } from '../hooks';

export default function Reports() {
  const [workId, setWorkId] = useState('');
  const [generatedReport, setGeneratedReport] = useState('');
  const { criterios, loading: criteriosLoading } = useCriterios();

  const handleGenerateReport = () => {
    const mockStudent = {
      id: 1,
      nombre: 'Juan Pérez García',
      apellido: 'Pérez García',
      rut: '12345678-9',
      carrera: 'Ingeniería de Software',
      email: 'juan.perez@universidad.edu',
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
        id: 1,
        nombre: 'Dr. María López',
        email: 'maria.lopez@universidad.edu',
        tipo: 'Profesor Guía',
        rol: 'Supervisor',
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        nombre: 'Dr. Carlos Ramírez',
        email: 'carlos.ramirez@universidad.edu',
        tipo: 'Comisión Evaluadora',
        rol: 'Evaluador',
        createdAt: new Date().toISOString(),
      },
      {
        id: 3,
        nombre: 'Dra. Ana Torres',
        email: 'ana.torres@empresa.com',
        tipo: 'Profesor Informante',
        rol: 'Revisor',
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
    const report = reportGenerator.generateReport(
      mockWork,
      mockStudent,
      mockGrades,
      mockEvaluators,
      criterios
    );

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
    <div className="animate-fade-in">
      <div className="flex items-center mb-8 animate-fade-in-down">
        <div className="bg-primary-100 p-3 rounded-xl mr-4">
          <FileCheck className="h-7 w-7 text-primary-600" />
        </div>
        <h2 className="text-3xl font-bold text-gradient-primary">Ver Actas Generadas</h2>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="card-elegant animate-fade-in-up">
          <h3 className="text-xl font-bold text-academic-900 mb-6 flex items-center">
            <FileCheck className="h-5 w-5 mr-2 text-primary-600" />
            Generar Acta de Evaluación
          </h3>

          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-academic-700 mb-2">
                ID del Trabajo
              </label>
              <input
                type="text"
                value={workId}
                onChange={(e) => setWorkId(e.target.value)}
                placeholder="Ingrese el ID del trabajo"
                className="input-elegant"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleGenerateReport}
                disabled={!workId || criteriosLoading || criterios.length === 0}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {criteriosLoading ? 'Cargando criterios...' : 'Generar Acta'}
              </button>
            </div>
            {criterios.length === 0 && !criteriosLoading && (
              <p className="text-sm text-red-600 mt-2">
                No hay criterios disponibles. Por favor, agregue criterios primero.
              </p>
            )}
          </div>

          {generatedReport && (
            <div className="animate-fade-in-up">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-academic-900 text-lg">Acta Generada</h4>
                <button
                  onClick={handleDownload}
                  className="btn-accent flex items-center"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Descargar
                </button>
              </div>
              <div className="bg-gradient-to-br from-academic-50 to-primary-50/30 border-2 border-academic-200/50 rounded-xl p-6 font-mono text-sm whitespace-pre-wrap max-h-96 overflow-y-auto shadow-inner">
                {generatedReport}
              </div>
            </div>
          )}

          {!generatedReport && (
            <div className="bg-gradient-to-br from-academic-50 to-primary-50/30 border-2 border-academic-200/50 rounded-xl p-12 text-center animate-fade-in">
              <FileCheck className="h-16 w-16 text-academic-300 mx-auto mb-4" />
              <p className="text-academic-600 font-medium">
                Ingrese un ID de trabajo y haga clic en "Generar Acta" para ver el documento
              </p>
            </div>
          )}
        </div>

        <div className="glass-effect rounded-2xl p-8 border border-academic-200/40 shadow-xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-xl font-bold text-gradient-primary mb-6 flex items-center">
            <Info className="h-6 w-6 mr-3 text-primary-600" />
            Información sobre el Sistema de Actas
          </h3>
          <ul className="space-y-4 text-academic-700">
            <li className="flex items-start animate-slide-in-right" style={{ animationDelay: '0.3s' }}>
              <span className="text-primary-600 mr-3 font-bold">•</span>
              <span>Las actas se generan automáticamente usando el patrón Template Method</span>
            </li>
            <li className="flex items-start animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
              <span className="text-accent-600 mr-3 font-bold">•</span>
              <span>El cálculo de notas utiliza el patrón Strategy con ponderaciones configurables</span>
            </li>
            <li className="flex items-start animate-slide-in-right" style={{ animationDelay: '0.5s' }}>
              <span className="text-secondary-600 mr-3 font-bold">•</span>
              <span>Los criterios de evaluación se obtienen desde la base de datos</span>
            </li>
            <li className="flex items-start animate-slide-in-right" style={{ animationDelay: '0.6s' }}>
              <span className="text-tertiary-600 mr-3 font-bold">•</span>
              <span>Las notas finales se calculan considerando los pesos de cada criterio de evaluación</span>
            </li>
            <li className="flex items-start animate-slide-in-right" style={{ animationDelay: '0.7s' }}>
              <span className="text-primary-600 mr-3 font-bold">•</span>
              <span>El sistema determina automáticamente el estado de aprobación</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
