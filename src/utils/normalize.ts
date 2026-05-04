const RANGO_ETARIO_MAP: Record<string, string> = {
  'menos de 18 años': 'Menos de 18 años',
  '18 a 24 años': '18 a 24 años',
  '25 a 34 años': '25 a 34 años',
  '35 a 44 años': '35 a 44 años',
  '45 a 54 años': '45 a 54 años',
  '55 a 64 años': '55 a 64 años',
  '65 años o más': '65 años o más', '65 anos o mas': '65 años o más',
};

const COBERTURA_MAP: Record<string, string> = {
  'obra social': 'Obra social',
  'obra social (empleo en relación de dependencia)': 'Obra social',
  'obra social (empleo en relacion de dependencia)': 'Obra social',
  'prepaga': 'Prepaga',
  'pami': 'PAMI',
  'solo salud pública': 'Solo salud pública / no tengo cobertura',
  'solo salud publica': 'Solo salud pública / no tengo cobertura',
  'solo salud pública / no tengo cobertura': 'Solo salud pública / no tengo cobertura',
  'no tengo cobertura': 'Solo salud pública / no tengo cobertura',
  'otro': 'Otro',
};

const RESIDENCIA_MAP: Record<string, string> = {
  'caba': 'CABA',
  'ciudad autónoma de buenos aires': 'CABA', 'ciudad autonoma de buenos aires': 'CABA',
  'ciudad de buenos aires': 'CABA',
  'conurbano bonaerense': 'Conurbano Bonaerense',
  'conurbano': 'Conurbano Bonaerense',
  'otra provincia': 'Otra provincia',
};

const SITUACION_LABORAL_MAP: Record<string, string> = {
  'empleado/a en relación de dependencia': 'Empleado/a en relación de dependencia',
  'empleado/a en relacion de dependencia': 'Empleado/a en relación de dependencia',
  'empleado/a en relación de dependencia (en blanco)': 'Empleado/a en relación de dependencia',
  'empleado/a en relacion de dependencia (en blanco)': 'Empleado/a en relación de dependencia',
  'trabajo informal': 'Trabajo informal / en negro',
  'trabajo informal / en negro': 'Trabajo informal / en negro',
  'trabajo en negro': 'Trabajo informal / en negro',
  'monotributista': 'Monotributista / autónomo', 'monotributista / autónomo': 'Monotributista / autónomo',
  'monotributista / autonomo': 'Monotributista / autónomo',
  'autónomo': 'Monotributista / autónomo', 'autonomo': 'Monotributista / autónomo',
  'desempleado/a': 'Desempleado/a (busco trabajo)',
  'desempleado/a (busco trabajo)': 'Desempleado/a (busco trabajo)',
  'desempleado': 'Desempleado/a (busco trabajo)',
  'no trabajo ni busco trabajo': 'No trabajo ni busco trabajo',
  'no trabajo ni busco trabajo (estudio, jubilado/a, etc.)': 'No trabajo ni busco trabajo',
  'no trabajo ni busco trabajo (estudio, jubilado/a, etc)': 'No trabajo ni busco trabajo',
  'jubilado': 'No trabajo ni busco trabajo', 'jubilado/a': 'No trabajo ni busco trabajo',
  'estudiante': 'No trabajo ni busco trabajo',
};

const IMPEDIMENTOS_MAP: Record<string, string> = {
  'supermercado': 'Supermercado',
  'el alquiler': 'El alquiler', 'alquiler': 'El alquiler',
  'los servicios': 'Los servicios (luz, gas, agua)',
  'los servicios (luz, gas, agua)': 'Los servicios (luz, gas, agua)',
  'el transporte': 'El transporte', 'transporte': 'El transporte',
  'la salud': 'La salud y medicamentos',
  'la salud y medicamentos': 'La salud y medicamentos',
  'salud': 'La salud y medicamentos',
  'medicamentos': 'La salud y medicamentos',
  'la educación': 'La educación / útiles',
  'la educación / útiles': 'La educación / útiles',
  'la educacion': 'La educación / útiles', 'la educacion / utiles': 'La educación / útiles',
  'las deudas': 'Las deudas o créditos',
  'las deudas o créditos': 'Las deudas o créditos',
  'las deudas o creditos': 'Las deudas o créditos',
  'deudas': 'Las deudas o créditos',
  'llego a fin de mes': 'Llego a fin de mes sin problemas',
  'llego a fin de mes sin problemas': 'Llego a fin de mes sin problemas',
};

const URGENCIAS_MAP: Record<string, string> = {
  'inflación': 'Inflación y costo de vida', 'inflacion': 'Inflación y costo de vida',
  'inflación y costo de vida': 'Inflación y costo de vida',
  'inflacion y costo de vida': 'Inflación y costo de vida',
  'costo de vida': 'Inflación y costo de vida',
  'empleo': 'Empleo y salarios',
  'empleo y salarios': 'Empleo y salarios',
  'salarios': 'Empleo y salarios',
  'salud pública': 'Salud pública', 'salud publica': 'Salud pública',
  'seguridad': 'Seguridad',
  'educación': 'Educación', 'educacion': 'Educación',
  'vivienda': 'Vivienda',
  'jubilaciones': 'Jubilaciones y pensiones',
  'jubilaciones y pensiones': 'Jubilaciones y pensiones',
  'pensiones': 'Jubilaciones y pensiones',
  'corrupción': 'Corrupción e instituciones', 'corrupcion': 'Corrupción e instituciones',
  'corrupción e instituciones': 'Corrupción e instituciones',
  'corrupcion e instituciones': 'Corrupción e instituciones',
  'pobreza': 'Pobreza e indigencia',
  'pobreza e indigencia': 'Pobreza e indigencia',
  'indigencia': 'Pobreza e indigencia',
};

function mapLower(map: Record<string, string>, value: string, fallback?: string): string {
  const key = value.toLowerCase().trim().replace(/\s+/g, ' ');
  return map[key] ?? fallback ?? value.trim();
}

function parseMultipleChoice(map: Record<string, string>, value: string): string[] {
  if (!value || !value.trim()) return [];
  return value
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .map(s => mapLower(map, s))
    .filter(s => s.length > 0);
}

export function normalizeRangoEtario(v: string): string {
  return mapLower(RANGO_ETARIO_MAP, v, v.trim() || 'Sin dato');
}

export function normalizeCobertura(v: string): string {
  return mapLower(COBERTURA_MAP, v, v.trim() || 'Sin dato');
}

export function normalizeResidencia(v: string): string {
  return mapLower(RESIDENCIA_MAP, v, v.trim() || 'Sin dato');
}

export function normalizeSituacionLaboral(v: string): string {
  return mapLower(SITUACION_LABORAL_MAP, v, v.trim() || 'Sin dato');
}

export function normalizeImpedimentos(v: string): string[] {
  return parseMultipleChoice(IMPEDIMENTOS_MAP, v);
}

export function normalizeUrgencias(v: string): string[] {
  return parseMultipleChoice(URGENCIAS_MAP, v);
}

export function maskDni(dni: string): string {
  const clean = dni.replace(/\D/g, '');
  if (clean.length < 4) return `${clean.slice(0, 2)}***.***`;
  return `${clean.slice(0, 2)}.***.***`;
}
