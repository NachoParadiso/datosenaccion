import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { KV } from '../../types';

const COLORS = ['#003087','#0055B3','#0077CC','#00A8E8','#0EA5E9','#38BDF8','#7DD3FC'];

interface Props { data: KV[]; }

export default function RangoEtarioChart({ data }: Props) {
  const hasData = data.some((d) => d.value > 0);
  if (!hasData) return <div className="flex items-center justify-center h-40 text-slate-400 text-sm">Sin datos</div>;
  return (
    <div>
      <h3 className="font-semibold text-slate-700 text-sm mb-3">Rango etario</h3>
      <ResponsiveContainer width="100%" height={190}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748B' }} angle={-25} textAnchor="end" interval={0} />
          <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} allowDecimals={false} />
          <Tooltip formatter={(v: number) => [v, 'Personas']} contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 12 }} />
          <Bar dataKey="value" radius={[5, 5, 0, 0]} maxBarSize={40}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
