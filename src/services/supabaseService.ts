import { supabase } from '../lib/supabaseClient';

function getClient() {
  if (!supabase) throw new Error('Supabase no está configurado. Agregá VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY al .env.local');
  return supabase;
}

export interface RegistroAplanado {
  id: string;
  marca_temporal: string;
  nombre_completo: string;
  dni: string;
  rango_etario: string;
  cobertura: string;
  residencia: string;
  situacion_laboral: string;
  impedimentos: string[];
  urgencias: string[];
}

export interface CatalogoEntry {
  catalogo: string;
  id: number;
  descripcion: string;
  orden: number;
}

export interface CreateRegistroPayload {
  nombre_completo: string;
  dni: string;
  rango_etario_id: number;
  cobertura_id: number;
  residencia_id: number;
  situacion_laboral_id: number;
  impedimentos?: number[];
  urgencias: number[];
}

export interface StatsResult {
  total_registros: number;
  por_rango_etario: Array<{ categoria: string; cantidad: number }>;
  por_cobertura: Array<{ categoria: string; cantidad: number }>;
  por_residencia: Array<{ categoria: string; cantidad: number }>;
  por_situacion_laboral: Array<{ categoria: string; cantidad: number }>;
  top_impedimentos: Array<{ impedimento: string; cantidad: number }>;
  top_urgencias: Array<{ urgencia: string; cantidad: number }>;
  por_hora?: Array<{ hora: string; total: number }>;
}

/**
 * Singleton service layer — única capa que habla con Supabase.
 * Todo acceso a datos pasa por acá, exclusivamente vía RPCs (procedures).
 * No hay SQL embebido ni queries directas a tablas.
 */
class SupabaseService {
  async getRegistros(): Promise<RegistroAplanado[]> {
    const { data, error } = await getClient().schema('encuesta').rpc('get_registros');

    if (error) throw new Error(`get_registros: ${error.message}`);
    return data ?? [];
  }

  async getRegistroUltimo(): Promise<RegistroAplanado | null> {
    const { data, error } = await getClient().schema('encuesta').rpc('get_registro_ultimo');

    if (error) throw new Error(`get_registro_ultimo: ${error.message}`);
    return data?.[0] ?? null;
  }

  async createRegistro(payload: CreateRegistroPayload): Promise<string> {
    const { data, error } = await getClient().schema('encuesta').rpc('create_registro', {
      p_data: payload,
    });

    if (error) throw new Error(`create_registro: ${error.message}`);
    return data;
  }

  async deleteRegistro(registroId: string): Promise<void> {
    const { error } = await getClient().schema('encuesta').rpc('delete_registro', {
      p_registro_id: registroId,
    });

    if (error) throw new Error(`delete_registro: ${error.message}`);
  }

  async getCatalogos(): Promise<Record<string, CatalogoEntry[]>> {
    const { data, error } = await getClient().schema('encuesta').rpc('get_catalogos');

    if (error) throw new Error(`get_catalogos: ${error.message}`);

    const grouped: Record<string, CatalogoEntry[]> = {};
    for (const row of data ?? []) {
      if (!grouped[row.catalogo]) grouped[row.catalogo] = [];
      grouped[row.catalogo].push({
        catalogo: row.catalogo,
        id: row.id,
        descripcion: row.descripcion,
        orden: row.orden,
      });
    }
    return grouped;
  }

  async getStats(): Promise<StatsResult | null> {
    const { data, error } = await getClient().schema('encuesta').rpc('get_stats');

    if (error) throw new Error(`get_stats: ${error.message}`);
    return data;
  }
}

export const supabaseService = new SupabaseService();
