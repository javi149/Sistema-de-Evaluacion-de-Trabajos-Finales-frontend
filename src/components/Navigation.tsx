import { Users, FileText, UserCheck, ClipboardList, FileCheck } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const menuItems = [
    { id: 'students', label: 'Registrar Estudiantes', icon: Users },
    { id: 'works', label: 'Registrar Trabajos', icon: FileText },
    { id: 'evaluators', label: 'Registrar Evaluadores', icon: UserCheck },
    { id: 'grades', label: 'Ingresar Notas', icon: ClipboardList },
    { id: 'reports', label: 'Ver Actas', icon: FileCheck },
  ];

  return (
    <nav className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-wrap gap-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === item.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
