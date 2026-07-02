import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import PresentationMode from './components/presentation/PresentationMode';
import Home from './pages/Home';
import Formulario from './pages/Formulario';
import React from 'react';

// COMPONENTE GUARDIÁN: Revisa si hay sesión activa antes de mostrar la ruta
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const authData = sessionStorage.getItem('uba_auth');
  
  if (!authData) return <Navigate to="/" replace />; // Lo patea al inicio
  
  const { timestamp } = JSON.parse(authData);
  const horasPasadas = (Date.now() - timestamp) / (1000 * 60 * 60);
  
  if (horasPasadas > 2) {
    sessionStorage.removeItem('uba_auth');
    return <Navigate to="/" replace />; // Sesión vencida, lo patea al inicio
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/dashboard/:id" 
            element={
              <ProtectedRoute>
                <PresentationMode />
              </ProtectedRoute>
            } 
          />
          <Route path="/encuesta/:operativoId" element={<Formulario />} />
        </Routes>
      </DataProvider>
      
    </BrowserRouter>
  );
}