import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Home, TrendingUp, X } from 'lucide-react';
import { useState } from 'react';
import { Alerta } from '../../types';

interface Props { alertas: Alerta[]; }

const iconMap = {
  alta_demanda: <TrendingUp size={15} />,
  situacion_calle: <Home size={15} />,
  info: <AlertTriangle size={15} />,
};

const colorMap = {
  alta_demanda: 'bg-orange-50 border-orange-200 text-orange-800',
  situacion_calle: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

export default function AlertBanner({ alertas }: Props) {
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());

  const visible = alertas.filter((_, i) => !dismissed.has(i));
  if (!visible.length) return null;

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {alertas.map((a, i) => !dismissed.has(i) && (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-sm font-medium ${colorMap[a.tipo]}`}
          >
            <span className="flex-shrink-0 mt-0.5">{iconMap[a.tipo]}</span>
            <span className="flex-1">{a.mensaje}</span>
            <button onClick={() => setDismissed(new Set([...dismissed, i]))} className="flex-shrink-0 opacity-60 hover:opacity-100">
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
