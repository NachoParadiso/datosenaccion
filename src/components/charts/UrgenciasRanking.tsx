import { KV } from '../../types';

const PODIUM = 3;
const SUPERLATIVO = 25;

interface Props { data: KV[]; }

export default function UrgenciasRanking({ data: raw }: Props) {
  if (!raw.length) return <div className="flex items-center justify-center h-48 text-slate-400 text-sm">Sin datos</div>;

  const total = raw.reduce((s, d) => s + d.value, 0);
  const sorted = [...raw].sort((a, b) => b.value - a.value);

  const predominantes = sorted.filter(d => (d.pct ?? 0) >= SUPERLATIVO);

  let insight = '';
  if (predominantes.length === 0) {
    insight = 'Sin temas predominantes (todas < 25%)';
  } else if (predominantes.length === 1) {
    insight = `Predominante: "${predominantes[0].name}" (${predominantes[0].pct}%)`;
  } else {
    insight = `Predominantes: ${predominantes.map(p => p.name).join(', ')}`;
  }

  return (
    <div>
      <h3 className="font-semibold text-slate-700 text-sm mb-2">Urgencias para el Gobierno</h3>
      <p className="text-xs text-slate-500 mb-4">{insight}</p>

      <div className="space-y-4">
        {sorted.map((item, idx) => {
          const pct = item.pct ?? Math.round((item.value / total) * 100);
          const isPodium = idx < PODIUM;
          const barWidth = Math.max(100 - (idx * 12), 15);

          return (
            <div key={item.name}>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xs font-medium ${isPodium ? 'text-amber-700' : 'text-slate-600'}`}>
                  {isPodium && <span className="inline-block w-5 text-amber-500 font-bold">{idx + 1}°</span>}
                  {!isPodium && <span className="inline-block w-5 text-slate-400">{idx + 1}°</span>}
                  <span className="ml-1">{item.name}</span>
                </span>
                <span className={`text-xs font-bold ${isPodium ? 'text-amber-600' : 'text-slate-500'}`}>
                  {pct}%
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${isPodium ? 'bg-amber-500' : 'bg-slate-300'}`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
