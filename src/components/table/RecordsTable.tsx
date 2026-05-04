import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Registro } from '../../types';
import { maskDni } from '../../utils/normalize';
import { clsx } from 'clsx';

interface DetailModalProps {
  registro: Registro;
  onClose: () => void;
}

function DetailModal({ registro, onClose }: DetailModalProps) {
  const fields: Array<[string, string]> = [
    ['Nombre', registro.nombre_completo],
    ['DNI', registro.dni],
    ['Rango etario', registro.rango_etario],
    ['Cobertura médica', registro.cobertura],
    ['Residencia', registro.residencia],
    ['Situación laboral', registro.situacion_laboral],
    ['Impedimentos', registro.impedimentos.length > 0 ? registro.impedimentos.join(', ') : '—'],
    ['Urgencias de gobierno', registro.urgencias.length > 0 ? registro.urgencias.join(', ') : '—'],
    ['Hora de registro', registro.marca_temporal],
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-uba-blue">Detalle del registro</h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg"
            aria-label="Cerrar modal"
          >
            <X size={16} />
          </button>
        </div>
        <dl className="space-y-2 text-sm">
          {fields.map(([label, value]) => (
            <div key={label} className="flex gap-2">
              <dt className="text-slate-400 w-40 flex-shrink-0 text-xs">{label}</dt>
              <dd className="text-slate-800 font-medium text-xs break-words">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="text-xs text-slate-400 mt-4 text-center">
          Uso interno · Información confidencial
        </p>
      </motion.div>
    </div>
  );
}

interface RecordsTableProps {
  data: Registro[];
  maxRows?: number;
  title?: string;
}

export default function RecordsTable({ data, maxRows = 25, title = 'Últimos registros' }: RecordsTableProps) {
  const [selected, setSelected] = useState<Registro | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc');

  const sorted = [...data].sort((a, b) => {
    const ta = a.fecha?.getTime() ?? 0;
    const tb = b.fecha?.getTime() ?? 0;
    return sortDir === 'desc' ? tb - ta : ta - tb;
  });

  const visible = expanded ? sorted : sorted.slice(0, maxRows);

  return (
    <>
      <AnimatePresence>
        {selected && <DetailModal registro={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-700 text-sm">{title} ({data.length})</h3>
          <button
            onClick={() => setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-uba-blue"
          >
            Hora {sortDir === 'desc' ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase text-xs">
                <th className="px-3 py-2.5 text-left">Hora</th>
                <th className="px-3 py-2.5 text-left">Nombre</th>
                <th className="px-3 py-2.5 text-left hidden sm:table-cell">DNI</th>
                <th className="px-3 py-2.5 text-left hidden md:table-cell">Rango etario</th>
                <th className="px-3 py-2.5 text-left hidden lg:table-cell">Cobertura</th>
                <th className="px-3 py-2.5 text-left hidden lg:table-cell">Residencia</th>
                <th className="px-3 py-2.5 text-left hidden xl:table-cell">Situación laboral</th>
                <th className="px-3 py-2.5 text-center hidden md:table-cell">Ver</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {visible.map((r, i) => (
                  <motion.tr
                    key={r.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className={clsx(
                      'border-b border-slate-50 hover:bg-blue-50/50 transition-colors',
                      i % 2 === 1 && 'bg-slate-50/40'
                    )}
                  >
                    <td className="px-3 py-2.5 text-slate-500 whitespace-nowrap">
                      {r.hora >= 0 ? `${String(r.hora).padStart(2, '0')}:xx` : '—'}
                    </td>
                    <td className="px-3 py-2.5 font-medium text-slate-800 max-w-[130px] truncate">
                      {r.nombre_completo}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-slate-500 hidden sm:table-cell">
                      {maskDni(r.dni)}
                    </td>
                    <td className="px-3 py-2.5 text-slate-700 hidden md:table-cell">
                      {r.rango_etario || '—'}
                    </td>
                    <td className="px-3 py-2.5 text-slate-500 hidden lg:table-cell">
                      <span className="badge bg-slate-100 text-slate-600">
                        {r.cobertura || '—'}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-500 hidden lg:table-cell max-w-[100px] truncate">
                      {r.residencia || '—'}
                    </td>
                    <td className="px-3 py-2.5 hidden xl:table-cell max-w-[120px] truncate">
                      {r.situacion_laboral || '—'}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <button
                        onClick={() => setSelected(r)}
                        className="p-1.5 text-uba-blue hover:bg-blue-50 rounded-lg transition-colors"
                        aria-label="Ver detalle"
                      >
                        <Eye size={13} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {data.length > maxRows && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 w-full text-xs text-uba-blue hover:text-uba-blue-mid flex items-center justify-center gap-1 py-2 hover:bg-blue-50 rounded-xl transition-colors"
          >
            {expanded ? (
              <>
                <ChevronUp size={13} /> Mostrar menos
              </>
            ) : (
              <>
                <ChevronDown size={13} /> Ver todos ({data.length} registros)
              </>
            )}
          </button>
        )}
      </div>
    </>
  );
}
