import Papa from 'papaparse';
import { Registro } from '../types';
import {
  normalizeRangoEtario, normalizeCobertura, normalizeResidencia,
  normalizeSituacionLaboral, normalizeImpedimentos, normalizeUrgencias,
} from './normalize';

const COL_MAP: Record<string, keyof RowRaw> = {
  'marca temporal': 'marca_temporal',
  'timestamp': 'marca_temporal',
  'nombre completo': 'nombre_completo',
  'nombre': 'nombre_completo',
  'dni': 'dni',
  'edad': 'rango_etario',
  'rango etario': 'rango_etario',
  'rango etario (edad)': 'rango_etario',
  'cobertura médica': 'cobertura',
  'cobertura medica': 'cobertura',
  'tenés cobertura médica': 'cobertura',
  'tenes cobertura medica': 'cobertura',
  'dónde vivís': 'residencia',
  'donde vivis': 'residencia',
  'residencia': 'residencia',
  'procedencia': 'residencia',
  'qué te impide llegar a fin de mes': 'impedimentos',
  'que te impide llegar a fin de mes': 'impedimentos',
  'impedimentos': 'impedimentos',
  'qué tema debería tratar el gobierno': 'urgencias',
  'que tema deberia tratar el gobierno': 'urgencias',
  'urgencias': 'urgencias',
  'situación laboral': 'situacion_laboral',
  'situacion laboral': 'situacion_laboral',
  'situación laboral actual': 'situacion_laboral',
  'situacion laboral actual': 'situacion_laboral',
};

interface RowRaw {
  marca_temporal: string;
  nombre_completo: string;
  dni: string;
  rango_etario: string;
  cobertura: string;
  residencia: string;
  impedimentos: string;
  urgencias: string;
  situacion_laboral: string;
}

function mapRow(raw: Record<string, unknown>): RowRaw {
  const result: RowRaw = {
    marca_temporal: '', nombre_completo: '', dni: '',
    rango_etario: '', cobertura: '', residencia: '',
    impedimentos: '', urgencias: '', situacion_laboral: '',
  };
  Object.entries(raw).forEach(([header, value]) => {
    const key = COL_MAP[header.toLowerCase().trim()];
    if (key) result[key] = String(value ?? '');
  });
  return result;
}

function parseDate(ts: string): Date | null {
  if (!ts) return null;
  try {
    const parts = ts.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2}):(\d{2})/);
    if (parts) {
      return new Date(+parts[3], +parts[2] - 1, +parts[1], +parts[4], +parts[5], +parts[6]);
    }
    return new Date(ts);
  } catch {
    return null;
  }
}

export function parseCSV(csvText: string): Registro[] {
  const result = Papa.parse<Record<string, unknown>>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  if (!result.data) return [];

  return (result.data as Record<string, unknown>[])
    .filter((row) => Object.values(row).some((v) => String(v ?? '').trim()))
    .map((row, idx) => {
      const raw = mapRow(row);
      const fecha = parseDate(raw.marca_temporal);
      const hora = fecha ? fecha.getHours() : -1;

      return {
        id: `row-${idx}`,
        marca_temporal: raw.marca_temporal,
        nombre_completo: raw.nombre_completo.trim() || '(sin nombre)',
        dni: raw.dni.replace(/\D/g, '') || '0',
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
        hora,
        fecha,
        rango_etario: normalizeRangoEtario(raw.rango_etario),
        cobertura: normalizeCobertura(raw.cobertura),
        residencia: normalizeResidencia(raw.residencia),
        situacion_laboral: normalizeSituacionLaboral(raw.situacion_laboral),
        impedimentos: normalizeImpedimentos(raw.impedimentos),
        urgencias: normalizeUrgencias(raw.urgencias),
      };
    });
}
