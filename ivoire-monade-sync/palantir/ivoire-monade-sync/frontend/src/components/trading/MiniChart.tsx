import { motion } from 'framer-motion';

const points = [24, 28, 22, 32, 30, 36, 34, 40, 38, 44, 42, 48];
const max = Math.max(...points);
const min = Math.min(...points);
const w = 720;
const h = 220;
const pad = 24;
const stepX = (w - pad * 2) / (points.length - 1);
const toX = (i: number) => pad + i * stepX;
const toY = (v: number) => h - pad - ((v - min) / (max - min)) * (h - pad * 2);
const d = points.map((v, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(v)}`).join(' ');
const area = `${d} L ${toX(points.length - 1)} ${h - pad} L ${toX(0)} ${h - pad} Z`;

export default function MiniChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white/60 p-4 shadow-sm backdrop-blur"
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs text-slate-500">BTC/USDT · dry run</div>
          <div className="text-xl font-bold text-brand-navy">64 210,45 $</div>
        </div>
        <div className="text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded">+3.24%</div>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#16a34a" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#16a34a" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path d={area} fill="url(#grad)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }} />
        <motion.path
          d={d}
          fill="none"
          stroke="#16a34a"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, ease: 'easeInOut' }}
        />
        {points.map((v, i) => (
          <motion.circle
            key={i}
            cx={toX(i)}
            cy={toY(v)}
            r="3"
            fill="#16a34a"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
          />
        ))}
      </svg>
    </motion.div>
  );
}
