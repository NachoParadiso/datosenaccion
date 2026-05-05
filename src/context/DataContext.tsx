import React, { createContext, useContext, useState, useMemo } from 'react';
import { Registro, Filtros, Estadisticas, DataStatus } from '../types';
import { calcularEstadisticas, filtrarRegistros, mapStatsFromBackend } from '../utils/statistics';
import { useSupabaseData } from '../hooks/useSupabaseData';

const FILTROS_DEFAULT: Filtros = {
  especialidad: '',
  procedencia: '',
  situacion_calle: '',
  cobertura_medica: '',
  genero: '',
  hora_desde: 0,
  hora_hasta: 23,
  localidad: '',
  search: '',
};

const INTERNAL_PASSWORD = 'uba2026';

interface DataContextValue {
  rawData: Registro[];
  filteredData: Registro[];
  stats: Estadisticas;
  filtros: Filtros;
  setFiltros: React.Dispatch<React.SetStateAction<Filtros>>;
  resetFiltros: () => void;
  status: DataStatus;
  lastUpdate: Date | null;
  error: string | null;
  usingMock: boolean;
  customUrl: string;
  saveCustomUrl: (url: string) => void;
  refresh: () => void;
  presentationMode: boolean;
  setPresentationMode: (v: boolean) => void;
  isInternalView: boolean;
  loginInternal: (pwd: string) => boolean;
  logoutInternal: () => void;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { data, stats: backendStats, status, lastUpdate, error, usingMock, refresh } = useSupabaseData();
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_DEFAULT);
  const [presentationMode, setPresentationMode] = useState(false);
  const [isInternalView, setIsInternalView] = useState(false);

  const filteredData = useMemo(() => filtrarRegistros(data, filtros), [data, filtros]);

  const stats = useMemo(() => {
    if (backendStats) {
      // Usar estadísticas del backend (Supabase conectado)
      if (usingMock) {
        return backendStats;
      }
      return backendStats;
    }
    // Fallback: calcular desde datos mock
    return calcularEstadisticas(filteredData);
  }, [backendStats, filteredData, usingMock]);

  const resetFiltros = () => setFiltros(FILTROS_DEFAULT);

  const loginInternal = (pwd: string): boolean => {
    if (pwd === INTERNAL_PASSWORD) {
      setIsInternalView(true);
      return true;
    }
    return false;
  };

  const logoutInternal = () => setIsInternalView(false);

  const contextValue: DataContextValue = useMemo(
    () => ({
      rawData: data,
      filteredData,
      stats,
      filtros,
      setFiltros,
      resetFiltros,
      status,
      lastUpdate,
      error,
      usingMock,
      customUrl: '',
      saveCustomUrl: () => {},
      refresh,
      presentationMode,
      setPresentationMode,
      isInternalView,
      loginInternal,
      logoutInternal,
    }),
    [data, filteredData, stats, filtros, status, lastUpdate, error, usingMock, refresh, presentationMode, isInternalView]
  );

  return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used inside DataProvider');
  return ctx;
}
