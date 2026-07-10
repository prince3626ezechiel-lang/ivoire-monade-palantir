'use client';
import { motion } from 'framer-motion';
import { ShieldCheck, FileCheck, Lock, BadgeCheck } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 * i, type: 'spring', stiffness: 120 },
  }),
};

const badges = [
  {
    icon: <FileCheck size={18} />,
    label: 'Titre vérifié',
    sub: 'AD / ACF / AUI',
  },
  {
    icon: <BadgeCheck size={18} />,
    label: 'Notaire partenaire',
    sub: 'Certifié',
  },
  {
    icon: <Lock size={18} />,
    label: 'Paiement sécurisé',
    sub: 'Séquestre notarié',
  },
  { icon: <ShieldCheck size={18} />, label: 'Non-litigieux', sub: 'Attesté' },
];

export default function TrustBadges() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {badges.map((b, i) => (
        <motion.div
          key={b.label}
          custom={i}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
        >
          <span className="text-emerald-400">{b.icon}</span>
          <span className="text-xs font-semibold leading-tight">
            {b.label}
            <span className="block text-[10px] text-white/60">{b.sub}</span>
          </span>
        </motion.div>
      ))}
    </div>
  );
}
