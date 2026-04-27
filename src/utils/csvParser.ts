import Papa from 'papaparse';
import { Registro } from '../types';
import {
  normalizeEspecialidad, normalizeProcedencia, normalizeCalle,
  normalizeCobertura, normalizeGenero, normalizeEdad, normalizeTelefono,
} from './normalize';

const COL_MAP: Record<string, keyof RowRaw> = {
  'marca temporal': 'marca_temporal',
  'timestamp': 'marca_temporal',
  'nombre completo': 'nombre_completo',
  'nombre': 'nombre_completo',
  'dni': 'dni',
  'teléfono': 'telefono',
  'telefono': 'telefono',
  'procedencia': 'procedencia',
  'localidad / barrio': 'localidad_barrio',
  'localidad/barrio': 'localidad_barrio',
  'localidad': 'localidad_barrio',
  'barrio': 'localidad_barrio',
  '¿está en situación de calle?': 'situacion_calle',
  'situación de calle': 'situacion_calle',
  'situacion de calle': 'situacion_calle',
  'especialidad por la que viene a atenderse': 'especialidad',
  'especialidad': 'especialidad',
  'motivo de consulta breve': 'motivo_consulta',
  'motivo de consulta': 'motivo_consulta',
  'motivo': 'motivo_consulta',
  'edad': 'edad',
  'género': 'genero',
  'genero': 'genero',
  '¿tiene cobertura médica / obra social / prepaga?': 'cobertura_medica',
  'cobertura médica': 'cobertura_medica',
  'cobertura medica': 'cobertura_medica',
  '¿ya había participado o sido atendido previamente por uba en acción?': 'atendido_previamente',
  'atendido previamente por uba en acción': 'atendido_previamente',
  'atendido previamente': 'atendido_previamente',
  'observaciones internas': 'observaciones',
  'observaciones': 'observaciones',
};

interface RowRaw {
  marca_temporal: string;
  nombre_completo: string;
  dni: string;
  telefono: string;
  procedencia: string;
  localidad_barrio: string;
  situacion_calle: string;
  especialidad: string;
  motivo_consulta: string;
  edad: string;
  genero: string;
  cobertura_medica: string;
  atendido_previamente: string;
  observaciones: string;
}

function mapRow(raw: Record<string, unknown>): RowRaw {
  const result: RowRaw = {
    marca_temporal: '', nombre_completo: '', dni: '', telefono: '',
    procedencia: '', localidad_barrio: '', situacion_calle: '',
    especialidad: '', motivo_consulta: '', edad: '', genero: '',
    cobertura_medica: '', atendido_previamente: '', observaciones: '',
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
        telefono: normalizeTelefono(raw.telefono),
        procedencia: normalizeProcedencia(raw.procedencia),
        localidad_barrio: raw.localidad_barrio.trim() || 'No informado',
        situacion_calle: normalizeCalle(raw.situacion_calle),
        especialidad: normalizeEspecialidad(raw.especialidad),
        motivo_consulta: raw.motivo_consulta.trim(),
        edad: normalizeEdad(raw.edad),
        genero: normalizeGenero(raw.genero),
        cobertura_medica: normalizeCobertura(raw.cobertura_medica),
        atendido_previamente: raw.atendido_previamente.trim() || 'No sabe',
        observaciones: raw.observaciones.trim(),
        hora,
        fecha,
      };
    });
}
