import { Registro, Estadisticas, KV, HoraEntry, Alerta } from '../types';

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

function countMultiSelect(data: Registro[], key: 'impedimentos' | 'urgencias'): KV[] {
  const counts: Record<string, number> = {};
  data.forEach((r) => {
    const arr = r[key] as string[] | undefined;
    if (arr && Array.isArray(arr)) {
      arr.forEach((item) => {
        const v = item.trim();
        if (v) counts[v] = (counts[v] ?? 0) + 1;
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

function buildAlertas(data: Registro[], por_cobertura: KV[]): Alerta[] {
  const alertas: Alerta[] = [];
  const total = data.length;
  if (!total) return alertas;

  const sinCobertura = por_cobertura.find(c => c.name === 'Solo salud pública / no tengo cobertura');
  const sinCoberturaPct = sinCobertura?.pct ?? 0;
  if (sinCoberturaPct >= 40) {
    alertas.push({
      tipo: 'info',
      mensaje: `${sinCoberturaPct}% de los encuestados no tiene cobertura médica. Reforzar mensaje sobre atención gratuita.`,
    });
  }

  const topImpedimento = countMultiSelect(data, 'impedimentos')[0];
  if (topImpedimento) {
    const impPct = topImpedimento.pct ?? 0;
    if (impPct >= 50) {
      alertas.push({
        tipo: 'alta_demanda',
        mensaje: `${topImpedimento.name}: ${impPct}% lo señala como impedimento principal.`,
      });
    }
  }

  return alertas;
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
  const por_impedimentos = countMultiSelect(data, 'impedimentos');
  const por_urgencias = countMultiSelect(data, 'urgencias');
  const por_hora = buildTimeSeries(data);
  const por_localidad = countBy(data, 'localidad_barrio');

  const residencia_top = por_residencia[0]?.name ?? '—';
  const situacion_top = por_situacion_laboral[0]?.name ?? '—';
  const sinCobertura = por_cobertura.find(c => c.name === 'Solo salud pública / no tengo cobertura')?.value ?? 0;
  const informal = por_situacion_laboral.find(s =>
    s.name === 'Trabajo informal / en negro' || s.name === 'Desempleado/a (busco trabajo)'
  )?.value ?? 0;

  const alertas = buildAlertas(data, por_cobertura);

  return {
    total,
    ultima_hora: hoy,
    especialidad_top: residencia_top,
    pct_calle: 0,
    pct_sin_cobertura: total ? Math.round((sinCobertura / total) * 100) : 0,
    procedencia_top: situacion_top,
    con_telefono: informal,
    por_especialidad: por_situacion_laboral,
    por_procedencia: por_residencia,
    por_hora,
    por_edad: por_rango_etario,
    por_genero: por_impedimentos,
    por_cobertura,
    por_calle: por_urgencias,
    por_localidad,
    alertas,
  };
}

export function filtrarRegistros(data: Registro[], filtros: import('../types').Filtros): Registro[] {
  return data.filter((r) => {
    if (filtros.especialidad && r.situacion_laboral !== filtros.especialidad) return false;
    if (filtros.procedencia && r.residencia !== filtros.procedencia) return false;
    if (filtros.cobertura_medica && r.cobertura !== filtros.cobertura_medica) return false;
    if (filtros.localidad && r.localidad_barrio.toLowerCase() !== filtros.localidad.toLowerCase()) return false;
    if (r.hora < filtros.hora_desde || r.hora > filtros.hora_hasta) return false;
    if (filtros.search) {
      const q = filtros.search.toLowerCase();
      const match =
        r.nombre_completo.toLowerCase().includes(q) ||
        r.dni.includes(q) ||
        r.localidad_barrio.toLowerCase().includes(q) ||
        r.residencia.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });
}
