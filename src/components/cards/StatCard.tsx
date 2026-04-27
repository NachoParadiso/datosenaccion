import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  color?: 'blue' | 'cyan' | 'green' | 'amber' | 'purple' | 'red' | 'white';
  trend?: 'up' | 'down' | null;
  onClick?: () => void;
  index?: number;
}

const themes = {
  blue:   { bg: 'bg-uba-blue', text: 'text-white', sub: 'text-blue-200', icon: 'bg-blue-800/50' },
  cyan:   { bg: 'bg-uba-cyan', text: 'text-white', sub: 'text-cyan-100', icon: 'bg-cyan-600/50' },
  green:  { bg: 'bg-emerald-500', text: 'text-white', sub: 'text-emerald-100', icon: 'bg-emerald-600/50' },
  amber:  { bg: 'bg-amber-500', text: 'text-white', sub: 'text-amber-100', icon: 'bg-amber-600/50' },
  purple: { bg: 'bg-violet-600', text: 'text-white', sub: 'text-violet-100', icon: 'bg-violet-700/50' },
  red:    { bg: 'bg-rose-500', text: 'text-white', sub: 'text-rose-100', icon: 'bg-rose-600/50' },
  white:  { bg: 'bg-white border border-slate-100', text: 'text-slate-800', sub: 'text-slate-500', icon: 'bg-slate-100 text-slate-600' },
};

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'white', trend, onClick, index = 0 }: Props) {
  const t = themes[color];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={onClick ? { scale: 1.02, y: -2 } : {}}
      onClick={onClick}
      className={clsx(
        'rounded-2xl p-5 shadow-sm flex items-center gap-4 select-none',
        t.bg, t.text,
        onClick && 'cursor-pointer'
      )}
    >
      {Icon && (
        <div className={clsx('rounded-xl p-3 flex-shrink-0', t.icon)}>
          <Icon size={22} />
        </div>
      )}
      <div className="min-w-0">
        <p className={clsx('text-xs font-medium uppercase tracking-wide truncate', t.sub)}>{title}</p>
        <motion.p
          key={String(value)}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-3xl font-black leading-tight mt-0.5"
        >
          {value}
        </motion.p>
        {subtitle && <p className={clsx('text-xs mt-0.5 truncate', t.sub)}>{subtitle}</p>}
      </div>
    </motion.div>
  );
}
