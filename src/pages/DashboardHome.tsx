import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import StatsCards from '../components/cards/StatsCards';
import FiltersBar from '../components/filters/FiltersBar';
import AlertBanner from '../components/common/AlertBanner';
import SpecialtyChart from '../components/charts/SpecialtyChart';
import TimeSeriesChart from '../components/charts/TimeSeriesChart';
import OriginChart from '../components/charts/OriginChart';
import StreetSituationChart from '../components/charts/StreetSituationChart';
import AgeDistributionChart from '../components/charts/AgeDistributionChart';
import CoverageChart from '../components/charts/CoverageChart';
import GenderChart from '../components/charts/GenderChart';
import NeighborhoodChart from '../components/charts/NeighborhoodChart';
import RecordsTable from '../components/table/RecordsTable';

const section = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

export default function DashboardHome() {
  const { stats, filteredData, usingMock } = useData();

  return (
    <motion.div
      key="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-5"
    >
      {/* Mock data notice */}
      {usingMock && (
        <motion.div {...section} className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3 flex items-center gap-3 text-sm text-amber-800">
          <span className="font-semibold">Datos de prueba activos.</span>
          <span>Para conectar tu Google Sheet, hacé clic en el ícono de configuración ⚙ en el header.</span>
        </motion.div>
      )}

      {/* Alertas */}
      {stats.alertas.length > 0 && (
        <motion.div {...section}>
          <AlertBanner alertas={stats.alertas} />
        </motion.div>
      )}

      {/* KPI Cards */}
      <motion.div {...section} transition={{ delay: 0.05 }}>
        <StatsCards />
      </motion.div>

      {/* Filters */}
      <motion.div {...section} transition={{ delay: 0.1 }}>
        <FiltersBar />
      </motion.div>

      {/* Row 1: Specialty (large) + Time series (large) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <motion.div {...section} transition={{ delay: 0.15 }} className="card">
          <SpecialtyChart data={stats.por_especialidad} />
        </motion.div>
        <motion.div {...section} transition={{ delay: 0.2 }} className="card">
          <TimeSeriesChart data={stats.por_hora} />
        </motion.div>
      </div>

      {/* Row 2: Origin + Street situation + Gender */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        <motion.div {...section} transition={{ delay: 0.22 }} className="card">
          <OriginChart data={stats.por_procedencia} />
        </motion.div>
        <motion.div {...section} transition={{ delay: 0.24 }} className="card">
          <StreetSituationChart data={stats.por_calle} />
        </motion.div>
        <motion.div {...section} transition={{ delay: 0.26 }} className="card sm:col-span-2 xl:col-span-1">
          <GenderChart data={stats.por_genero} />
        </motion.div>
      </div>

      {/* Row 3: Age + Coverage + Neighborhoods */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        <motion.div {...section} transition={{ delay: 0.28 }} className="card">
          <AgeDistributionChart data={stats.por_edad} />
        </motion.div>
        <motion.div {...section} transition={{ delay: 0.30 }} className="card">
          <CoverageChart data={stats.por_cobertura} />
        </motion.div>
        <motion.div {...section} transition={{ delay: 0.32 }} className="card sm:col-span-2 xl:col-span-1">
          <NeighborhoodChart data={stats.por_localidad} />
        </motion.div>
      </div>

      {/* Records table */}
      <motion.div {...section} transition={{ delay: 0.35 }} className="card">
        <RecordsTable data={filteredData} title="Todos los registros" maxRows={25} />
      </motion.div>
    </motion.div>
  );
}
