import { useState } from 'react';
import { Lock, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useData } from '../../context/DataContext';

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const { loginInternal } = useData();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = loginInternal(password);
    if (ok) {
      onClose();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">Acceso interno</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
                error ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-200'
              }`}
              placeholder="Ingresá la contraseña"
              autoFocus
            />
            {error && <p className="text-xs text-red-500 mt-1">Contraseña incorrecta</p>}
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-uba-blue text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Lock size={14} />
            Ingresar
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
