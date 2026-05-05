import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, TrendingUp, Home } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { calcularEstadisticas } from '../../utils/statistics';
import { useMemo } from 'react';
import StatCard from '../cards/StatCard';
import OriginChart from '../charts/OriginChart';
import AgeDistributionChart from '../charts/AgeDistributionChart';
import StreetSituationChart from '../charts/StreetSituationChart';
import CoverageChart from '../charts/CoverageChart';
import TimeSeriesChart from '../charts/TimeSeriesChart';
import NeighborhoodChart from '../charts/NeighborhoodChart';
import RecordsTable from '../table/RecordsTable';

export default function SpecialtyDetail() {
  const { nombre } = useParams<{ nombre: string }>();
  const navigate = useNavigate();
  const { rawData, stats: globalStats } = useData();

  const especialidad = decodeURIComponent(nombre ?? '');

  const data = useMemo(
    () => rawData.filter((r) => r.especialidad === especialidad),
    [rawData, especialidad]
  );

  const stats = useMemo(() => calcularEstadisticas(data), [data]);

  const pct = globalStats.total > 0 ? Math.round((data.length / globalStats.total) * 100) : 0;
  const calleCount = data.filter((r) => r.situacion_calle === 'Sí').length;

  return (
    <motion.div
      key={especialidad}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-uba-blue transition-colors group"
        >
          <motion.span whileHover={{ x: -3 }}>
            <ArrowLeft size={16} />
          </motion.span>
          Volver al dashboard
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="bg-uba-blue rounded-xl p-2.5">
              <TrendingUp size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-uba-blue">{especialidad}</h1>
              <p className="text-sm text-slate-500">Vista detallada de la especialidad</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge bg-uba-blue text-white text-sm px-3 py-1">{data.length} personas</span>
          <span className="badge bg-blue-100 text-uba-blue text-sm px-3 py-1">{pct}% del total</span>
          {calleCount > 0 && (
            <span className="badge bg-red-100 text-red-700 text-sm px-3 py-1 flex items-center gap-1">
              <Home size={12} /> {calleCount} en situación de calle
            </span>
          )}
        </div>
      </div>

      {data.length === 0 ? (
        <div className="card text-center py-16 text-slate-400">
          <p className="text-lg font-medium">No hay registros para "{especialidad}"</p>
          <p className="text-sm mt-1">Verificá el nombre o revisá los filtros activos</p>
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard title="Total" value={data.length} icon={Users} color="blue" index={0} />
            <StatCard title="% del operativo" value={`${pct}%`} icon={TrendingUp} color="cyan" index={1} />
            <StatCard title="Situación de calle" value={calleCount} icon={Home} color={calleCount > 0 ? 'red' : 'white'} index={2} />
            <StatCard title="Sin cobertura" value={stats.por_cobertura.find((e) => e.name === 'No')?.value ?? 0} color="amber" index={3} />
          </div>

          {/* Charts grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="card">
              <TimeSeriesChart data={stats.por_hora} />
            </div>
            <div className="card">
              <OriginChart data={stats.por_residencia} title="Residencia en esta especialidad" />
            </div>
            <div className="card">
              <AgeDistributionChart data={stats.por_rango_etario} />
            </div>
            <div className="card">
              <StreetSituationChart data={stats.por_situacion_laboral} />
            </div>
            <div className="card">
              <CoverageChart data={stats.por_cobertura} />
            </div>
            <div className="card">
              <NeighborhoodChart data={stats.por_residencia} topN={8} />
            </div>
          </div>

          {/* Records table */}
          <div className="card">
            <RecordsTable data={data} title={`Registros de ${especialidad}`} maxRows={20} />
          </div>
        </>
      )}
    </motion.div>
  );
}
