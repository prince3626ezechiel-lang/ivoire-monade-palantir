'use client';

import { useState } from 'react';
import { Search, Wrench } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type MachineHit = {
  id: string;
  name: string;
  family: string;
  sku: string;
  serial_clue: string;
};

type Props = {
  machines: MachineHit[];
  onSelect: (machine: MachineHit) => void;
};

export default function MachineLookup({ machines, onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const filtered = machines.filter((m) => {
    const q = query.toLowerCase();
    if (!q) return true;
    return (
      m.name.toLowerCase().includes(q) ||
      m.family.toLowerCase().includes(q) ||
      m.sku.toLowerCase().includes(q) ||
      m.serial_clue.toLowerCase().includes(q)
    );
  });

  return (
    <div className="relative">
      <div className="relative">
        <Wrench className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Rechercher par modèle, série ou SKU engin (ex: XE215LC)..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className="w-full pl-10 pr-4 py-2 rounded border border-slate-200 focus:border-brand-yellow focus:ring-brand-yellow bg-white"
        />
      </div>

      <AnimatePresence>
        {open && query.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute z-20 mt-2 w-full bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden"
          >
            {filtered.length === 0 && (
              <li className="px-4 py-3 text-sm text-slate-500">Aucun engin trouvé</li>
            )}
            {filtered.map((m) => (
              <li key={m.id}>
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onSelect(m);
                    setQuery(m.name);
                    setOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-brand-navy/5 transition"
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-semibold text-brand-navy">{m.name}</span>
                    <span className="text-xs text-slate-500 font-mono">{m.sku}</span>
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    {m.family} — {m.serial_clue}
                  </div>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
