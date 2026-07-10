'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Wrench, ShoppingCart, FileText, Radio, BarChart3 } from 'lucide-react';

const NAV = [
  { href: '/', label: 'Catalogue', icon: Wrench },
  { href: '/quote', label: 'Devis', icon: FileText },
  { href: '/spare-parts', label: 'Pièces', icon: ShoppingCart },
  { href: '/trading', label: 'Trading', icon: BarChart3 },
  { href: '/dashboard', label: 'Live', icon: Radio },
];

import Evolution from '@/components/evolution/Evolution';
import WhatsAppConnect from '@/components/whatsapp/WhatsAppConnect';
import CatalogueSection from '@/components/products/CatalogueSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-brand-navy text-white">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">IVOIRE MONADE</h1>
            <p className="text-slate-300 text-sm">XCMG Heavy Equipment & Spare Parts</p>
          </div>
          <nav className="flex gap-6">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="flex items-center gap-2 text-sm hover:text-brand-yellow transition">
                <n.icon className="w-4 h-4" />
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16 text-center">
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold text-brand-navy mb-4">
          Engins XCMG pour l’Afrique
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-slate-600 mb-8">
          Prix directs • Support local • Livraison FOB Abidjan • Pièces en stock
        </motion.p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/quote" className="bg-brand-yellow text-brand-navy px-6 py-3 rounded font-semibold hover:brightness-110 transition">Demander un devis</Link>
          <Link href="/spare-parts" className="border border-brand-navy text-brand-navy px-6 py-3 rounded font-semibold hover:bg-brand-navy hover:text-white transition">Pièces détachées</Link>
          <Link href="/trading" className="border border-slate-200 text-slate-900 px-6 py-3 rounded font-semibold hover:bg-slate-100 transition">Stack trading open source</Link>
        </div>
      </main>

      <CatalogueSection />

      <WhatsAppConnect />
      <Evolution />
    </div>
  );
}
