import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { KV } from '../../types';

interface Props { data: KV[]; }

export default function SituacionLaboralChart({ data: raw }: Props) {
  if (!raw.length) return <div className="flex items-center justify-center h-48 text-slate-400 text-sm">Sin datos</div>;

  const total = raw.reduce((s, d) => s + d.value, 0);
  const data = [...raw].sort((a, b) => b.value - a.value);
  const topItem = data[0];
  const insight = topItem ? `Predominancia de "${topItem.name}" (${Math.round(topItem.value / total * 100)}% del total)` : '';

  return (
    <div>
      <h3 className="font-semibold text-slate-700 text-sm mb-1">Situación Laboral</h3>
      <p className="text-xs text-slate-500 mb-3">{insight}</p>
      <ResponsiveContainer width="100%" height={Math.max(220, data.length * 42 + 40)}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 60, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 10, fill: '#94A3B8' }} allowDecimals={false} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#334155', fontWeight: 500 }} width={160} />
          <Tooltip
            formatter={(v: number) => [`${v} personas (${total ? Math.round(v / total * 100) : 0}%)`, 'cantidad']}
            contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 12 }}
          />
          <Bar dataKey="value" radius={[0, 5, 5, 0]} maxBarSize={28} label={{ position: 'right', formatter: (v: number) => `${v} (${total ? Math.round(v / total * 100) : 0}%)`, style: { fontSize: 11, fill: '#334155', fontWeight: 600 } }}>
            {data.map((_, i) => <Cell key={i} fill={i === 0 ? '#f59e0b' : '#3b82f6'} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
