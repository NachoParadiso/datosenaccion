import { Registro, Estadisticas, KV, HoraEntry, Alerta } from '../types';
import { rangoEtario } from './normalize';

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

function countEdad(data: Registro[]): KV[] {
  const order = ['0–12', '13–17', '18–29', '30–44', '45–59', '60–74', '75+', 'Sin dato'];
  const counts: Record<string, number> = {};
  order.forEach((r) => (counts[r] = 0));
  data.forEach((r) => { const rng = rangoEtario(r.edad); counts[rng] = (counts[rng] ?? 0) + 1; });
  return order.map((name) => ({ name, value: counts[name] ?? 0 }));
}

function buildTimeSeries(data: Registro[]): HoraEntry[] {
  const counts: Record<number, number> = {};
  for (let h = 0; h < 24; h++) counts[h] = 0;
  data.forEach((r) => { if (r.hora >= 0 && r.hora < 24) counts[r.hora]++; });
  return Object.entries(counts).map(([h, total]) => ({
    hora: `${String(h).padStart(2, '0')}:00`,
    total,
  }));
}

function buildAlertas(data: Registro[], por_especialidad: KV[]): Alerta[] {
  const alertas: Alerta[] = [];
  const total = data.length;
  if (!total) return alertas;

  por_especialidad.forEach(({ name, pct }) => {
    if ((pct ?? 0) >= 30) {
      alertas.push({ tipo: 'alta_demanda', mensaje: `Alta demanda en ${name}: ${pct}% del total`, especialidad: name });
    }
  });

  const calle = data.filter((r) => r.situacion_calle === 'Sí').length;
  if (calle / total >= 0.15) {
    alertas.push({
      tipo: 'situacion_calle',
      mensaje: `${calle} personas en situación de calle (${Math.round((calle / total) * 100)}% del total). Activar protocolo de derivación social.`,
    });
  }

  return alertas;
}

export function calcularEstadisticas(data: Registro[]): Estadisticas {
  const total = data.length;

  const ahora = new Date();
  const ultima_hora = data.filter((r) => {
    if (!r.fecha) return false;
    return ahora.getTime() - r.fecha.getTime() < 3600_000;
  }).length;

  const por_especialidad = countBy(data, 'especialidad');
  const por_procedencia = countBy(data, 'procedencia');
  const por_hora = buildTimeSeries(data);
  const por_edad = countEdad(data);
  const por_genero = countBy(data, 'genero');
  const por_cobertura = countBy(data, 'cobertura_medica');
  const por_calle = countBy(data, 'situacion_calle');
  const por_localidad = countBy(data, 'localidad_barrio');

  const especialidad_top = por_especialidad[0]?.name ?? '—';
  const procedencia_top = por_procedencia[0]?.name ?? '—';
  const calle_si = data.filter((r) => r.situacion_calle === 'Sí').length;
  const sin_cobertura = data.filter((r) => r.cobertura_medica === 'No').length;
  const con_telefono = data.filter((r) => r.telefono !== 'Sin teléfono' && r.telefono.trim()).length;

  const alertas = buildAlertas(data, por_especialidad);

  return {
    total,
    ultima_hora,
    especialidad_top,
    pct_calle: total ? Math.round((calle_si / total) * 100) : 0,
    pct_sin_cobertura: total ? Math.round((sin_cobertura / total) * 100) : 0,
    procedencia_top,
    con_telefono,
    por_especialidad,
    por_procedencia,
    por_hora,
    por_edad,
    por_genero,
    por_cobertura,
    por_calle,
    por_localidad,
    alertas,
  };
}

export function filtrarRegistros(data: Registro[], filtros: import('../types').Filtros): Registro[] {
  return data.filter((r) => {
    if (filtros.especialidad && r.especialidad !== filtros.especialidad) return false;
    if (filtros.procedencia && r.procedencia !== filtros.procedencia) return false;
    if (filtros.situacion_calle && r.situacion_calle !== filtros.situacion_calle) return false;
    if (filtros.cobertura_medica && r.cobertura_medica !== filtros.cobertura_medica) return false;
    if (filtros.genero && r.genero !== filtros.genero) return false;
    if (filtros.localidad && r.localidad_barrio.toLowerCase() !== filtros.localidad.toLowerCase()) return false;
    if (r.hora < filtros.hora_desde || r.hora > filtros.hora_hasta) return false;
    if (filtros.search) {
      const q = filtros.search.toLowerCase();
      const match =
        r.nombre_completo.toLowerCase().includes(q) ||
        r.dni.includes(q) ||
        r.telefono.includes(q) ||
        r.localidad_barrio.toLowerCase().includes(q) ||
        r.especialidad.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });
}
