'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Activity,
  Radio,
  Brain,
  BarChart3,
  ShieldCheck,
  Zap,
  ChevronRight,
} from 'lucide-react';
import MiniChart from '@/components/trading/MiniChart';
import InspirationGrid from '@/components/trading/InspirationGrid';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const card = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } },
};

const ITEMS = [
  {
    title: 'Dry run live',
    desc: 'Validation journalière BTC/USDT + ETH/USDT sans ordres réels.',
    href: '/dashboard',
    icon: Activity,
    accent: 'from-emerald-500/10 to-emerald-500/0',
  },
  {
    title: 'Signaux Telegram',
    desc: 'Plans de trade, RSI, S/D zones et alertes directement sur Telegram.',
    href: '/dashboard',
    icon: Radio,
    accent: 'from-sky-500/10 to-sky-500/0',
  },
  {
    title: 'Psychologie & discipline',
    desc: 'Règles de trading, checklist risque, maximum 1% par trade.',
    href: '/dashboard',
    icon: Brain,
    accent: 'from-violet-500/10 to-violet-500/0',
  },
  {
    title: 'Stratégies scaffolds',
    desc: 'momentum breakout, S/D mean reversion, EMA/RSI, ICT FVG bounce.',
    href: '/dashboard',
    icon: BarChart3,
    accent: 'from-amber-500/10 to-amber-500/0',
  },
  {
    title: 'Risk management',
    desc: 'SL/TP structuré, taille de position, pas de revenge trading.',
    href: '/dashboard',
    icon: ShieldCheck,
    accent: 'from-rose-500/10 to-rose-500/0',
  },
  {
    title: 'Autopilot Learning',
    desc: 'Apprentissage continu toutes les 8 min depuis GitHub, HF et Telegram.',
    href: '/dashboard',
    icon: Zap,
    accent: 'from-orange-500/10 to-orange-500/0',
  },
];

export default function TradingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="relative overflow-hidden bg-brand-navy text-white px-6 py-12">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-yellow/40 via-transparent to-transparent" />
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand-yellow/20 blur-3xl" />
        <div className="max-w-6xl mx-auto relative">
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold tracking-tight"
          >
            Trading IVOIRE MONADE
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-slate-300 text-sm mt-3 max-w-2xl leading-relaxed"
          >
            Stack open source, dry run structuré, autopilot Telegram.
            Aucun ordre live sans validation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex flex-wrap gap-3"
          >
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-brand-yellow text-brand-navy px-5 py-2.5 rounded-xl font-semibold hover:brightness-110 transition"
            >
              Ouvrir le dashboard
            </Link>
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 border border-white/20 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-white/10 transition"
            >
              Retour aux devis
            </Link>
          </motion.div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        <motion.section
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {ITEMS.map((item) => (
            <motion.div
              key={item.title}
              variants={card}
              whileHover={{ y: 6, scale: 1.012 }}
              className="group relative overflow-hidden border border-slate-200 bg-white rounded-2xl shadow-sm hover:shadow-xl transition"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.accent}`} />
              <div className="relative p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-brand-forest font-semibold">
                    <item.icon className="w-5 h-5" />
                    {item.title}
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-navy transition" />
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mt-2">{item.desc}</p>
                <Link
                  href={item.href}
                  className="mt-3 inline-block text-sm font-semibold text-brand-navy underline underline-offset-4 decoration-slate-300 group-hover:decoration-brand-navy transition"
                >
                  Ouvrir
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.section>

        <MiniChart />

        <section className="space-y-4">
          <h3 className="text-lg font-bold text-brand-navy">Inspiration UI</h3>
          <InspirationGrid />
        </section>
        </main>
    </div>
  );
}
