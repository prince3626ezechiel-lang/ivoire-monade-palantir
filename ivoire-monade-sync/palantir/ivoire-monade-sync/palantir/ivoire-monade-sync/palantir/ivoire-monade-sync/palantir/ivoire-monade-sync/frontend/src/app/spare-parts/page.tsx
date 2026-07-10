'use client';

import { useState } from 'react';
import { Search, X, ShoppingCart, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MachineLookup, { MachineHit } from './MachineLookup';
import QuotePrompt from './QuotePrompt';

type Part = {
  id: string;
  reference: string;
  name: string;
  category: string;
  compatible_machines: string[];
  price_eur: number;
  stock_qty: number;
  lead_time_days: number;
};

const MOCK_PARTS: Part[] = [
  {
    id: 'sp-001',
    reference: 'XCMG-SP-0001',
    name: 'Hydraulic Pump Assembly',
    category: 'Hydraulics',
    compatible_machines: ['XCMG XE215LC', 'XCMG XE215U'],
    price_eur: 2850,
    stock_qty: 12,
    lead_time_days: 7,
  },
  {
    id: 'sp-002',
    reference: 'XCMG-SP-0002',
    name: 'Engine Filter Kit',
    category: 'Engine',
    compatible_machines: ['XCMG XE215LC', 'XCMG XE60', 'XCMG LW300F'],
    price_eur: 320,
    stock_qty: 48,
    lead_time_days: 3,
  },
  {
    id: 'sp-003',
    reference: 'XCMG-SP-0003',
    name: 'Travel Motor',
    category: 'Undercarriage',
    compatible_machines: ['XCMG XE215LC'],
    price_eur: 4200,
    stock_qty: 4,
    lead_time_days: 14,
  },
  {
    id: 'sp-004',
    reference: 'XCMG-SP-0004',
    name: 'Control Valve Block',
    category: 'Hydraulics',
    compatible_machines: ['XCMG XE265LC', 'XCMG XE370'],
    price_eur: 1850,
    stock_qty: 8,
    lead_time_days: 10,
  },
  {
    id: 'sp-005',
    reference: 'XCMG-SP-0005',
    name: 'Bucket Tooth',
    category: 'Attachments',
    compatible_machines: ['XCMG XE215LC', 'XCMG XE265LC', 'XCMG XE370'],
    price_eur: 45,
    stock_qty: 200,
    lead_time_days: 2,
  },
];

const MOCK_MACHINES: MachineHit[] = [
  { id: 'ENG-XE215LC', name: 'XCMG XE215LC', family: 'LC Series', sku: 'XCMG-XE215LC', serial_clue: 'XCMG-215-YYYY-XXXX' },
  { id: 'ENG-XE265LC', name: 'XCMG XE265LC', family: 'LC Series', sku: 'XCMG-XE265LC', serial_clue: 'XCMG-265-YYYY-XXXX' },
  { id: 'ENG-XE370', name: 'XCMG XE370', family: 'LC Series', sku: 'XCMG-XE370', serial_clue: 'XCMG-370-YYYY-XXXX' },
];

export default function SparePartsPage() {
  const [query, setQuery] = useState('');
  const [machineFilter, setMachineFilter] = useState('');
  const [cart, setCart] = useState<Part[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<MachineHit | null>(null);

  const filtered = MOCK_PARTS.filter((p) => {
    const q = query.toLowerCase();
    const matchesQuery =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.reference.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.compatible_machines.some((m) => m.toLowerCase().includes(q));
    const matchesMachine =
      !machineFilter ||
      p.compatible_machines.some((m) =>
        m.toLowerCase().includes(machineFilter.toLowerCase())
      );
    return matchesQuery && matchesMachine;
  });

  const compatibilityAwareParts = selectedMachine
    ? filtered.filter((p) =>
        p.compatible_machines.some((m) =>
          m.toLowerCase().includes(selectedMachine.name?.toLowerCase() ?? '')
        )
      )
    : filtered;

  const addToCart = (part: Part) => setCart((c) => [...c, part]);
  const removeFromCart = (id: string) =>
    setCart((c) => c.filter((item) => item.id !== id));

  const submitQuote = () => {
    if (cart.length === 0) return;
    const quote = {
      id: `Q-2026-${String(Date.now()).slice(-4)}`,
      source: 'ivoire-monade.shop',
      section: 'spare-parts',
      client_name: 'Prospect site',
      contact_email: '',
      contact_phone: '',
      machine_serial: selectedMachine?.serial_clue ?? '',
      items: cart.map((p) => ({
        spare_part_id: p.id,
        reference: p.reference,
        label: p.name,
        unit_price_eur: p.price_eur,
        quantity: 1,
      })),
      total_eur: total,
      currency: 'EUR',
      status: 'draft',
    };
    fetch('/api/quote-alert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quote),
    })
      .then(() => setSubmitted(true))
      .catch(() => setSubmitted(true))
      .finally(() => setTimeout(() => setSubmitted(false), 4000));
  };

  const total = cart.reduce((sum, p) => sum + p.price_eur, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-brand-navy text-white px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold mb-2"
          >
            Pièces détachées XCMG
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-slate-300"
          >
            Prix exclusifs IVOIRE MONADE — livraison CI /Afrique
          </motion.p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Catalogue */}{' '}
          <div className="lg:col-span-2 space-y-4">
            {/* Machine-first lookup */}
            <div>
              <MachineLookup
                machines={MOCK_MACHINES}
                onSelect={(machine) => setSelectedMachine(machine)}
              />
              {selectedMachine && (
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-sm text-slate-600">
                    Pièces compatibles pour:{' '}
                    <span className="font-semibold text-brand-navy">{selectedMachine.name}</span>
                  </div>
                  <button
                    onClick={() => setSelectedMachine(null)}
                    className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <X className="w-3 h-3" /> Effacer
                  </button>
                </div>
              )}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Référence, nom, catégorie, engin..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded border border-slate-200 focus:border-brand-yellow focus:ring-brand-yellow"
                />
              </div>
              <input
                type="text"
                placeholder="Filtrer par engin (ex: XE215)"
                value={machineFilter}
                onChange={(e) => setMachineFilter(e.target.value)}
                className="px-4 py-2 rounded border border-slate-200 focus:border-brand-yellow focus:ring-brand-yellow"
              />
            </div>

            {/* Parts grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {compatibilityAwareParts.map((part) => (
                <motion.div
                  key={part.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-xs font-mono text-slate-500">{part.reference}</span>
                      <h3 className="font-semibold text-brand-navy">{part.name}</h3>
                    </div>
                    <span className="text-xs bg-brand-forest text-white px-2 py-1 rounded">
                      {part.category}
                    </span>
                  </div>

                  <div className="text-sm text-slate-600 mb-3">
                    Compatible: {part.compatible_machines.join(', ')}
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-xl font-bold text-brand-navy">
                        {part.price_eur.toLocaleString('fr-FR')} €
                      </div>
                      <div
                        className={`text-xs ${
                          part.stock_qty > 10 ? 'text-brand-forest' : 'text-red-600'
                        }`}
                      >
                        Stock: {part.stock_qty} | Délai: {part.lead_time_days}j
                      </div>
                    </div>
                    <button
                      onClick={() => addToCart(part)}
                      className="flex items-center gap-2 bg-brand-yellow text-brand-navy px-3 py-2 rounded font-semibold hover:brightness-110 transition"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Ajouter
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quote panel */}
          <div className="lg:col-span-1">
            <QuotePrompt
              selectedMachine={selectedMachine}
              compatibleParts={compatibilityAwareParts}
              onAddPart={addToCart}
              onSubmitQuote={(opts) => {
                console.log('quote submit', opts);
                setSubmitted(true);
                setTimeout(() => setSubmitted(false), 4000);
              }}
            />
            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 p-3 bg-brand-forest/10 border border-brand-forest rounded text-sm text-brand-forest flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  Devis envoyé. Nous vous répondons sous 24h.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
