import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { RefreshCw, Settings, Maximize2, Download, FileSpreadsheet, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { useData } from '../../context/DataContext';
import LastUpdateBadge from '../common/LastUpdateBadge';
import ConfigModal from '../common/ConfigModal';
import { exportRegistrosCSV, exportResumenCSV } from '../../utils/export';

export default function Header() {
  const { status, lastUpdate, usingMock, refresh, stats, filteredData, setPresentationMode } = useData();
  const [showConfig, setShowConfig] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const location = useLocation();

  const isDetail = location.pathname.startsWith('/especialidad');

  return (
    <>
      <header className="bg-uba-blue text-white sticky top-0 z-40 shadow-lg">
        {/* Main bar */}
        <div className="max-w-screen-2xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          {/* Logo + title */}
          <Link to="/" className="flex items-center gap-3 min-w-0">
            <div className="bg-white rounded-lg p-1.5 flex-shrink-0">
              <Activity size={20} className="text-uba-blue" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-base leading-tight truncate">UBA en Acción</p>
              <p className="text-blue-200 text-xs leading-tight hidden sm:block">Monitoreo en vivo del operativo</p>
            </div>
          </Link>

          {/* Status badge */}
          <div className="hidden md:flex items-center gap-3">
            <LastUpdateBadge status={status} lastUpdate={lastUpdate} usingMock={usingMock} />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={refresh}
              className="p-2 rounded-lg hover:bg-blue-700 transition-colors"
              title="Actualizar ahora"
            >
              <RefreshCw size={16} className={status === 'loading' ? 'animate-spin' : ''} />
            </motion.button>

            {/* Export dropdown */}
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowExport(!showExport)}
                className="p-2 rounded-lg hover:bg-blue-700 transition-colors"
                title="Exportar"
              >
                <Download size={16} />
              </motion.button>
              {showExport && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-slate-100 py-1 min-w-48 z-50">
                  <button
                    onClick={() => { exportRegistrosCSV(filteredData); setShowExport(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 text-left"
                  >
                    <Download size={14} className="text-uba-blue" />
                    Exportar registros CSV
                  </button>
                  <button
                    onClick={() => { exportResumenCSV(stats); setShowExport(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 text-left"
                  >
                    <FileSpreadsheet size={14} className="text-emerald-600" />
                    Exportar resumen CSV
                  </button>
                </div>
              )}
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setPresentationMode(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-700 hover:bg-blue-600 transition-colors"
              title="Modo presentación"
            >
              <Maximize2 size={13} />
              <span className="hidden md:inline">Presentación</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowConfig(true)}
              className="p-2 rounded-lg hover:bg-blue-700 transition-colors"
              title="Configuración"
            >
              <Settings size={16} />
            </motion.button>
          </div>
        </div>

        {/* Sub-bar: mobile update badge + breadcrumb */}
        <div className="max-w-screen-2xl mx-auto px-4 pb-1 flex items-center justify-between gap-2 md:hidden">
          <LastUpdateBadge status={status} lastUpdate={lastUpdate} usingMock={usingMock} compact />
        </div>

        {/* Breadcrumb for specialty detail */}
        {isDetail && (
          <div className="bg-blue-900/40 px-4 py-1.5 text-xs text-blue-200 max-w-screen-2xl mx-auto">
            <Link to="/" className="hover:text-white">Dashboard</Link>
            <span className="mx-1.5">›</span>
            <span className="text-white">Detalle de especialidad</span>
          </div>
        )}

        {/* Confidentiality bar */}
        <div className="bg-amber-400 text-amber-900 text-center text-xs py-0.5 font-medium">
          CONFIDENCIAL — Datos de personas. Uso exclusivo del equipo UBA en Acción.
        </div>
      </header>

      {showConfig && <ConfigModal onClose={() => setShowConfig(false)} />}

      {/* Click outside to close export menu */}
      {showExport && <div className="fixed inset-0 z-40" onClick={() => setShowExport(false)} />}
    </>
  );
}
