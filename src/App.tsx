import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Layout from './components/Layout';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Students from './pages/Students';
import Works from './pages/Works';
import Evaluators from './pages/Evaluators';
import Grades from './pages/Grades';
import Reports from './pages/Reports';

import Criteria from './pages/Criteria';
import WorkTypes from './pages/WorkTypes';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'students':
        return <Students />;
      case 'works':
        return <Works />;
      case 'evaluators':
        return <Evaluators />;
      case 'grades':
        return <Grades />;
      case 'reports':
        return <Reports />;
      case 'criteria':
        return <Criteria />;
      case 'work-types':
        return <WorkTypes />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <Layout>
      {currentPage !== 'home' && (
        <div className="mb-6 animate-fade-in-down">
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center text-primary-600 hover:text-primary-700 font-semibold mb-6 transition-all duration-300 hover-lift-subtle group"
          >
            <ArrowLeft className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
            Volver al Inicio
          </button>
          <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
        </div>
      )}
      <div className="page-transition">
        {renderPage()}
      </div>
    </Layout>
  );
}

export default App;
