import { Registro, Estadisticas } from '../types';
import { maskDni } from './normalize';

function escapeCsv(v: unknown): string {
  const s = String(v ?? '').replace(/"/g, '""');
  return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s}"` : s;
}

function buildCsv(headers: string[], rows: string[][]): string {
  return [headers.map(escapeCsv).join(','), ...rows.map((r) => r.map(escapeCsv).join(','))].join('\n');
}

function downloadFile(content: string, filename: string, mime = 'text/csv;charset=utf-8;') {
  const bom = '\uFEFF';
  const blob = new Blob([bom + content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

const stamp = () => new Date().toISOString().slice(0, 10);

export function exportRegistrosCSV(data: Registro[]) {
  const headers = [
    'Hora', 'Nombre completo', 'DNI', 'Teléfono', 'Procedencia',
    'Localidad/Barrio', 'Especialidad', 'Edad', 'Género',
    'Situación de calle', 'Cobertura médica', 'Atendido previamente',
    'Motivo de consulta', 'Observaciones',
  ];
  const rows = data.map((r): string[] => [
    r.marca_temporal,
    r.nombre_completo,
    maskDni(r.dni),
    r.telefono,
    r.procedencia,
    r.localidad_barrio,
    r.especialidad,
    String(r.edad ?? ''),
    r.genero,
    r.situacion_calle,
    r.cobertura_medica,
    r.atendido_previamente,
    r.motivo_consulta,
    r.observaciones,
  ]);
  downloadFile(buildCsv(headers, rows), `uba-registros-${stamp()}.csv`);
}

export function exportResumenCSV(stats: Estadisticas) {
  const lines: string[] = [
    `Resumen operativo UBA en Acción — ${new Date().toLocaleString('es-AR')}`,
    '',
    `Total registros,${stats.total}`,
    `Última hora,${stats.ultima_hora}`,
    `Con teléfono,${stats.con_telefono}`,
    `Situación de calle (%),${stats.pct_calle}%`,
    `Sin cobertura médica (%),${stats.pct_sin_cobertura}%`,
    `Especialidad más demandada,${stats.especialidad_top}`,
    `Procedencia principal,${stats.procedencia_top}`,
    '',
    'Por especialidad',
    'Especialidad,Cantidad,%',
    ...stats.por_especialidad.map((e) => `${e.name},${e.value},${e.pct}%`),
    '',
    'Por procedencia',
    'Procedencia,Cantidad,%',
    ...stats.por_procedencia.map((e) => `${e.name},${e.value},${e.pct}%`),
    '',
    'Por hora',
    'Hora,Registros',
    ...stats.por_hora.map((e) => `${e.hora},${e.total}`),
  ];
  downloadFile(lines.join('\n'), `uba-resumen-${stamp()}.csv`);
}
