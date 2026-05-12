import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { KV } from '../../types';

const SUPERLATIVO = 25;

interface Props { data: KV[]; }

export default function ImpedimentosChart({ data: raw }: Props) {
  if (!raw.length) return <div className="flex items-center justify-center h-48 text-slate-400 text-sm">Sin datos</div>;

  const data = [...raw].sort((a, b) => b.value - a.value);
  const predominantes = data.filter(d => (d.pct ?? 0) >= SUPERLATIVO);

  let insight = '';
  if (predominantes.length === 0) {
    insight = 'Sin impedimento predominante (todas < 25%)';
  } else if (predominantes.length === 1) {
    insight = `Predominante: "${predominantes[0].name}" (${predominantes[0].pct}%)`;
  } else {
    insight = `Predominantes: ${predominantes.map(p => p.name).join(', ')}`;
  }

  return (
    <div>
      <h3 className="font-semibold text-slate-700 text-sm mb-1">Impedimentos para llegar a fin de mes</h3>
<p className="text-xs text-slate-500 mb-6">{insight}</p>
      <ResponsiveContainer width="100%" height={Math.max(220, data.length * 32 + 50)}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 55, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10, fill: '#64748B' }} allowDecimals={false} label={{ value: 'Porcentaje de personas', position: 'insideBottom', offset: -10, fontSize: 11, fill: '#475569', fontWeight: 600 }} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#334155', fontWeight: 500 }} width={160} />
          <Tooltip
            formatter={(v: number, _name, item) => {
              const cantidad = (item?.payload as { value?: number } | undefined)?.value ?? 0;
              return [`${v}% (${cantidad} personas)`, 'Frecuencia'];
            }}
            contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 12 }}
          />
          <Bar dataKey="pct" radius={[0, 4, 4, 0]} maxBarSize={20} label={{ position: 'right', formatter: (v: number) => `${v}%`, style: { fontSize: 10, fill: '#334155', fontWeight: 600 } }}>
            {data.map((_, i) => <Cell key={i} fill={i === 0 ? '#f59e0b' : '#6366f1'} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
