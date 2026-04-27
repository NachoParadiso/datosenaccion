import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { HoraEntry } from '../../types';

interface Props { data: HoraEntry[]; }

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white shadow-xl rounded-xl border border-slate-100 p-3 text-sm">
      <p className="font-bold text-slate-700">{label}</p>
      <p className="text-uba-blue font-semibold">{payload[0].value} registros</p>
    </div>
  );
}

export default function TimeSeriesChart({ data }: Props) {
  const peak = data.reduce((m, d) => d.total > m.total ? d : m, data[0] ?? { hora: '', total: 0 });
  const nowHour = new Date().getHours();
  const nowLabel = `${String(nowHour).padStart(2, '0')}:00`;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-700 text-sm">Evolución de carga por hora</h3>
        {peak.total > 0 && (
          <span className="text-xs text-uba-blue bg-blue-50 px-2 py-0.5 rounded-full font-medium">
            Hora pico: {peak.hora} ({peak.total})
          </span>
        )}
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#003087" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#003087" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
          <XAxis dataKey="hora" tick={{ fontSize: 10, fill: '#94A3B8' }} interval={3} />
          <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine x={nowLabel} stroke="#00A8E8" strokeDasharray="4 4" strokeWidth={2} label={{ value: 'Ahora', fill: '#00A8E8', fontSize: 10 }} />
          <Area type="monotone" dataKey="total" stroke="#003087" strokeWidth={2.5} fill="url(#grad)" dot={false} activeDot={{ r: 5, fill: '#003087' }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
