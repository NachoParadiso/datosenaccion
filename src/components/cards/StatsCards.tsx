import { Users, Calendar } from 'lucide-react';
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
