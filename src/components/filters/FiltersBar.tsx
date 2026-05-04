import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, Search, ChevronDown } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { clsx } from 'clsx';

const SITUACIONES_LABORALES = [
  'Empleado/a en relación de dependencia',
  'Trabajo informal / en negro',
  'Monotributista / autónomo',
  'Desempleado/a (busco trabajo)',
  'No trabajo ni busco trabajo',
];

const RESIDENCIAS = [
  'Ciudad Autónoma de Buenos Aires',
  'Conurbano Bonaerense',
  'Otra provincia',
];

const COBERTURAS = [
  'Obra social',
  'Prepaga',
  'PAMI',
  'Solo salud pública / no tengo cobertura',
  'Otro',
];

const RANGOS_ETARIOS = [
  'Menos de 18 años',
  '18 a 24 años',
  '25 a 34 años',
  '35 a 44 años',
  '45 a 54 años',
  '55 a 64 años',
  '65 años o más',
];

function SelectFilter({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={clsx('select-filter pr-8 text-xs', value && 'bg-uba-blue text-white border-uba-blue')}
      >
        <option value="">{label}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={12} className={clsx('absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none', value ? 'text-white' : 'text-slate-400')} />
    </div>
  );
}

export default function FiltersBar() {
  const { filtros, setFiltros, resetFiltros, filteredData, rawData } = useData();
  const hasFilters = Object.entries(filtros).some(([k, v]) => {
    if (k === 'hora_desde') return v !== 0;
    if (k === 'hora_hasta') return v !== 23;
    return Boolean(v);
  });

  const localidades = [...new Set(rawData.map((r) => r.localidad_barrio).filter(Boolean))].sort();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3"
    >
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mr-1">
          <Filter size={13} />
          Filtros
        </div>

        <div className="relative flex-1 min-w-48 max-w-sm">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filtros.search}
            onChange={(e) => setFiltros((f) => ({ ...f, search: e.target.value }))}
            placeholder="Buscar nombre, DNI, residencia..."
            className="w-full text-xs border border-slate-200 rounded-xl pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-uba-blue bg-white"
          />
        </div>

        <SelectFilter label="Situación laboral" value={filtros.especialidad} options={SITUACIONES_LABORALES} onChange={(v) => setFiltros((f) => ({ ...f, especialidad: v }))} />
        <SelectFilter label="Residencia" value={filtros.procedencia} options={RESIDENCIAS} onChange={(v) => setFiltros((f) => ({ ...f, procedencia: v }))} />
        <SelectFilter label="Cobertura médica" value={filtros.cobertura_medica} options={COBERTURAS} onChange={(v) => setFiltros((f) => ({ ...f, cobertura_medica: v }))} />
        <SelectFilter label="Rango etario" value={filtros.genero} options={RANGOS_ETARIOS} onChange={(v) => setFiltros((f) => ({ ...f, genero: v }))} />
        <SelectFilter label="Localidad" value={filtros.localidad} options={localidades} onChange={(v) => setFiltros((f) => ({ ...f, localidad: v }))} />

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-500">Hora:</span>
          <input type="number" min={0} max={23} value={filtros.hora_desde} onChange={(e) => setFiltros((f) => ({ ...f, hora_desde: Number(e.target.value) }))}
            className="w-12 border border-slate-200 rounded-lg px-1.5 py-1.5 text-center text-xs focus:outline-none focus:ring-1 focus:ring-uba-blue" />
          <span className="text-slate-400">–</span>
          <input type="number" min={0} max={23} value={filtros.hora_hasta} onChange={(e) => setFiltros((f) => ({ ...f, hora_hasta: Number(e.target.value) }))}
            className="w-12 border border-slate-200 rounded-lg px-1.5 py-1.5 text-center text-xs focus:outline-none focus:ring-1 focus:ring-uba-blue" />
        </div>

        <AnimatePresence>
          {hasFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={resetFiltros}
              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
            >
              <X size={12} />
              Limpiar filtros
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {hasFilters && (
        <p className="text-xs text-slate-400">
          Mostrando <span className="font-semibold text-uba-blue">{filteredData.length}</span> de {rawData.length} registros
        </p>
      )}
    </motion.div>
  );
}
