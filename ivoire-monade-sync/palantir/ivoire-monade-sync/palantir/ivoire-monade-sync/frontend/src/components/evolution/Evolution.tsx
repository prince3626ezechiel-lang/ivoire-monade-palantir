'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

export default function Evolution() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const controls = useAnimation();

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
      const start = Date.now();
      const duration = 2400;
      const tick = () => {
        const elapsed = Date.now() - start;
        const p = Math.min(elapsed / duration, 1);
        setProgress(p);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }, [isInView, controls]);

  const variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const Circle = ({ delay = 0, size = 120, duration = 2.4, color = '#166534' }) => (
    <motion.div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay, duration: 0.6, ease: 'easeOut' }}
    >
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="6" />
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 45}`}
          animate={{ strokeDashoffset: [(1 - progress) * 2 * Math.PI * 45] }}
          transition={{ duration, ease: 'linear' }}
        />
      </svg>
      <div className="text-center z-10">
        <div className="text-2xl font-bold text-brand-navy">{Math.round(progress * 100)}%</div>
        <div className="text-xs text-slate-500">Évolution</div>
      </div>
    </motion.div>
  );

  return (
    <div ref={ref} className="w-full py-16 bg-white border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-6">
        <motion.h3
          variants={variants}
          initial="hidden"
          animate={controls}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-brand-navy mb-2"
        >
          IVOIRE MONADE <span className="text-brand-forest">Evolution</span>
        </motion.h3>
        <motion.p
          variants={variants}
          initial="hidden"
          animate={controls}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="text-slate-600 mb-10 max-w-2xl"
        >
          XCMG s'adapte. Notre ecosysteme evolue. Rejoignez la progression.
        </motion.p>

        <div className="flex flex-wrap justify-center gap-12 mb-12">
          <Circle delay={0} size={140} duration={2.8} color="#166534" />
          <Circle delay={0.2} size={140} duration={2.8} color="#A17846" />
          <Circle delay={0.4} size={140} duration={2.8} color="#F1C40F" />
        </div>

        <motion.div
          variants={variants}
          initial="hidden"
          animate={controls}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          <div className="p-6 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-sm font-semibold text-brand-forest mb-1">1 / Inventaire</div>
            <div className="text-slate-600">Catalogue XCMG + pieces referencees</div>
          </div>
          <div className="p-6 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-sm font-semibold text-brand-forest mb-1">2 / Connectivité</div>
            <div className="text-slate-600">WhatsApp + Telegram + MQTT live</div>
          </div>
          <div className="p-6 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-sm font-semibold text-brand-forest mb-1">3 / Odoo</div>
            <div className="text-slate-600">ERP unifié avec schémas vérifies</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
