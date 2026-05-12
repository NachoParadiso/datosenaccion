import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { KV } from '../../types';

const COLORS: Record<string, string> = {
  'Empleado/a en relación de dependencia': '#3b82f6',
  'Trabajo informal / en negro': '#f59e0b',
  'Monotributista / autónomo': '#10b981',
  'Desempleado/a (busco trabajo)': '#ef4444',
  'No trabajo ni busco trabajo': '#8b5cf6',
};

const FALLBACK = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

const RADIAN = Math.PI / 180;
function renderLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }: Record<string, number>) {
  if (percent < 0.08) return null;
  const r = innerRadius + (outerRadius - innerRadius) * 0.55;
  return (
    <text x={cx + r * Math.cos(-midAngle * RADIAN)} y={cy + r * Math.sin(-midAngle * RADIAN)} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
      {`${Math.round(percent * 100)}%`}
    </text>
  );
}

const SUPERLATIVO = 25;

interface Props { data: KV[]; }

export default function SituacionLaboralChart({ data }: Props) {
  if (!data.length || !data.some(d => d.value > 0)) return <div className="flex items-center justify-center h-48 text-slate-400 text-sm">Sin datos</div>;

  const total = data.reduce((s, d) => s + d.value, 0);
  const sorted = [...data].sort((a, b) => b.value - a.value);
  const predominantes = sorted.filter(d => (d.pct ?? 0) >= SUPERLATIVO);

  let insight = '';
  if (predominantes.length === 0) {
    insight = 'Sin condición predominante (todas < 25%)';
  } else if (predominantes.length === 1) {
    insight = `Predominante: "${predominantes[0].name}" (${predominantes[0].pct}%)`;
  } else {
    const nombres = predominantes.map(p => p.name).join(', ');
    insight = `Predominantes: ${nombres}`;
  }

  return (
    <div>
<h3 className="font-semibold text-slate-700 text-sm mb-2">Situación Laboral</h3>
      <p className="text-xs text-slate-500 mb-4">{insight}</p>
      <ResponsiveContainer width="100%" height={340}>
        <PieChart margin={{ top: 12, right: 0, bottom: 0, left: 0 }}>
          <Pie
            data={data}
            cx="50%"
            cy="42%"
            innerRadius={50}
            outerRadius={85}
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
          <Legend wrapperStyle={{ paddingTop: '8px' }} formatter={(v) => <span style={{ fontSize: 11, color: '#64748B' }}>{v}</span>} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}


