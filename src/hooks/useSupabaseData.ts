import { useState, useEffect, useCallback, useRef } from 'react';
import { Registro, DataStatus } from '../types';
import { MOCK_DATA } from '../data/mockData';
import { supabaseService, RegistroAplanado, CatalogoEntry } from '../services/supabaseService';

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
  const [data, setData] = useState<Registro[]>([]);
  const [catalogos, setCatalogos] = useState<CatalogoMap>({});
  const [status, setStatus] = useState<DataStatus>('idle');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const usingMock = !hasCredentials();

  const fetchAll = useCallback(async () => {
    if (usingMock) {
      setData(MOCK_DATA);
      setStatus('mock');
      setLastUpdate(new Date());
      return;
    }

    setStatus('loading');
    try {
      const [registrosRaw, catalogosData] = await Promise.all([
        supabaseService.getRegistros(),
        supabaseService.getCatalogos(),
      ]);

      setData(registrosRaw.map(mapToRegistro));
      setCatalogos(catalogosData);
      setStatus('ok');
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      setStatus('error');
    }
  }, [usingMock]);

  useEffect(() => {
    fetchAll();
    const timerId = setInterval(fetchAll, REFRESH_MS);
    return () => clearInterval(timerId);
  }, [fetchAll]);

  return {
    data,
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
