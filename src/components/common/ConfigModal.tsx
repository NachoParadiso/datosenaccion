import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Link as LinkIcon, CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface Props { onClose: () => void; }

export default function ConfigModal({ onClose }: Props) {
  const { customUrl, saveCustomUrl, refresh, usingMock } = useData();
  const [url, setUrl] = useState(customUrl ?? '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    saveCustomUrl(url.trim());
    setSaved(true);
    setTimeout(() => { refresh(); onClose(); }, 800);
  };

  const clearUrl = () => {
    saveCustomUrl('');
    setUrl('');
    refresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="bg-uba-blue rounded-xl p-2"><LinkIcon size={18} className="text-white" /></div>
            <div>
              <h2 className="font-bold text-uba-blue text-lg">Conectar Google Sheets</h2>
              <p className="text-xs text-slate-500">Pegá la URL CSV pública de tu hoja</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg"><X size={18} /></button>
        </div>

        {usingMock && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex items-start gap-2 text-sm text-amber-800">
            <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
            <span>Estás viendo <strong>datos de prueba</strong>. Ingresá la URL para conectar tu Google Sheet real.</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              URL CSV de Google Sheets
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/.../pub?output=csv"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-uba-blue placeholder-slate-400"
            />
          </div>

          <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-600 space-y-1.5">
            <p className="font-semibold text-slate-700 mb-2">¿Cómo obtener la URL?</p>
            <p><span className="font-medium">1.</span> Abrí tu Google Sheet con las respuestas del formulario</p>
            <p><span className="font-medium">2.</span> Archivo → Compartir → Publicar en la web</p>
            <p><span className="font-medium">3.</span> Seleccioná la hoja correcta → Formato: <strong>Valores separados por comas (.csv)</strong></p>
            <p><span className="font-medium">4.</span> Hacé clic en <strong>Publicar</strong> y copiá la URL</p>
            <p><span className="font-medium">5.</span> Pegala arriba y guardá</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={!url.trim() || saved}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-uba-blue text-white rounded-xl text-sm font-semibold hover:bg-uba-blue-mid transition-colors disabled:opacity-50"
            >
              {saved ? <CheckCircle2 size={16} /> : <RefreshCw size={16} />}
              {saved ? '¡Guardado!' : 'Guardar y conectar'}
            </button>
            {!usingMock && (
              <button onClick={clearUrl} className="px-4 py-3 border border-slate-200 text-slate-600 rounded-xl text-sm hover:bg-slate-50">
                Usar datos de prueba
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
