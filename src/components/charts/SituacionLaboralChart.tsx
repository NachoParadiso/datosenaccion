import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { KV } from '../../types';

const SUPERLATIVO = 25;

interface Props { data: KV[]; }

export default function SituacionLaboralChart({ data: raw }: Props) {
  if (!raw.length) return <div className="flex items-center justify-center h-48 text-slate-400 text-sm">Sin datos</div>;

  const total = raw.reduce((s, d) => s + d.value, 0);
  const data = [...raw].sort((a, b) => b.value - a.value);

  const withPct = data.map(item => ({
    ...item,
    pct: Math.round((item.value / total) * 100)
  }));

  const superlativos = withPct.filter(item => item.pct >= SUPERLATIVO);

  let insight = '';
  if (superlativos.length === 0) {
    const pcts = withPct.map(item => item.pct);
    const range = Math.max(...pcts) - Math.min(...pcts);
    if (range < 10) {
      insight = 'Sin condición predominante';
    } else {
      const topItem = withPct[0];
      insight = `Tema prioritario: "${topItem.name}" (${topItem.pct}% del total)`;
    }
  } else if (superlativos.length === 1) {
    insight = `Predominancia de "${superlativos[0].name}"`;
  } else {
    const nombres = superlativos.map(s => s.name).join(', ');
    insight = `${nombres} predominan`;
  }

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
