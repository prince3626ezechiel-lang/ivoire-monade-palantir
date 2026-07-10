'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { products } from '@/data/products';

export default function Catalogue() {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-brand-navy mb-2">Catalogue XCMG</h2>
        <p className="text-slate-600 mb-8">Sélection issue du catalogue officiel. Prix et disponibilité confirmés sous 24h.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <motion.div whileHover={{ y: 4 }} key={p.id} className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition">
              <div className="aspect-video bg-slate-100 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.images[0]?.src} alt={p.name} className="w-full h-full object-cover" />
                <span className="absolute top-3 right-3 bg-brand-navy text-white text-xs px-2 py-1 rounded">{p.family}</span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-brand-navy">{p.name}</h3>
                <p className="text-sm text-slate-600 mt-1">{p.description_short}</p>
                <div className="mt-3 text-sm text-slate-700">
                  <span className="font-semibold">Poids op.:</span> {p.technical_specs.operating_weight_kg} kg · <span className="font-semibold">Puissance:</span> {p.technical_specs.rated_power_kw} kW
                </div>
                {p.use_cases?.length ? (
                  <div className="mt-3 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded p-2">
                    <span className="font-semibold text-brand-navy">Cas d’usage CI:</span>{' '}
                    {p.use_cases.map((u) => `${u.location} — ${u.activity}`).join(' · ')}
                  </div>
                ) : null}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Délai indicatif: {p.lead_time_days ?? 30} jours</span>
                  <Link href="/quote" className="bg-brand-yellow text-brand-navy px-3 py-2 rounded text-sm font-semibold hover:brightness-110 transition">Demander un devis</Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
