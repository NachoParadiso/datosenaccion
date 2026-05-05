import { useState, useEffect, useCallback, useRef } from 'react';
import { Registro, Estadisticas, DataStatus } from '../types';
import { MOCK_DATA, MOCK_STATS } from '../data/mockData';
import { supabaseService, RegistroAplanado, CatalogoEntry } from '../services/supabaseService';
import { mapStatsFromBackend } from '../utils/statistics';

const REFRESH_MS = Number(import.meta.env.VITE_REFRESH_INTERVAL ?? 10_000);

function hasCredentials(): boolean {
  return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
}

function mapToRegistro(row: RegistroAplanado): Registro {
  return {
    id: row.id,
    marca_temporal: row.marca_temporal ?? '',
    nombre_completo: row.nombre_completo ?? '',
    dni: row.dni ?? '',
    telefono: '',
    procedencia: '',
    localidad_barrio: '',
    situacion_calle: '',
    especialidad: '',
    motivo_consulta: '',
    edad: null,
    genero: '',
    cobertura_medica: '',
    atendido_previamente: '',
    observaciones: '',
    hora: row.marca_temporal ? new Date(row.marca_temporal).getHours() : -1,
    fecha: row.marca_temporal ? new Date(row.marca_temporal) : null,
    rango_etario: row.rango_etario ?? '',
    cobertura: row.cobertura ?? '',
    residencia: row.residencia ?? '',
    situacion_laboral: row.situacion_laboral ?? '',
    impedimentos: row.impedimentos ?? [],
    urgencias: row.urgencias ?? [],
  };
}

type CatalogoMap = Record<string, CatalogoEntry[]>;

export function useSupabaseData() {
  const [data, setData] = useState<Registro[]>(MOCK_DATA);
  const [stats, setStats] = useState<Estadisticas | null>(MOCK_STATS);
  const [catalogos, setCatalogos] = useState<CatalogoMap>({});
  const [status, setStatus] = useState<DataStatus>('mock');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(new Date());
  const [error, setError] = useState<string | null>(null);
  const [usingMock, setUsingMock] = useState<boolean>(true);

  const fetchAll = useCallback(async () => {
    if (!hasCredentials()) {
      // No hay credenciales, usar mock directamente
      setData(MOCK_DATA);
      setStats(MOCK_STATS);
      setStatus('mock');
      setUsingMock(true);
      setLastUpdate(new Date());
      return;
    }

    setStatus('loading');
    setUsingMock(false);
    try {
      const [registrosRaw, statsRaw, catalogosData] = await Promise.all([
        supabaseService.getRegistros(),
        supabaseService.getStats(),
        supabaseService.getCatalogos(),
      ]);

      setData(registrosRaw.map(mapToRegistro));
      if (statsRaw) {
        setStats(mapStatsFromBackend(statsRaw));
      }
      setCatalogos(catalogosData);
      setStatus('ok');
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      console.warn('Supabase connection failed, falling back to mock data:', err);
      setData(MOCK_DATA);
      setStats(MOCK_STATS);
      setStatus('mock');
      setUsingMock(true);
      setLastUpdate(new Date());
      setError(null);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const timerId = setInterval(fetchAll, REFRESH_MS);
    return () => clearInterval(timerId);
  }, [fetchAll]);

  return {
    data,
    stats,
    catalogos,
    status,
    lastUpdate,
    error,
    usingMock,
    refresh: fetchAll,
    createRegistro: supabaseService.createRegistro.bind(supabaseService),
    deleteRegistro: supabaseService.deleteRegistro.bind(supabaseService),
  };
}
