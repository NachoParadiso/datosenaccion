import { KV } from '../../types';

interface Props { data: any[]; } 

export default function SituacionLaboralChart({ data }: Props) {
  const normalizedData = (data || []).map((d: any) => ({
    name: d.name || d.categoria || 'Sin definir',
    value: Number(d.value !== undefined ? d.value : (d.cantidad || 0))
  }));

  if (!normalizedData.length || !normalizedData.some(d => d.value > 0)) {
    return <div className="flex items-center justify-center h-48 text-slate-400 text-sm">Esperando respuestas...</div>;
  }

  const sorted = [...normalizedData].sort((a, b) => b.value - a.value);
  const maxVotos = sorted[0].value || 1;

  return (
    <div className="flex flex-col h-full">
      <h3 className="font-semibold text-slate-700 text-sm mb-1 uppercase">Propuestas para el Barrio</h3>
      <p className="text-xs text-slate-500 mb-4">¿Qué te gustaría que haga un partido político?</p>
      
      <div className="flex-1 space-y-4">
        {sorted.map((item, index) => {
          const porcentajeBarra = (item.value / maxVotos) * 100;

          // ==========================================
          // LÓGICA DE COLORES (Estilo Política/Urgencias)
          // ==========================================
          // Si querés que se pinten los 3 primeros (como en la otra tarjeta), 
          // cambiá "index === 0" por "index < 3".
          const destacar = index < 3; 
          
          const colorTextoNumero = destacar ? 'text-blue-700' : 'text-slate-400';
          const colorBarra = destacar ? 'bg-blue-700' : 'bg-slate-300';
          const colorHover = destacar ? 'bg-blue-600' : 'bg-slate-400';

          return (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-end gap-3">
                
                {/* Lado izquierdo: Número de ranking + Texto de la propuesta */}
                <div className="flex items-baseline gap-2">
                  <span className={`text-xs font-bold ${colorTextoNumero}`}>
                    {index + 1}º
                  </span>
                  <span className="text-[12px] font-medium text-slate-700 leading-tight">
                    {item.name}
                  </span>
                </div>
                
                {/* Lado derecho: Cantidad de votos (Sobrio, sin fondo de color) */}
                <span className={`text-xs font-bold ${colorTextoNumero} whitespace-nowrap`}>
                  {item.value} <span className="text-[12px] font-medium text-slate-600 ">votos</span>
                </span>
              </div>
              
              {/* Barra de progreso */}
              <div className="w-full bg-slate-100 rounded-full h-1.5 relative group mt-1">
                <div
                  className={`${colorBarra} h-1.5 rounded-full transition-all duration-500 ease-out`}
                  style={{ width: `${porcentajeBarra}%` }}
                ></div>
                <div className={`absolute inset-0 ${colorHover} rounded-full h-1.5 opacity-0 group-hover:opacity-100 transition-opacity`}></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}