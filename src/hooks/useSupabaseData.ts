import { useState, useEffect, useCallback, useRef } from 'react'; // <-- Agregamos useRef
import { Registro, Estadisticas, DataStatus } from '../types';
import { supabaseService, RegistroAplanado, CatalogoEntry } from '../services/supabaseService';
import { mapStatsFromBackend } from '../utils/statistics';
import { supabase } from '../lib/supabaseClient';

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
  const [operativos, setOperativos] = useState<any[]>([]);
  const [data, setData] = useState<Registro[]>([]);
  const [stats, setStats] = useState<Estadisticas | null>(null);
  const [catalogos, setCatalogos] = useState<CatalogoMap>({});
  const [status, setStatus] = useState<DataStatus>('loading');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [usingMock, setUsingMock] = useState<boolean>(false);

  // MAGIA ANTI-PARPADEO: Variables de memoria para evitar que peticiones viejas pisen a las nuevas
  const activeIdRef = useRef<string | undefined>(undefined);
  const fetchCounter = useRef(0);

  const fetchAll = useCallback(async (operativoIdParaFiltrar?: string) => {
    // 1. Si nos mandan un ID, lo guardamos para siempre. Si no mandan nada (ej. el recargo automático), usamos el guardado.
    if (operativoIdParaFiltrar !== undefined) {
      activeIdRef.current = operativoIdParaFiltrar;
    }
    const idAUsar = activeIdRef.current;

    // 2. Le ponemos un "sello" a esta petición.
    const currentFetchId = ++fetchCounter.current;

    if (!hasCredentials()) {
      setStatus('error');
      setError('No hay credenciales de Supabase configuradas');
      return;
    }

    setStatus('loading');
    try {
      const [registrosRaw, statsRaw, catalogosData, operativosData] = await Promise.all([
        supabaseService.getRegistros(),
        supabaseService.getStats(idAUsar), // <-- Usamos el ID con memoria
        supabaseService.getCatalogos(),
        supabaseService.getOperativos(), 
      ]);

      // 3. LA CLAVE: Si mientras esperábamos esto, el dashboard pidió algo más nuevo, abortamos y no dibujamos nada viejo.
      if (currentFetchId !== fetchCounter.current) return;

      setData(registrosRaw.map(mapToRegistro));
      if (statsRaw) {
        setStats(mapStatsFromBackend(statsRaw));
      }
      setCatalogos(catalogosData);
      setOperativos(operativosData);
      setStatus('ok');
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      console.error('Supabase connection failed:', err);
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  }, []);

  useEffect(() => {
    fetchAll();

    if (!supabase) return;

    const channelName = `canal-encuestas-${Math.random()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'encuesta', 
          table: 'registros' 
        }, 
        (payload: any) => {
          console.log('¡Nueva encuesta recibida!', payload);
          fetchAll(); // Ahora el recargo sabe qué ID usar gracias a la memoria
        }
      )
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
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
    operativos,
  };
}