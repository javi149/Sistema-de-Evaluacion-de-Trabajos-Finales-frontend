import { useState } from 'react';
import Layout from './components/Layout';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Students from './pages/Students';
import Works from './pages/Works';
import Evaluators from './pages/Evaluators';
import Grades from './pages/Grades';
import Reports from './pages/Reports';

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
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <Layout>
      {currentPage !== 'home' && (
        <div className="mb-6">
          <button
            onClick={() => setCurrentPage('home')}
            className="text-blue-600 hover:text-blue-800 font-medium mb-4"
          >
            ← Volver al Inicio
          </button>
          <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
        </div>
      )}
      {renderPage()}
    </Layout>
  );
}

export default App;
