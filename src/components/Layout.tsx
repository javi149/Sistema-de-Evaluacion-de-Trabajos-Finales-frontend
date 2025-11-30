import { ReactNode } from 'react';
import { GraduationCap } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-academic-50 via-white via-primary-50/30 to-secondary-50/20 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-200/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-secondary-200/15 rounded-full blur-2xl animate-float"></div>

      <header className="glass-effect-strong shadow-lg border-b border-academic-200/30 top-0 z-50 animate-fade-in-down">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary-300/30 rounded-full blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500 animate-pulse-slow"></div>
              <GraduationCap className="h-10 w-10 text-primary-600 mr-4 relative z-10 animate-float transition-transform duration-300 group-hover:scale-110" />
            </div>
            <h1 className="text-3xl font-bold text-gradient-primary animate-fade-in-up">
              Sistema de Evaluación de Trabajos Finales
            </h1>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 animate-fade-in">
        {children}
      </main>
    </div>
  );
}
