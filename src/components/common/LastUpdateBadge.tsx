import { Wifi, WifiOff, Database, Loader2 } from 'lucide-react';
import { DataStatus } from '../../types';
import { clsx } from 'clsx';

interface Props {
  status: DataStatus;
  lastUpdate: Date | null;
  usingMock: boolean;
  compact?: boolean;
}

export default function LastUpdateBadge({ status, lastUpdate, usingMock, compact }: Props) {
  const time = lastUpdate
    ? lastUpdate.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '—';

  const isLoading = status === 'loading';
  const isError = status === 'error';

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-blue-200">
        {isLoading ? <Loader2 size={11} className="animate-spin" /> : isError ? <WifiOff size={11} className="text-red-300" /> : <Wifi size={11} className="text-emerald-300" />}
        {usingMock ? <span className="text-amber-300">Datos de prueba</span> : <span>Act: {time}</span>}
      </div>
    );
  }

  return (
    <div className={clsx('flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium', {
      'bg-blue-800/60 text-blue-100': !isError && !usingMock,
      'bg-red-800/60 text-red-200': isError,
      'bg-amber-700/60 text-amber-200': usingMock,
    })}>
      {isLoading ? (
        <Loader2 size={12} className="animate-spin" />
      ) : isError ? (
        <WifiOff size={12} />
      ) : usingMock ? (
        <Database size={12} />
      ) : (
        <Wifi size={12} className="text-emerald-300" />
      )}
      <span>
        {isLoading ? 'Actualizando...' :
         isError ? 'Error de conexión' :
         usingMock ? 'Datos de prueba — Configurar URL' :
         `Conectado · ${time}`}
      </span>
      {!isLoading && !usingMock && !isError && (
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />
      )}
    </div>
  );
}
