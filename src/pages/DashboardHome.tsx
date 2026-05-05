import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import StatsCards from '../components/cards/StatsCards';
import FiltersBar from '../components/filters/FiltersBar';
import AlertBanner from '../components/common/AlertBanner';
import SituacionLaboralChart from '../components/charts/SituacionLaboralChart';
import TimeSeriesChart from '../components/charts/TimeSeriesChart';
import OriginChart from '../components/charts/OriginChart';
import RangoEtarioChart from '../components/charts/RangoEtarioChart';
import CoverageChart from '../components/charts/CoverageChart';
import ImpedimentosChart from '../components/charts/ImpedimentosChart';
import UrgenciasChart from '../components/charts/UrgenciasChart';
import RecordsTable from '../components/table/RecordsTable';

const section = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

export default function DashboardHome() {
  const { stats, filteredData, usingMock, isInternalView } = useData();

  return (
    <motion.div
      key="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-5"
    >
      {usingMock && (
        <motion.div {...section} className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3 flex items-center gap-3 text-sm text-amber-800">
          <span className="font-semibold">Datos de prueba activos.</span>
          <span>Para conectar con la base de datos, configurá las variables de entorno en .env.local</span>
        </motion.div>
      )}

      {stats.alertas.length > 0 && (
        <motion.div {...section}>
          <AlertBanner alertas={stats.alertas} />
        </motion.div>
      )}

      <motion.div {...section} transition={{ delay: 0.05 }}>
        <StatsCards />
      </motion.div>

      {/* Client view: only 3 charts they care about */}
      {!isInternalView && (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <motion.div {...section} transition={{ delay: 0.15 }} className="card">
              <SituacionLaboralChart data={stats.por_situacion_laboral} />
            </motion.div>
            <motion.div {...section} transition={{ delay: 0.2 }} className="card">
              <ImpedimentosChart data={stats.top_impedimentos} />
            </motion.div>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <motion.div {...section} transition={{ delay: 0.25 }} className="card">
              <UrgenciasChart data={stats.top_urgencias} />
            </motion.div>
          </div>
        </>
      )}

      {/* Internal view: everything */}
      {isInternalView && (
        <>
          <motion.div {...section} transition={{ delay: 0.1 }}>
            <FiltersBar />
          </motion.div>

          {/* Row 1: Situación Laboral + Time Series */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <motion.div {...section} transition={{ delay: 0.15 }} className="card">
              <SituacionLaboralChart data={stats.por_situacion_laboral} />
            </motion.div>
            <motion.div {...section} transition={{ delay: 0.2 }} className="card">
              <TimeSeriesChart data={stats.por_hora} />
            </motion.div>
          </div>

          {/* Row 2: Residencia + Rango Etario + Cobertura */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            <motion.div {...section} transition={{ delay: 0.22 }} className="card">
              <OriginChart data={stats.por_residencia} />
            </motion.div>
            <motion.div {...section} transition={{ delay: 0.24 }} className="card">
              <RangoEtarioChart data={stats.por_rango_etario} />
            </motion.div>
            <motion.div {...section} transition={{ delay: 0.26 }} className="card">
              <CoverageChart data={stats.por_cobertura} />
            </motion.div>
          </div>

          {/* Row 3: Impedimentos + Urgencias */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <motion.div {...section} transition={{ delay: 0.28 }} className="card">
              <ImpedimentosChart data={stats.top_impedimentos} />
            </motion.div>
            <motion.div {...section} transition={{ delay: 0.30 }} className="card">
              <UrgenciasChart data={stats.top_urgencias} />
            </motion.div>
          </div>

          {/* Records table */}
          <motion.div {...section} transition={{ delay: 0.35 }} className="card">
            <RecordsTable data={filteredData} title="Todos los registros" maxRows={25} />
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
