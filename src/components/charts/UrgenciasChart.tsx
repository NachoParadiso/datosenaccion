import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { KV } from '../../types';
import { useMemo } from 'react';

interface Props { data: KV[]; }

export default function UrgenciasChart({ data: raw }: Props) {
  if (!raw.length) return <div className="flex items-center justify-center h-48 text-slate-400 text-sm">Sin datos</div>;

  const { chartData, total } = useMemo(() => {
    const sorted = [...raw].sort((a, b) => b.value - a.value);
    const total = sorted.reduce((s, d) => s + d.value, 0);
    
    // Group categories after top 5 into "Otros"
    if (sorted.length <= 5) return { chartData: sorted, total };
    
    const top5 = sorted.slice(0, 5);
    const rest = sorted.slice(5);
    const otrosValue = rest.reduce((s, d) => s + d.value, 0);
    
    return { 
      chartData: [...top5, { name: 'Otros', value: otrosValue }], 
      total 
    };
  }, [raw]);

  const topItem = chartData[0];
  const insight = topItem ? `Tema prioritario: "${topItem.name}" (${Math.round(topItem.value / total * 100)}%)` : '';

  return (
    <div>
      <h3 className="font-semibold text-slate-700 text-sm mb-1">Urgencias para el Gobierno</h3>
      <p className="text-xs text-slate-500 mb-3">{insight}</p>
      <ResponsiveContainer width="100%" height={Math.max(240, chartData.length * 38 + 40)}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 65, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 10, fill: '#94A3B8' }} allowDecimals={false} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#334155', fontWeight: 500 }} width={180} />
          <Tooltip
            formatter={(v: number) => [`${v} menciones (${total ? Math.round(v / total * 100) : 0}%)`, 'Frecuencia']}
            contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 12 }}
            labelStyle={{ fontWeight: 600, marginBottom: 4 }}
          />
          <Bar dataKey="value" radius={[0, 5, 5, 0]} maxBarSize={24} label={{ position: 'right', formatter: (v: number) => `${v} (${total ? Math.round(v / total * 100) : 0}%)`, style: { fontSize: 11, fill: '#334155', fontWeight: 600 } }}>
            {chartData.map((_, i) => <Cell key={i} fill={i === 0 ? '#f59e0b' : '#10b981'} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
