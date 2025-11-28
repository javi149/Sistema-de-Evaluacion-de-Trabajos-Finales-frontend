import { Users, FileText, UserCheck, ClipboardList, FileCheck } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const menuItems = [
    { id: 'students', label: 'Registrar Estudiantes', icon: Users, color: 'primary' },
    { id: 'works', label: 'Registrar Trabajos', icon: FileText, color: 'accent' },
    { id: 'evaluators', label: 'Registrar Evaluadores', icon: UserCheck, color: 'secondary' },
    { id: 'grades', label: 'Ingresar Notas', icon: ClipboardList, color: 'tertiary' },
    { id: 'reports', label: 'Ver Actas', icon: FileCheck, color: 'primary' },
    { id: 'criteria', label: 'Gestionar Criterios', icon: Award, color: 'accent' },
  ];

  const getActiveClasses = (color: string) => {
    const colors: Record<string, string> = {
      primary: 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-200/50 hover:shadow-xl hover:shadow-primary-300/50',
      accent: 'bg-gradient-to-r from-accent-600 to-accent-500 text-white shadow-lg shadow-accent-200/50 hover:shadow-xl hover:shadow-accent-300/50',
      secondary: 'bg-gradient-to-r from-secondary-600 to-secondary-500 text-white shadow-lg shadow-secondary-200/50 hover:shadow-xl hover:shadow-secondary-300/50',
      tertiary: 'bg-gradient-to-r from-tertiary-600 to-tertiary-500 text-white shadow-lg shadow-tertiary-200/50 hover:shadow-xl hover:shadow-tertiary-300/50',
    };
    return colors[color] || colors.primary;
  };

  return (
    <nav className="glass-effect rounded-2xl shadow-xl p-5 mb-6 border border-academic-200/40 animate-fade-in-up">
      <div className="flex flex-wrap gap-3">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{ animationDelay: `${index * 80}ms` }}
              className={`flex items-center px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-400 hover-lift-subtle animate-fade-in-up ${isActive
                  ? getActiveClasses(item.color)
                  : 'bg-academic-100/80 text-academic-700 hover:bg-academic-200/80 hover:text-academic-900 border border-academic-200/50'
                }`}
            >
              <Icon className={`h-5 w-5 mr-2.5 transition-all duration-300 ${isActive ? 'scale-110 rotate-3' : 'group-hover:scale-110'}`} />
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
