import { Users, Calendar, MapPin, Stethoscope, Briefcase, AlertTriangle } from 'lucide-react';
import StatCard from './StatCard';
import { useData } from '../../context/DataContext';

export default function StatsCards() {
  const { stats } = useData();

  const cards = [
    {
      title: 'Total registros',
      value: stats.total,
      subtitle: 'personas encuestadas',
      icon: Users,
      color: 'blue' as const,
    },
    {
      title: 'Registros hoy',
      value: stats.ultima_hora,
      subtitle: 'en la fecha de hoy',
      icon: Calendar,
      color: 'cyan' as const,
    },
    {
      title: 'Residencia top',
      value: stats.por_residencia[0]?.name ?? '—',
      subtitle: 'de dónde vienen la mayoría',
      icon: MapPin,
      color: 'emerald' as const,
    },
    {
      title: 'Sin cobertura médica',
      value: `${stats.pct_sin_cobertura}%`,
      subtitle: 'crítico para salud pública',
      icon: Stethoscope,
      color: stats.pct_sin_cobertura >= 40 ? 'red' as const : 'violet' as const,
    },
    {
      title: 'Informal / desempleado',
      value: stats.con_telefono,
      subtitle: 'vulnerabilidad laboral',
      icon: Briefcase,
      color: 'amber' as const,
    },
    {
      title: 'Situación laboral top',
      value: stats.por_situacion_laboral[0]?.name ?? '—',
      subtitle: 'categoría laboral más frecuente',
      icon: Briefcase,
      color: 'blue' as const,
    },
    {
      title: 'Top impedimento',
      value: stats.top_impedimentos[0]?.name ?? '—',
      subtitle: 'principal obstáculo financiero',
      icon: AlertTriangle,
      color: 'cyan' as const,
    },
  ];

  return (
    <div className="flex flex-wrap gap-6 justify-center sm:justify-start">
      {cards.map((c, i) => (
        <div key={c.title} className="w-full sm:w-auto sm:min-w-[280px] sm:max-w-[340px]">
          <StatCard {...c} index={i} />
        </div>
      ))}
    </div>
  );
}
