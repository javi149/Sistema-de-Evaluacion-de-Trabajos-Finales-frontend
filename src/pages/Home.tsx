import { BookOpen, Users, Award, FileText } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const features = [
    {
      icon: Users,
      title: 'Gestión de Estudiantes',
      description: 'Registra y administra la información de los estudiantes',
      action: 'students',
      color: 'blue',
    },
    {
      icon: FileText,
      title: 'Registro de Trabajos',
      description: 'Crea y gestiona trabajos finales de grado',
      action: 'works',
      color: 'green',
    },
    {
      icon: Award,
      title: 'Panel de Evaluadores',
      description: 'Administra el jurado evaluador',
      action: 'evaluators',
      color: 'purple',
    },
    {
      icon: BookOpen,
      title: 'Sistema de Calificación',
      description: 'Ingresa notas y genera actas automáticas',
      action: 'grades',
      color: 'orange',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; hover: string }> = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', hover: 'hover:bg-blue-50' },
      green: { bg: 'bg-green-100', text: 'text-green-600', hover: 'hover:bg-green-50' },
      purple: { bg: 'bg-violet-100', text: 'text-violet-600', hover: 'hover:bg-violet-50' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-600', hover: 'hover:bg-orange-50' },
    };
    return colors[color];
  };

  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Sistema de Evaluación de Trabajos Finales
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Plataforma integral para la gestión, evaluación y generación de actas de trabajos de
          grado
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          const colors = getColorClasses(feature.color);
          return (
            <div
              key={feature.action}
              onClick={() => onNavigate(feature.action)}
              className="bg-white rounded-lg shadow-sm p-6 cursor-pointer transition-all hover:shadow-md"
            >
              <div className={`${colors.bg} ${colors.hover} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <Icon className={`h-6 w-6 ${colors.text}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Características del Sistema</h3>
        <ul className="space-y-2 text-blue-800">
          <li>• Configuración parametrizable de criterios de evaluación</li>
          <li>• Cálculo automático de notas con ponderaciones</li>
          <li>• Generación automática de actas oficiales</li>
          <li>• Gestión completa de estudiantes, trabajos y evaluadores</li>
          <li>• Integración con API backend Flask</li>
        </ul>
      </div>
    </div>
  );
}
