import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { DataProvider } from './context/DataContext';
import Header from './components/layout/Header';
import DashboardHome from './pages/DashboardHome';
import SpecialtyDetail from './components/specialty/SpecialtyDetail';
import PresentationMode from './components/presentation/PresentationMode';
import { useData } from './context/DataContext';

function AppContent() {
  const { presentationMode } = useData();
  if (presentationMode) return <PresentationMode />;
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-screen-2xl mx-auto w-full px-4 py-6">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/especialidad/:nombre" element={<SpecialtyDetail />} />
          </Routes>
        </AnimatePresence>
      </main>
      <footer className="text-center text-xs text-slate-400 py-3 border-t border-slate-100 bg-white">
        Uso interno · Información confidencial del operativo UBA en Acción
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </BrowserRouter>
  );
}
