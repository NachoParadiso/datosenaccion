import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { KV } from '../../types';

const COLORS: Record<string, string> = {
  'Obra social': '#10B981',
  'Prepaga': '#3B82F6',
  'PAMI': '#8B5CF6',
  'Solo salud pública / no tengo cobertura': '#EF4444',
  'Otro': '#F59E0B',
};

interface Props { data: KV[]; }

export default function CoverageChart({ data }: Props) {
  if (!data.length) return <div className="flex items-center justify-center h-40 text-slate-400 text-sm">Sin datos</div>;
  return (
    <div>
      <h3 className="font-semibold text-slate-700 text-sm mb-3">Cobertura médica</h3>
      <ResponsiveContainer width="100%" height={190}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
          <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#64748B' }} angle={-25} textAnchor="end" interval={0} />
          <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} allowDecimals={false} />
          <Tooltip formatter={(v: number, name) => [`${v} personas`, name]} contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 12 }} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={56}>
            {data.map((e, i) => <Cell key={i} fill={COLORS[e.name] ?? '#94A3B8'} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
