'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, TrendingUp, ShieldCheck, Wrench } from 'lucide-react';

type Product = {
  id: string;
  name: string;
  type: 'excavator' | 'loader' | 'bulldozer' | 'crane';
  power_hp: number;
  operating_weight_kg: number;
  bucket_m3: number;
  price_eur: number;
  image: string;
};

const PRODUCTS: Product[] = [
  {
    id: 'PRD-001',
    name: 'XCMG XE215',
    type: 'excavator',
    power_hp: 158,
    operating_weight_kg: 21500,
    bucket_m3: 0.8,
    price_eur: 95000,
    image: '/assets/images/xe215.jpg',
  },
  {
    id: 'PRD-002',
    name: 'XCMG LW300F',
    type: 'loader',
    power_hp: 160,
    operating_weight_kg: 18000,
    bucket_m3: 3.0,
    price_eur: 82000,
    image: '/assets/images/lw300f.jpg',
  },
  {
    id: 'PRD-003',
    name: 'XCMG XS203',
    type: 'bulldozer',
    power_hp: 180,
    operating_weight_kg: 20300,
    bucket_m3: 4.2,
    price_eur: 88000,
    image: '/assets/images/xs203.jpg',
  },
  {
    id: 'PRD-004',
    name: 'XCMG QY25',
    type: 'crane',
    power_hp: 220,
    operating_weight_kg: 28000,
    bucket_m3: 0,
    price_eur: 145000,
    image: '/assets/images/qy25.jpg',
  },
];

const COMPARISON = {
  price_position: '30-40% sous Caterpillar, prix comparable SANY mais SAV local renforcé IVOIRE MONADE',
  delivery_ci: 'Délais 6-8 semaines FOB Abidjan vs 12-16 semaines pour les marques historiques',
  support_local: 'Support francophone 24/7, pièces en stock Abidjan, hotline dédiée',
  financing: 'Facilités de paiement locales, leasing partenaires CI, OHADA-compliant',
};

export default function QuotePage() {
  const [selected, setSelected] = useState<Product[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const toggle = (p: Product) =>
    setSelected((s) =>
      s.find((x) => x.id === p.id) ? s.filter((x) => x.id !== p.id) : [...s, p]
    );

  const total = selected.reduce((sum, p) => sum + p.price_eur, 0);

  const submitQuote = () => {
    if (selected.length === 0) return;
    const quote = {
      id: `Q-2026-${String(Date.now()).slice(-4)}`,
      source: 'ivoire-monade.shop',
      section: 'catalogue',
      client_name: 'Prospect site',
      contact_email: '',
      contact_phone: '',
      items: selected.map((p) => ({
        product_id: p.id,
        label: p.name,
        unit_price_eur: p.price_eur,
        quantity: 1,
      })),
      total_eur: total,
      currency: 'EUR',
      status: 'draft',
    };
    fetch('/api/quote-alert', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(quote)})
      .then(() => setSubmitted(true))
      .catch(() => setSubmitted(true))
      .finally(() => setTimeout(() => setSubmitted(false), 4000));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-brand-navy text-white px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">
            Devis personnalisé — IVOIRE MONADE
          </h1>
          <p className="text-slate-300">
            Nos prix XCMG, transparence totale, réponse sous 24h
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Mini benchmarking */}
        <section className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-bold text-brand-navy mb-4">
            Pourquoi XCMG via IVOIRE MONADE ?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 rounded">
              <div className="flex items-center gap-2 text-brand-forest font-semibold mb-1">
                <TrendingUp className="w-4 h-4" />
                Prix compétitifs
              </div>
              <p className="text-sm text-slate-600">
                {COMPARISON.price_position}
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded">
              <div className="flex items-center gap-2 text-brand-forest font-semibold mb-1">
                <Wrench className="w-4 h-4" />
                Délais Abidjan
              </div>
              <p className="text-sm text-slate-600">
                {COMPARISON.delivery_ci}
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded">
              <div className="flex items-center gap-2 text-brand-forest font-semibold mb-1">
                <ShieldCheck className="w-4 h-4" />
                Support local
              </div>
              <p className="text-sm text-slate-600">
                {COMPARISON.support_local}
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded">
              <div className="flex items-center gap-2 text-brand-forest font-semibold mb-1">
                <CheckCircle2 className="w-4 h-4" />
                Financement CI
              </div>
              <p className="text-sm text-slate-600">
                {COMPARISON.financing}
              </p>
            </div>
          </div>
        </section>

        {/* Product selector */}
        <section>
          <h2 className="text-lg font-bold text-brand-navy mb-4">
            Sélectionnez vos engins
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRODUCTS.map((p) => {
              const active = selected.find((x) => x.id === p.id);
              return (
                <motion.div
                  key={p.id}
                  onClick={() => toggle(p)}
                  className={`cursor-pointer border rounded-lg p-4 transition-colors ${
                    active
                      ? 'border-brand-yellow bg-brand-yellow/10'
                      : 'border-slate-200 bg-white hover:border-brand-yellow'
                  }`}
                >
                  <div className="aspect-video bg-slate-100 rounded mb-3 flex items-center justify-center text-slate-400 text-xs">
                    {p.name}
                  </div>
                  <h3 className="font-semibold text-brand-navy">{p.name}</h3>
                  <div className="text-sm text-slate-600">
                    {p.power_hp} ch | {p.operating_weight_kg.toLocaleString('fr-FR')} kg
                    {p.bucket_m3 ? ` | ${p.bucket_m3} m³` : ''}
                  </div>
                  <div className="mt-2 text-xl font-bold text-brand-navy">
                    {p.price_eur.toLocaleString('fr-FR')} €
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Quote CTA */}
        <section className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-brand-navy">
                Votre devis XCMG
              </h3>
              <p className="text-slate-600">
                {selected.length > 0
                  ? `${selected.length} engin(s) sélectionné(s)`
                  : 'Sélectionnez au moins un engin pour obtenir un devis'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-brand-navy">
                {total.toLocaleString('fr-FR')} €
              </div>
              <button
                disabled={selected.length === 0}
                onClick={submitQuote}
                className="mt-2 bg-brand-forest text-white px-6 py-3 rounded font-semibold hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Demander le devis
              </button>
            </div>
          </div>

          <AnimatePresence>
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 p-3 bg-brand-forest/10 border border-brand-forest rounded text-sm text-brand-forest"
              >
                Devis envoyé. Un commercial vous confirme sous 24h.
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}
