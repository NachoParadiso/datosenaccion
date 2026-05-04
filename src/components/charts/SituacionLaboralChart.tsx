import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { KV } from '../../types';

const COLORS = ['#003087','#0055B3','#0077CC','#00A8E8','#0EA5E9'];

interface Props { data: KV[]; }

export default function SituacionLaboralChart({ data }: Props) {
  if (!data.length) return <div className="flex items-center justify-center h-48 text-slate-400 text-sm">Sin datos</div>;
  return (
    <div>
      <h3 className="font-semibold text-slate-700 text-sm mb-3">Situación laboral</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 70 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748B' }} angle={-30} textAnchor="end" interval={0} />
          <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} allowDecimals={false} />
          <Tooltip formatter={(v: number) => [v, 'Personas']} contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 12 }} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={44}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            <LabelList dataKey="value" position="top" style={{ fontSize: 11, fontWeight: 700, fill: '#334155' }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
