import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { KV } from '../../types';

const COLORS = ['#003087','#0055B3','#0077CC','#00A8E8','#38BDF8','#7DD3FC','#BAE6FD','#1E40AF','#1D4ED8'];

interface Props { data: KV[]; }

export default function UrgenciasChart({ data }: Props) {
  if (!data.length) return <div className="flex items-center justify-center h-48 text-slate-400 text-sm">Sin datos</div>;

  return (
    <div>
      <h3 className="font-semibold text-slate-700 text-sm mb-3">Urgencias de gobierno</h3>
      <p className="text-xs text-slate-400 mb-2">Opción múltiple — hasta 3 opciones por encuestado</p>
      <ResponsiveContainer width="100%" height={Math.max(220, data.length * 28 + 40)}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 40, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 10, fill: '#94A3B8' }} allowDecimals={false} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#475569' }} width={140} />
          <Tooltip
            formatter={(v: number, _name, entry) => [`${v} personas`, entry.payload.name]}
            contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 12 }}
          />
          <Bar dataKey="value" radius={[0, 5, 5, 0]} maxBarSize={20} label={{ position: 'right', style: { fontSize: 11, fill: '#334155', fontWeight: 600 } }}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
