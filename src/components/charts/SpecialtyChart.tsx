import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { KV } from '../../types';

const COLORS = ['#003087','#0055B3','#0077CC','#00A8E8','#0EA5E9','#38BDF8','#7DD3FC','#BAE6FD','#003087','#0055B3','#1E40AF'];

interface Props { data: KV[]; title?: string; }

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { payload: KV }[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white shadow-xl rounded-xl border border-slate-100 p-3 text-sm">
      <p className="font-bold text-slate-800">{d.name}</p>
      <p className="text-uba-blue font-semibold">{d.value} personas</p>
      <p className="text-slate-500">{d.pct}% del total</p>
      <p className="text-xs text-uba-cyan mt-1">Clic para ver detalle →</p>
    </div>
  );
}

export default function SpecialtyChart({ data, title = 'Personas por especialidad' }: Props) {
  const navigate = useNavigate();
  if (!data.length) return <EmptyState />;

  return (
    <div>
      <h3 className="font-semibold text-slate-700 text-sm mb-3">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 90 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
          <XAxis
            dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }}
            angle={-42} textAnchor="end" interval={0}
          />
          <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F0F4F8' }} />
          <Bar
            dataKey="value"
            radius={[6, 6, 0, 0]}
            maxBarSize={44}
            onClick={(d) => navigate(`/especialidad/${encodeURIComponent(d.name)}`)}
            style={{ cursor: 'pointer' }}
          >
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            <LabelList dataKey="value" position="top" style={{ fontSize: 11, fontWeight: 700, fill: '#334155' }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-center text-xs text-slate-400 mt-1">Clic en una barra para ver el detalle de la especialidad</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-48 text-slate-400 text-sm gap-2">
      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 2 }}>
        Sin datos todavía
      </motion.div>
    </div>
  );
}
