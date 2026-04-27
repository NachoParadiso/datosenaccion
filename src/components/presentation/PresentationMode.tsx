import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Activity, Users, Clock, Stethoscope, Home, RefreshCw } from 'lucide-react';
import { useData } from '../../context/DataContext';
import TimeSeriesChart from '../charts/TimeSeriesChart';
import SpecialtyChart from '../charts/SpecialtyChart';
import OriginChart from '../charts/OriginChart';
import StreetSituationChart from '../charts/StreetSituationChart';
import LastUpdateBadge from '../common/LastUpdateBadge';

function BigStat({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: typeof Users; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-3xl p-6 flex flex-col items-center justify-center gap-2 ${color}`}
    >
      <Icon size={28} />
      <motion.span
        key={String(value)}
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        className="text-5xl font-black"
      >
        {value}
      </motion.span>
      <span className="text-sm font-medium opacity-80 text-center">{label}</span>
    </motion.div>
  );
}

export default function PresentationMode() {
  const { stats, status, lastUpdate, usingMock, setPresentationMode, refresh } = useData();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPresentationMode(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [setPresentationMode]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-uba-blue z-50 overflow-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-blue-700">
        <div className="flex items-center gap-3">
          <Activity size={28} className="text-white" />
          <div>
            <h1 className="text-2xl font-black text-white">UBA en Acción</h1>
            <p className="text-blue-300 text-sm">Monitoreo en vivo del operativo</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <LastUpdateBadge status={status} lastUpdate={lastUpdate} usingMock={usingMock} />
          <button onClick={refresh} className="p-2 rounded-lg bg-blue-700 hover:bg-blue-600 text-white">
            <RefreshCw size={16} className={status === 'loading' ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => setPresentationMode(false)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-xl text-sm font-medium transition-colors"
          >
            <X size={15} />
            Salir (Esc)
          </button>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Big stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <BigStat label="Personas registradas" value={stats.total} icon={Users} color="bg-white text-uba-blue" />
          <BigStat label="Última hora" value={stats.ultima_hora} icon={Clock} color="bg-uba-cyan text-white" />
          <BigStat label="Situación de calle" value={`${stats.pct_calle}%`} icon={Home} color={stats.pct_calle >= 15 ? 'bg-red-500 text-white' : 'bg-amber-400 text-amber-900'} />
          <BigStat label="Sin cobertura médica" value={`${stats.pct_sin_cobertura}%`} icon={Stethoscope} color="bg-violet-500 text-white" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          <div className="xl:col-span-3 bg-white/10 backdrop-blur rounded-3xl p-6">
            <div className="[&_h3]:text-white [&_.recharts-text]:fill-white [&_.recharts-cartesian-axis-tick-value]:fill-white/70">
              <SpecialtyChart data={stats.por_especialidad} title="Especialidades" />
            </div>
          </div>
          <div className="xl:col-span-2 bg-white/10 backdrop-blur rounded-3xl p-6">
            <div className="[&_h3]:text-white">
              <OriginChart data={stats.por_procedencia} title="Procedencia" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white/10 backdrop-blur rounded-3xl p-6">
            <div className="[&_h3]:text-white [&_.recharts-text]:fill-white/70">
              <TimeSeriesChart data={stats.por_hora} />
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-3xl p-6">
            <div className="[&_h3]:text-white">
              <StreetSituationChart data={stats.por_calle} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
