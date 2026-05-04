export interface Registro {
  id: string;
  marca_temporal: string;
  nombre_completo: string;
  dni: string;
  telefono: string;
  procedencia: string;
  localidad_barrio: string;
  situacion_calle: string;
  especialidad: string;
  motivo_consulta: string;
  edad: number | null;
  genero: string;
  cobertura_medica: string;
  atendido_previamente: string;
  observaciones: string;
  hora: number;
  fecha: Date | null;
}

export interface RegistroSupabase {
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

export interface Filtros {
  especialidad: string;
  procedencia: string;
  situacion_calle: string;
  cobertura_medica: string;
  genero: string;
  hora_desde: number;
  hora_hasta: number;
  localidad: string;
  search: string;
}

export interface FiltrosSupabase {
  rango_etario: string;
  cobertura: string;
  residencia: string;
  situacion_laboral: string;
  impedimento: string;
  urgencia: string;
  search: string;
}

export interface Estadisticas {
  total: number;
  ultima_hora: number;
  especialidad_top: string;
  pct_calle: number;
  pct_sin_cobertura: number;
  procedencia_top: string;
  con_telefono: number;
  por_especialidad: KV[];
  por_procedencia: KV[];
  por_hora: HoraEntry[];
  por_edad: KV[];
  por_genero: KV[];
  por_cobertura: KV[];
  por_calle: KV[];
  por_localidad: KV[];
  alertas: Alerta[];
}

export interface EstadisticasSupabase {
  total_registros: number;
  por_rango_etario: KV[];
  por_cobertura: KV[];
  por_residencia: KV[];
  por_situacion_laboral: KV[];
  top_impedimentos: KV[];
  top_urgencias: KV[];
}

export interface KV {
  name: string;
  value: number;
  pct?: number;
}

export interface HoraEntry {
  hora: string;
  total: number;
}

export interface Alerta {
  tipo: 'alta_demanda' | 'situacion_calle' | 'info';
  mensaje: string;
  especialidad?: string;
}

export type DataStatus = 'idle' | 'loading' | 'ok' | 'error' | 'mock';
