const ESPECIALIDADES_MAP: Record<string, string> = {
  odontologia: 'Odontología', odontología: 'Odontología',
  'clinica medica': 'Clínica médica', 'clínica médica': 'Clínica médica', 'clinica médica': 'Clínica médica',
  pediatria: 'Pediatría', pediatría: 'Pediatría',
  ginecologia: 'Ginecología', ginecología: 'Ginecología',
  'salud mental': 'Salud mental',
  enfermeria: 'Enfermería', enfermería: 'Enfermería',
  oftalmologia: 'Oftalmología', oftalmología: 'Oftalmología',
  nutricion: 'Nutrición', nutrición: 'Nutrición',
  'trabajo social': 'Trabajo social',
  vacunacion: 'Vacunación', vacunación: 'Vacunación',
  otra: 'Otra',
};

const PROCEDENCIAS_MAP: Record<string, string> = {
  caba: 'CABA', 'ciudad autonoma de buenos aires': 'CABA', 'ciudad de buenos aires': 'CABA',
  'provincia de buenos aires': 'Provincia de Buenos Aires', pba: 'Provincia de Buenos Aires',
  'buenos aires': 'Provincia de Buenos Aires',
  'otra provincia': 'Otra provincia',
  'otro pais': 'Otro país', 'otro país': 'Otro país',
};

const CALLE_MAP: Record<string, string> = {
  si: 'Sí', sí: 'Sí', s: 'Sí',
  no: 'No',
  'prefiere no responder': 'Prefiere no responder',
  'no responde': 'Prefiere no responder',
};

const COBERTURA_MAP: Record<string, string> = {
  si: 'Sí', sí: 'Sí',
  no: 'No',
  'no sabe': 'No sabe / no responde', 'no sabe / no responde': 'No sabe / no responde',
  'no responde': 'No sabe / no responde',
};

const GENERO_MAP: Record<string, string> = {
  femenino: 'Femenino', f: 'Femenino',
  masculino: 'Masculino', m: 'Masculino',
  'no binario': 'No binario',
  'prefiere no responder': 'Prefiere no responder',
  otro: 'Otro',
};

function mapLower(map: Record<string, string>, value: string, fallback?: string): string {
  const key = value.toLowerCase().trim().replace(/\s+/g, ' ');
  return map[key] ?? fallback ?? value.trim();
}

export function normalizeEspecialidad(v: string): string {
  return mapLower(ESPECIALIDADES_MAP, v, v.trim() || 'Otra');
}

export function normalizeProcedencia(v: string): string {
  return mapLower(PROCEDENCIAS_MAP, v, v.trim() || 'CABA');
}

export function normalizeCalle(v: string): string {
  return mapLower(CALLE_MAP, v, 'No');
}

export function normalizeCobertura(v: string): string {
  return mapLower(COBERTURA_MAP, v, 'No sabe / no responde');
}

export function normalizeGenero(v: string): string {
  return mapLower(GENERO_MAP, v, v.trim() || 'Prefiere no responder');
}

export function normalizeEdad(v: string): number | null {
  const n = parseInt(v.replace(/[^\d]/g, ''), 10);
  if (isNaN(n) || n < 0 || n > 120) return null;
  return n;
}

export function normalizeTelefono(v: string): string {
  const t = v.trim().toLowerCase();
  if (!t || t === 'sin teléfono' || t === 'sin telefono' || t === 'no tiene' || t === '-') {
    return 'Sin teléfono';
  }
  return v.trim();
}

export function maskDni(dni: string): string {
  const clean = dni.replace(/\D/g, '');
  if (clean.length < 4) return `${clean.slice(0, 2)}***.***`;
  return `${clean.slice(0, 2)}.***.***`;
}

export function rangoEtario(edad: number | null): string {
  if (edad === null) return 'Sin dato';
  if (edad <= 12) return '0–12';
  if (edad <= 17) return '13–17';
  if (edad <= 29) return '18–29';
  if (edad <= 44) return '30–44';
  if (edad <= 59) return '45–59';
  if (edad <= 74) return '60–74';
  return '75+';
}
