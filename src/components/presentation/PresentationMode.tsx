import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Activity, RefreshCw, LogIn } from 'lucide-react';
import { useData } from '../../context/DataContext';
import StatsCards from '../cards/StatsCards';
import SituacionLaboralChart from '../charts/SituacionLaboralChart';
import ImpedimentosChart from '../charts/ImpedimentosChart';
import UrgenciasRanking from '../charts/UrgenciasRanking';
import TimeSeriesChart from '../charts/TimeSeriesChart';
import OriginChart from '../charts/OriginChart';
import RangoEtarioChart from '../charts/RangoEtarioChart';
import AgeDistributionChart from '../charts/AgeDistributionChart';
import CoverageDonutChart from '../charts/CoverageDonutChart';
import LastUpdateBadge from '../common/LastUpdateBadge';
import LoginModal from '../common/LoginModal';
import { useParams } from 'react-router-dom';

export default function PresentationMode() {
  const { id } = useParams(); // Capturamos el ID del barrio de la URL
  const { stats, status, lastUpdate, usingMock, refresh, isInternalView, loginInternal, logoutInternal } = useData();
  const [showLogin, setShowLogin] = useState(false);

  // EFECTO MÁGICO REAL: Cuando la página carga o cambia el ID, re-ejecutamos la consulta con el filtro
  useEffect(() => {
    if (id) {
      refresh(id);
    }
  }, [id, refresh]);

  const total = stats?.total || 0;
  const horasConDatos = (stats?.por_hora || []).filter(h => (h.total || 0) > 0);
  const promedioHora = horasConDatos.length > 0 ? Math.round(total / horasConDatos.length) : 0;

  if (!stats || status === 'loading') {
    return (
      <div className="fixed inset-0 bg-slate-900 z-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <RefreshCw size={40} className="text-blue-500 animate-spin mx-auto" />
          <p className="text-white text-lg font-medium">Cargando estadísticas filtradas...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gray-100 z-50 overflow-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <Activity size={28} className="text-blue-800" />
          <div>
            <h1 className="text-2xl font-black text-blue-800">UBA en Acción</h1>
            <p className="text-blue-500 text-sm">Monitoreo en vivo - {total} encuestados - {promedioHora} promedio / hora</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <LastUpdateBadge status={status} lastUpdate={lastUpdate} usingMock={usingMock}/>
          <button onClick={() => refresh(id)} className="p-2 rounded-lg bg-blue-700 hover:bg-blue-600 text-white transition-colors">
            <RefreshCw size={16} className={status === 'ok' ? '' : 'animate-spin'} />
          </button>
          {isInternalView ? (
            <button
              onClick={logoutInternal}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-medium transition-colors"
            >
              <X size={15} />
              Salir interno
            </button>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="p-2 rounded-lg bg-blue-700 hover:bg-blue-600 text-white transition-colors"
              title="Acceso interno"
            >
              <LogIn size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="p-8 space-y-8">
        <StatsCards />

        {/* Layout de gráficos */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h4 className="text-blue-900 font-bold uppercase tracking-wider mb-4 text-center">Social</h4>
            <SituacionLaboralChart data={stats.por_propuestas_barrio} />
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h4 className="text-blue-900 font-bold uppercase tracking-wider mb-4 text-center">Económica</h4>
            <ImpedimentosChart data={stats.top_impedimentos} />
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h4 className="text-blue-900 font-bold uppercase tracking-wider mb-4 text-center">Política / Urgente</h4>
            <UrgenciasRanking data={stats.top_urgencias} />
          </div>
        </div>

        {/* Contenido protegido interno */}
        {isInternalView && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h3 className="text-blue-900 text-lg font-bold">Dashboard Interno</h3>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <TimeSeriesChart data={stats.por_hora} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <RangoEtarioChart data={stats.por_rango_etario} />
              </div>
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <AgeDistributionChart data={stats.por_rango_etario} />
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <OriginChart data={stats.por_residencia} title="¿Dónde vivís?" />
              </div>
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <CoverageDonutChart data={stats.por_cobertura} />
              </div>
            </div>
          </motion.div>
        )}
      </div>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </motion.div>
  );
}