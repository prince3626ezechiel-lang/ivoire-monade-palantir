'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ArticleCard from './ArticleCard';

const ARTICLES = [
  {
    id: 'art-001',
    title: 'Koné : premier or attendu fin 2026 et besoin en engins de terrassement',
    date: '2026-07-04',
    category: 'Mining',
    source: 'Panafrican Visions / Montage Gold',
    url: 'https://panafricanvisions.com/2026/01/cote-divoire-montage-gold-advances-kone-project-targets-first-gold-pour-in-late-2026/',
    summary: 'Le projet Koné, en Côte d’Ivoire, avance avec des travaux civils terminés et l’installation de structures en cours. Cela génère un besoin fort en excavateurs, chargeuses et dump trucks pour la préparation de site.',
    products: ['ENG-XE215LC', 'ENG-XE215DA', 'ENG-XE80U'],
    locations: ['Koné', 'Odienné'],
  },
  {
    id: 'art-002',
    title: 'Tongon : extraction en continu et programmation de maintenance renforcée',
    date: '2026-07-04',
    category: 'Mining',
    source: 'DTP Bouygues Construction / Barrick',
    url: 'https://www.dtp-bouygues-construction.com/project/tongon-gold-mine/',
    summary: 'La mine de Tongon maintient des opérations minières continues. La logistique de maintenance et le rechange rapide deviennent critiques pour réduire l’indisponibilité des engins.',
    products: ['ENG-XE80U', 'ENG-XE215LC', 'ENG-XE230M'],
    locations: ['Tongon', 'Mbengué'],
  },
  {
    id: 'art-003',
    title: 'Plan Oil & Gas 2025-2050 : opportunités logistiques au nord et à Abidjan',
    date: '2026-07-04',
    category: 'Oil & Gas',
    source: 'ITA / GOICI',
    url: 'https://www.trade.gov/country-commercial-guides/cote-divoire-oil-and-gas',
    summary: 'La Côte d’Ivoire vise 500 000 barils/jour d’ici 2035. Les corridors logistiques et les sites de stockage créent des besoins en engins de levage, de manutention et de construction.',
    products: ['ENG-XE230M', 'ENG-XE215EV', 'ENG-XE75SL'],
    locations: ['Abidjan', 'San-Pédro', 'Koumassi'],
  },
  {
    id: 'art-004',
    title: 'Africa Mining Equipment Market : +24% d’ici 2027 en Côte d’Ivoire',
    date: '2026-07-04',
    category: 'Market',
    source: '6Wresearch',
    url: 'https://www.6wresearch.com/industry-report/ivory-coast-mining-equipment-market',
    summary: 'Le marché ivoirien des équipements miniers croît fortement. Cela accélère les besoins en excavateurs, dump trucks, pelles et godets adaptés aux sols latéritiques.',
    products: ['ENG-XE215DA', 'ENG-XE215LC', 'ENG-XE80U'],
    locations: ['Abidjan', 'Yamoussoukro', 'San-Pédro'],
  },
];

export default function NewsPage() {
  const [filter, setFilter] = useState<string>('all');

  const filtered =
    filter === 'all' ? ARTICLES : ARTICLES.filter((a) => a.category === filter);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-brand-navy text-white px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-3"
          >
            Marchés & cas d’usage CI
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-slate-300 max-w-2xl"
          >
            Articles et retours d’expérience pour relier chaque engin XCMG à un usage terrain :
            mines, oil & gas, construction et ports.
          </motion.p>

          <div className="mt-5 flex gap-2">
            {['all', 'Mining', 'Oil & Gas', 'Market'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 rounded text-sm font-semibold transition ${
                  filter === cat
                    ? 'bg-brand-yellow text-brand-navy'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {cat === 'all' ? 'Tout' : cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((article, idx) => (
            <ArticleCard key={article.id} article={article} index={idx} />
          ))}
        </div>
      </main>
    </div>
  );
}
