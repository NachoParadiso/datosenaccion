import { useState, useEffect, useCallback } from 'react';
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
    procedencia: row.residencia ?? '',
    localidad_barrio: '',
    situacion_calle: '',
    especialidad: '',
    motivo_consulta: '',
    edad: null,
    genero: '',
    cobertura_medica: row.cobertura ?? '',
    atendido_previamente: '',
    observaciones: '',
    hora: 0,
    fecha: row.marca_temporal ? new Date(row.marca_temporal) : null,
  };
}

function mapCatalogos(raw: Record<string, CatalogoEntry[]>): Record<string, Array<{ id: number; descripcion: string; orden: number }>> {
  const result: Record<string, Array<{ id: number; descripcion: string; orden: number }>> = {};
  for (const [key, entries] of Object.entries(raw)) {
    result[key] = entries.map(e => ({ id: e.id, descripcion: e.descripcion, orden: e.orden }));
  }
  return result;
}

export function useSupabaseData() {
  const [data, setData] = useState<Registro[]>([]);
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [catalogos, setCatalogos] = useState<Record<string, Array<{ id: number; descripcion: string; orden: number }>>>({});
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
      const [registros, catalogosRaw, statsData] = await Promise.all([
        supabaseService.getRegistros(),
        supabaseService.getCatalogos(),
        supabaseService.getStats(),
      ]);

      setData(registros.map(mapToRegistro));
      setCatalogos(mapCatalogos(catalogosRaw));
      setStats(statsData as Record<string, unknown> | null);
      setStatus('ok');
      setLastUpdate(new Date());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido');
      setStatus('error');
    }
  }, [usingMock]);

  useEffect(() => {
    fetchAll();
    const timerRef = setInterval(fetchAll, REFRESH_MS);
    return () => clearInterval(timerRef);
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
