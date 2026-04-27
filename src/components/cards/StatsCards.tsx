import { Users, Clock, Stethoscope, Home, ShieldOff, MapPin, Phone } from 'lucide-react';
import StatCard from './StatCard';
import { useData } from '../../context/DataContext';

export default function StatsCards() {
  const { stats } = useData();

  const cards = [
    {
      title: 'Total registros',
      value: stats.total,
      subtitle: 'personas atendidas',
      icon: Users,
      color: 'blue' as const,
    },
    {
      title: 'Última hora',
      value: stats.ultima_hora,
      subtitle: 'registros en los últimos 60 min',
      icon: Clock,
      color: 'cyan' as const,
    },
    {
      title: 'Especialidad top',
      value: stats.especialidad_top,
      subtitle: `${stats.por_especialidad[0]?.value ?? 0} personas · ${stats.por_especialidad[0]?.pct ?? 0}%`,
      icon: Stethoscope,
      color: 'white' as const,
    },
    {
      title: 'Situación de calle',
      value: `${stats.pct_calle}%`,
      subtitle: `${stats.por_calle.find(e => e.name === 'Sí')?.value ?? 0} personas`,
      icon: Home,
      color: stats.pct_calle >= 15 ? 'red' as const : 'amber' as const,
    },
    {
      title: 'Sin cobertura médica',
      value: `${stats.pct_sin_cobertura}%`,
      subtitle: `${stats.por_cobertura.find(e => e.name === 'No')?.value ?? 0} personas`,
      icon: ShieldOff,
      color: 'purple' as const,
    },
    {
      title: 'Procedencia principal',
      value: stats.procedencia_top,
      subtitle: `${stats.por_procedencia[0]?.value ?? 0} personas · ${stats.por_procedencia[0]?.pct ?? 0}%`,
      icon: MapPin,
      color: 'white' as const,
    },
    {
      title: 'Con teléfono',
      value: stats.con_telefono,
      subtitle: `de ${stats.total} registros`,
      icon: Phone,
      color: 'green' as const,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-7 gap-3">
      {cards.map((c, i) => (
        <StatCard key={c.title} {...c} index={i} />
      ))}
    </div>
  );
}
