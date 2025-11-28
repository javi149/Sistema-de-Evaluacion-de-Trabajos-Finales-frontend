import { BookOpen, Users, Award, FileText, Briefcase } from 'lucide-react';

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
      gradient: 'from-primary-500 to-primary-600',
      bgGradient: 'from-primary-50 to-primary-100/50',
      iconBg: 'bg-primary-100',
      iconColor: 'text-primary-600',
    },
    {
      icon: FileText,
      title: 'Registro de Trabajos',
      description: 'Crea y gestiona trabajos finales de grado',
      action: 'works',
      gradient: 'from-accent-500 to-accent-600',
      bgGradient: 'from-accent-50 to-accent-100/50',
      iconBg: 'bg-accent-100',
      iconColor: 'text-accent-600',
    },
    {
      icon: Award,
      title: 'Panel de Evaluadores',
      description: 'Administra el jurado evaluador',
      action: 'evaluators',
      gradient: 'from-secondary-500 to-secondary-600',
      bgGradient: 'from-secondary-50 to-secondary-100/50',
      iconBg: 'bg-secondary-100',
      iconColor: 'text-secondary-600',
    },
    {
      icon: BookOpen,
      title: 'Sistema de Calificación',
      description: 'Ingresa notas y genera actas automáticas',
      action: 'grades',
      gradient: 'from-tertiary-500 to-tertiary-600',
      bgGradient: 'from-tertiary-50 to-tertiary-100/50',
      iconBg: 'bg-tertiary-100',
      iconColor: 'text-tertiary-600',
    },
    {
      icon: FileText,
      title: 'Actas y Reportes',
      description: 'Visualiza y descarga las actas de evaluación',
      action: 'reports',
      gradient: 'from-primary-500 to-primary-600',
      bgGradient: 'from-primary-50 to-primary-100/50',
      iconBg: 'bg-primary-100',
      iconColor: 'text-primary-600',
    },
    {
      icon: Award,
      title: 'Criterios de Evaluación',
      description: 'Define y gestiona los criterios y ponderaciones',
      action: 'criteria',
      gradient: 'from-accent-500 to-accent-600',
      bgGradient: 'from-accent-50 to-accent-100/50',
      iconBg: 'bg-accent-100',
      iconColor: 'text-accent-600',
    },
    {
      icon: Briefcase,
      title: 'Tipos de Trabajo',
      description: 'Configura los tipos de trabajos finales disponibles',
      action: 'work-types',
      gradient: 'from-secondary-500 to-secondary-600',
      bgGradient: 'from-secondary-50 to-secondary-100/50',
      iconBg: 'bg-secondary-100',
      iconColor: 'text-secondary-600',
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-16 animate-fade-in-up">
        <h2 className="text-4xl font-bold text-gradient-primary mb-6 animate-scale-in">
          Sistema de Evaluación de Trabajos Finales
        </h2>
        <p className="text-xl text-academic-700 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Plataforma integral para la gestión, evaluación y generación de actas de trabajos de
          grado
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.action}
              onClick={() => onNavigate(feature.action)}
              className="card-elegant card-hover cursor-pointer group animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`${feature.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-400 group-hover:scale-110 group-hover:rotate-3`}>
                <Icon className={`h-8 w-8 ${feature.iconColor} transition-transform duration-300`} />
              </div>
              <h3 className="text-2xl font-bold text-academic-900 mb-3 group-hover:text-gradient-primary transition-all duration-300">
                {feature.title}
              </h3>
              <p className="text-academic-700 leading-relaxed">{feature.description}</p>
              <div className={`mt-6 h-1 w-0 bg-gradient-to-r ${feature.gradient} rounded-full transition-all duration-500 group-hover:w-full`}></div>
            </div>
          );
        })}
      </div>

      <div className="glass-effect rounded-2xl p-8 border border-academic-200/40 shadow-xl animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <h3 className="text-2xl font-bold text-gradient-primary mb-6 flex items-center">
          <Award className="h-6 w-6 mr-3 text-primary-600" />
          Características del Sistema
        </h3>
        <ul className="space-y-4 text-academic-700">
          <li className="flex items-start animate-slide-in-right" style={{ animationDelay: '0.5s' }}>
            <span className="text-primary-600 mr-3 font-bold">•</span>
            <span>Configuración parametrizable de criterios de evaluación</span>
          </li>
          <li className="flex items-start animate-slide-in-right" style={{ animationDelay: '0.6s' }}>
            <span className="text-accent-600 mr-3 font-bold">•</span>
            <span>Cálculo automático de notas con ponderaciones</span>
          </li>
          <li className="flex items-start animate-slide-in-right" style={{ animationDelay: '0.7s' }}>
            <span className="text-secondary-600 mr-3 font-bold">•</span>
            <span>Generación automática de actas oficiales</span>
          </li>
          <li className="flex items-start animate-slide-in-right" style={{ animationDelay: '0.8s' }}>
            <span className="text-tertiary-600 mr-3 font-bold">•</span>
            <span>Gestión completa de estudiantes, trabajos y evaluadores</span>
          </li>
          <li className="flex items-start animate-slide-in-right" style={{ animationDelay: '0.9s' }}>
            <span className="text-primary-600 mr-3 font-bold">•</span>
            <span>Integración con API backend Flask</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
