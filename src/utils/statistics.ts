import { Registro, Estadisticas, KV, HoraEntry, Alerta } from '../types';
import type { StatsResult } from '../services/supabaseService';

// 1. DICCIONARIOS DE TRADUCCIÓN
const MAPA_IMPEDIMENTOS: Record<number, string> = {
  1: 'Supermercado', 2: 'El alquiler', 3: 'Los servicios (luz, gas, agua)', 4: 'El transporte',
  5: 'La salud y medicamentos', 6: 'La educación / útiles', 7: 'Las deudas o créditos', 8: 'Llego a fin de mes sin problemas'
};

const MAPA_URGENCIAS: Record<number, string> = {
  1: 'Inflación y costo de vida', 2: 'Empleo y salarios', 3: 'Salud pública', 4: 'Seguridad',
  5: 'Educación', 6: 'Vivienda', 7: 'Jubilaciones y pensiones', 8: 'Corrupción e instituciones', 9: 'Pobreza e indigencia'
};

const MAPA_PROPUESTAS: Record<number, string> = {
  1: 'Mantenimiento del espacio público (arreglo de calles - limpieza - iluminación y plazas)',
  2: 'Mayor seguridad y prevención comunitaria',
  3: 'Operativos de salud gratuitos (chequeos - consultas médicas y medicamentos)',
  4: 'Asistencia social y alimentaria (apoyo a comedores y merenderos)',
  5: 'Deporte y recreación (actividades para chicos - jóvenes y adultos)',
  6: 'Cursos de formación laboral y oficios',
  7: 'Cultura y educación (talleres - apoyo escolar y eventos artísticos)'
};

function distribute100(values: number[]): number[] {
  const sum = values.reduce((s, v) => s + v, 0);
  if (sum <= 0) return values.map(() => 0);
  const exact = values.map((v) => (v / sum) * 100);
  const floored = exact.map(Math.floor);
  let leftover = 100 - floored.reduce((s, v) => s + v, 0);
  const order = exact
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac);
  const result = [...floored];
  for (const { i } of order) {
    if (leftover <= 0) break;
    result[i]++;
    leftover--;
  }
  return result;
}

export function mapStatsFromBackend(backend: any): Estadisticas {
  const total = backend.total_registros || 0;

  const mapKV = (arr: Array<{ categoria: string; cantidad: number }>): KV[] =>
    arr.map((x) => ({ name: x.categoria, value: x.cantidad, pct: Math.round((x.cantidad / (total || 1)) * 100) }));

  const por_rango_etario = mapKV(backend.por_rango_etario || []);
  const por_cobertura = mapKV(backend.por_cobertura || []);
  const por_residencia = mapKV(backend.por_residencia || []);
  const por_situacion_laboral = mapKV(backend.por_situacion_laboral || []);
  
  // Traducción en vuelo si el backend mandó los datos directamente
  const por_propuestas_barrio = (backend.por_propuestas_barrio || []).map((x: any) => ({
    name: MAPA_PROPUESTAS[Number(x.categoria)] || x.categoria,
    value: x.cantidad,
    pct: Math.round((x.cantidad / (total || 1)) * 100)
  })).sort((a: any, b: any) => b.value - a.value);
  
  const top_impedimentos = (backend.top_impedimentos || []).map((x: any) => ({
    name: MAPA_IMPEDIMENTOS[Number(x.impedimento)] || x.impedimento,
    value: x.cantidad,
    pct: Math.round((x.cantidad / (total || 1)) * 100)
  })).sort((a: any, b: any) => b.value - a.value);

  const top_urgencias = (backend.top_urgencias || []).map((x: any) => ({
    name: MAPA_URGENCIAS[Number(x.urgencia)] || x.urgencia,
    value: x.cantidad,
    pct: Math.round((x.cantidad / (total || 1)) * 100)
  })).sort((a: any, b: any) => b.value - a.value);

  const por_hora = (backend.por_hora || []).map((h: { hora: string; total: number }) => ({
    hora: h.hora,
    total: h.total,
  }));

  const residencia_top = por_residencia[0]?.name ?? '—';
  const situacion_top = por_situacion_laboral[0]?.name ?? '—';
  const sinCobertura = por_cobertura.find((c: any) => c.name === 'Solo salud pública / no tengo cobertura')?.value ?? 0;
  const informal = por_situacion_laboral.find((s: any) =>
    s.name === 'Trabajo informal / en negro' || s.name === 'Desempleado/a (busco trabajo)'
  )?.value ?? 0;

  const alertas: any[] = [];
  const sinCobPct = total ? Math.round((sinCobertura / total) * 100) : 0;
  if (sinCobPct >= 40) {
    alertas.push({
      tipo: 'info',
      mensaje: `${sinCobPct}% de los encuestados no tiene cobertura médica. Reforzar mensaje sobre atención gratuita.`,
    });
  }
  const topImp = top_impedimentos[0];
  if (topImp && (topImp.pct ?? 0) >= 50) {
    alertas.push({
      tipo: 'alta_demanda',
      mensaje: `${topImp.name}: ${topImp.pct}% lo señala como impedimento principal.`,
    });
  }

  return {
    total,
    ultima_hora: 0,
    especialidad_top: residencia_top,
    pct_calle: 0,
    pct_sin_cobertura: sinCobPct,
    procedencia_top: situacion_top,
    con_telefono: informal,
    por_rango_etario,
    por_cobertura,
    por_residencia,
    por_situacion_laboral,
    por_propuestas_barrio,
    top_impedimentos,
    top_urgencias,
    por_hora,
    alertas,
  };
}

function countBy(data: Registro[], key: keyof Registro): KV[] {
  const counts: Record<string, number> = {};
  data.forEach((r) => {
    const v = String(r[key] ?? '').trim() || '(sin dato)';
    counts[v] = (counts[v] ?? 0) + 1;
  });
  const total = data.length || 1;
  return Object.entries(counts)
    .map(([name, value]) => ({ name, value, pct: Math.round((value / total) * 100) }))
    .sort((a, b) => b.value - a.value);
}

// Lector inteligente de arrays de opciones múltiples
function countMultiSelect(data: Registro[], key: 'impedimentos' | 'urgencias' | 'propuestas_barrio', mapa: Record<number, string>): KV[] {
  const counts: Record<string, number> = {};
  data.forEach((r) => {
    const arr = (r as any)[key] as any[] | undefined;
    if (arr && Array.isArray(arr)) {
      arr.forEach((item) => {
        let id = typeof item === 'object' ? item.value : item;
        id = Number(id);
        if (!isNaN(id) && mapa[id]) {
          const label = mapa[id];
          counts[label] = (counts[label] ?? 0) + 1;
        }
      });
    }
  });
  const total = data.length || 1;
  return Object.entries(counts)
    .map(([name, value]) => ({ name, value, pct: Math.round((value / total) * 100) }))
    .sort((a, b) => b.value - a.value);
}

function buildTimeSeries(data: Registro[]): HoraEntry[] {
  const counts: Record<number, number> = {};
  for (let h = 0; h < 24; h++) counts[h] = 0;
  data.forEach((r) => {
    if (r.hora >= 0 && r.hora < 24) counts[r.hora]++;
  });
  return Object.entries(counts).map(([h, total]) => ({
    hora: `${String(h).padStart(2, '0')}:00`,
    total,
  }));
}

export function calcularEstadisticas(data: Registro[]): Estadisticas {
  const total = data.length;
  const ahora = new Date();
  const hoy = data.filter((r) => {
    if (!r.fecha) return false;
    return r.fecha.toDateString() === ahora.toDateString();
  }).length;

  const por_rango_etario = countBy(data, 'rango_etario');
  const por_cobertura = countBy(data, 'cobertura');
  const por_residencia = countBy(data, 'residencia');
  const por_situacion_laboral = countBy(data, 'situacion_laboral');
  
  // Usamos el lector local para no depender de la matemática del servidor
  const top_impedimentos = countMultiSelect(data, 'impedimentos', MAPA_IMPEDIMENTOS);
  const top_urgencias = countMultiSelect(data, 'urgencias', MAPA_URGENCIAS);
  const por_propuestas_barrio = countMultiSelect(data, 'propuestas_barrio', MAPA_PROPUESTAS);
  
  const por_hora = buildTimeSeries(data);

  const residencia_top = por_residencia[0]?.name ?? '—';
  const situacion_top = por_situacion_laboral[0]?.name ?? '—';
  const sinCobertura = por_cobertura.find(c => c.name === 'Solo salud pública / no tengo cobertura')?.value ?? 0;
  const informal = por_situacion_laboral.find(s =>
    s.name === 'Trabajo informal / en negro' || s.name === 'Desempleado/a (busco trabajo)'
  )?.value ?? 0;

  const alertas: Alerta[] = [];
  const sinCobPct = total ? Math.round((sinCobertura / total) * 100) : 0;
  if (sinCobPct >= 40) {
    alertas.push({
      tipo: 'info',
      mensaje: `${sinCobPct}% de los encuestados no tiene cobertura médica. Reforzar mensaje sobre atención gratuita.`,
    });
  }
  const topImp = top_impedimentos[0];
  if (topImp && (topImp.pct ?? 0) >= 50) {
    alertas.push({
      tipo: 'alta_demanda',
      mensaje: `${topImp.name}: ${topImp.pct}% lo señala como impedimento principal.`,
    });
  }

  return {
    total,
    ultima_hora: hoy,
    especialidad_top: residencia_top,
    pct_calle: 0,
    pct_sin_cobertura: sinCobPct,
    procedencia_top: situacion_top,
    con_telefono: informal,
    por_rango_etario,
    por_cobertura,
    por_residencia,
    por_situacion_laboral,
    por_propuestas_barrio,
    top_impedimentos,
    top_urgencias,
    por_hora,
    alertas,
  };
}

export function filtrarRegistros(data: Registro[], filtros: import('../types').Filtros): Registro[] {
  return data.filter((r) => {
    if (filtros.especialidad && r.situacion_laboral !== filtros.especialidad) return false;
    if (filtros.procedencia && r.residencia !== filtros.procedencia) return false;
    if (filtros.cobertura_medica && r.cobertura !== filtros.cobertura_medica) return false;
    if (filtros.localidad && r.localidad_barrio && r.localidad_barrio.toLowerCase() !== filtros.localidad.toLowerCase()) return false;
    if (r.hora < filtros.hora_desde || r.hora > filtros.hora_hasta) return false;
    if (filtros.search) {
      const q = filtros.search.toLowerCase();
      const match =
        r.nombre_completo.toLowerCase().includes(q) ||
        r.dni.includes(q) ||
        (r.localidad_barrio && r.localidad_barrio.toLowerCase().includes(q)) ||
        r.residencia.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });
}