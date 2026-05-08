import { Stethoscope, Briefcase, AlertTriangle } from 'lucide-react';
import StatCard from './StatCard';
import { useData } from '../../context/DataContext';

export default function StatsCards() {
  const { stats } = useData();

  if (!stats) {
    return <div className="text-center text-gray-500 py-8">Cargando estadísticas...</div>;
  }

  const total = stats.total || 0;

  const sinCoberturaItem = (stats.por_cobertura || []).find(c =>
    c.name === 'Solo salud pública / no tengo cobertura'
  );
  const sinCoberturaCount = sinCoberturaItem?.value ?? 0;
  const sinCoberturaPct = total > 0 ? Math.round((sinCoberturaCount / total) * 100) : 0;

  const pamiItem = (stats.por_cobertura || []).find(c => c.name === 'PAMI');
  const pamiCount = pamiItem?.value ?? 0;
  const pamiPct = total > 0 ? Math.round((pamiCount / total) * 100) : 0;

  const informal = (stats.por_situacion_laboral || []).find(s =>
    s.name === 'Trabajo informal / en negro'
  )?.value ?? 0;
  const desempleo = (stats.por_situacion_laboral || []).find(s =>
    s.name === 'Desempleado/a (busco trabajo)'
  )?.value ?? 0;
  const precarizadosPct = total > 0 ? Math.round(((informal + desempleo) / total) * 100) : 0;

  const dependencia = (stats.por_situacion_laboral || []).find(s =>
    s.name === 'Empleado/a en relación de dependencia'
  )?.value ?? 0;
  const dependenciaPct = total > 0 ? Math.round((dependencia / total) * 100) : 0;

  const topImp = (stats.top_impedimentos || [])[0];
  const topImpName = topImp?.name ?? '—';
  const topImpPct = topImp?.pct ?? 0;

  const llegaBienItem = (stats.top_impedimentos || []).find(i =>
    i.name === 'Llego a fin de mes sin problemas'
  );
  const llegaBienValue = llegaBienItem?.value ?? 0;
  const llegaBienPct = total > 0 ? Math.round((llegaBienValue / total) * 100) : 0;

  const cards = [
    {
      title: 'Sin cobertura médica',
      value: `${sinCoberturaPct}%`,
      subtitle: `${sinCoberturaCount} personas · ${pamiPct}% con PAMI`,
      icon: Stethoscope,
      color: sinCoberturaPct >= 40 ? 'red' as const : 'violet' as const,
    },
    {
      title: 'Informal / desempregado',
      value: `${precarizadosPct}%`,
      subtitle: `Solo ${dependenciaPct}% en relación de dependencia`,
      icon: Briefcase,
      color: 'amber' as const,
    },
    {
      title: 'Top impedimento',
      value: topImpName,
      subtitle: undefined,
      icon: AlertTriangle,
      color: 'cyan' as const,
    },
  ];

  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {cards.map((c, i) => (
        <div key={c.title} className="w-full sm:w-auto sm:min-w-[280px] sm:max-w-[340px]">
          <StatCard {...c} index={i} />
        </div>
      ))}
    </div>
  );
}