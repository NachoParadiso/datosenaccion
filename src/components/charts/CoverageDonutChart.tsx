import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { KV } from '../../types';

const COLORS: Record<string, string> = {
  'Obra social': '#10B981',
  'Prepaga': '#3B82F6',
  'PAMI': '#8B5CF6',
  'Solo salud pública / no tengo cobertura': '#EF4444',
  'Otro': '#F59E0B',
};

const FALLBACK = ['#10B981', '#3B82F6', '#8B5CF6', '#EF4444', '#F59E0B'];

const RADIAN = Math.PI / 180;
function renderLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }: Record<string, number>) {
  if (percent < 0.06) return null;
  const r = innerRadius + (outerRadius - innerRadius) * 0.55;
  return (
    <text x={cx + r * Math.cos(-midAngle * RADIAN)} y={cy + r * Math.sin(-midAngle * RADIAN)} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
      {`${Math.round(percent * 100)}%`}
    </text>
  );
}

interface Props { data: KV[]; }

export default function CoverageDonutChart({ data }: Props) {
  if (!data.length) return <div className="flex items-center justify-center h-48 text-slate-400 text-sm">Sin datos</div>;

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div>
      <h3 className="font-semibold text-slate-700 text-sm mb-2">Cobertura médica</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="44%"
            innerRadius={50}
            outerRadius={88}
            dataKey="value"
            nameKey="name"
            labelLine={false}
            label={renderLabel}
            strokeWidth={0}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={COLORS[entry.name] ?? FALLBACK[i % FALLBACK.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v: number, name: string) => [`${v} personas (${Math.round((v / total) * 100)}%)`, name]} contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 12 }} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} formatter={(v) => <span style={{ fontSize: 11, color: '#64748B' }}>{v}</span>} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
