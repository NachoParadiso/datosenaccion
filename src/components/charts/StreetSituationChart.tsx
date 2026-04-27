import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { KV } from '../../types';

const COLORS: Record<string, string> = {
  'No': '#10B981',
  'Sí': '#EF4444',
  'Prefiere no responder': '#94A3B8',
};

const RADIAN = Math.PI / 180;
function renderLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }: Record<string, number>) {
  if (percent < 0.06) return null;
  const r = innerRadius + (outerRadius - innerRadius) * 0.55;
  return <text x={cx + r * Math.cos(-midAngle * RADIAN)} y={cy + r * Math.sin(-midAngle * RADIAN)} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={700}>{`${Math.round(percent * 100)}%`}</text>;
}

interface Props { data: KV[]; }

export default function StreetSituationChart({ data }: Props) {
  if (!data.length) return <div className="flex items-center justify-center h-40 text-slate-400 text-sm">Sin datos</div>;
  return (
    <div>
      <h3 className="font-semibold text-slate-700 text-sm mb-2">Situación de calle</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} cx="50%" cy="44%" innerRadius={44} outerRadius={80} dataKey="value" nameKey="name" labelLine={false} label={renderLabel}>
            {data.map((e, i) => <Cell key={i} fill={COLORS[e.name] ?? '#94A3B8'} />)}
          </Pie>
          <Tooltip formatter={(v: number, name) => [`${v} personas`, name]} contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 12 }} />
          <Legend formatter={(v) => <span style={{ fontSize: 11, color: '#64748B' }}>{v}</span>} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
