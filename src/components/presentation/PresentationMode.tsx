import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Activity, Users, Briefcase, Stethoscope, AlertTriangle, RefreshCw, LogIn } from 'lucide-react';
import { useData } from '../../context/DataContext';
import SituacionLaboralChart from '../charts/SituacionLaboralChart';
import ImpedimentosChart from '../charts/ImpedimentosChart';
import UrgenciasChart from '../charts/UrgenciasChart';
import LastUpdateBadge from '../common/LastUpdateBadge';
import LoginModal from '../common/LoginModal';

function BigStat({ label, value, sub, icon: Icon, color }: { label: string; value: string | number; sub?: string; icon: typeof Users; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-3xl p-6 flex flex-col items-center justify-center gap-1 ${color}`}
    >
      <Icon size={24} />
      <motion.span
        key={String(value)}
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        className="text-4xl font-black text-center"
      >
        {value}
      </motion.span>
      {sub && <span className="text-xs font-medium opacity-80 text-center">{sub}</span>}
      <span className="text-xs font-medium opacity-70 text-center mt-1">{label}</span>
    </motion.div>
  );
}

export default function PresentationMode() {
  const { stats, status, lastUpdate, usingMock, refresh, isInternalView, loginInternal, logoutInternal } = useData();
  const [showLogin, setShowLogin] = useState(false);

  if (!stats) {
    return (
      <div className="fixed inset-0 bg-uba-blue z-50 flex items-center justify-center">
        <p className="text-white text-lg">Cargando estadísticas...</p>
      </div>
    );
  }

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
          {/* Internal access button */}
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
         {/* Big stats - consistent format */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
           <BigStat label="Personas encuestadas" value={stats.total} sub="total registros" icon={Users} color="bg-white text-uba-blue" />
           <BigStat label="Sin cobertura médica" value={stats.total > 0 ? Math.round(stats.pct_sin_cobertura * stats.total / 100) : 0} sub={`${stats.pct_sin_cobertura}% del total`} icon={Stethoscope} color={stats.pct_sin_cobertura >= 40 ? 'bg-red-500 text-white' : 'bg-violet-500 text-white'} />
           <BigStat label="Informal / desempleado" value={stats.con_telefono} sub="situación laboral" icon={Briefcase} color="bg-amber-400 text-amber-900" />
           <BigStat label="Top impedimento" value={stats.top_impedimentos[0]?.name ?? '—'} sub={`${stats.top_impedimentos[0]?.pct ?? 0}%`} icon={AlertTriangle} color="bg-uba-cyan text-white" />
         </div>

         {/* 3-column layout by theme */}
         <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
           {/* Social column */}
           <div className="bg-white/10 backdrop-blur rounded-3xl p-6">
             <h4 className="text-white/70 text-xs font-medium uppercase tracking-wider mb-4">Social</h4>
             <SituacionLaboralChart data={stats.por_situacion_laboral} />
           </div>

           {/* Economic column */}
           <div className="bg-white/10 backdrop-blur rounded-3xl p-6">
             <h4 className="text-white/70 text-xs font-medium uppercase tracking-wider mb-4">Económica</h4>
             <ImpedimentosChart data={stats.top_impedimentos} />
           </div>

           {/* Political/Urgent column */}
           <div className="bg-white/10 backdrop-blur rounded-3xl p-6">
             <h4 className="text-white/70 text-xs font-medium uppercase tracking-wider mb-4">Política / Urgente</h4>
             <UrgenciasChart data={stats.top_urgencias} />
           </div>
         </div>

         {/* Internal-only content (visible after login) */}
         {isInternalView && (
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="bg-white/10 backdrop-blur rounded-3xl p-6"
           >
             <h3 className="text-white text-lg font-bold mb-4">Vista Interna (Solo visible después del login)</h3>
             <p className="text-blue-200 text-sm">Aquí irían los gráficos y datos adicionales para el equipo interno.</p>
             {/* Podés agregar más gráficos acá */}
           </motion.div>
         )}
       </div>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </motion.div>
  );
}
