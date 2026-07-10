'use client';

import { useState } from 'react';
import { ShieldCheck, ClipboardList } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

type Props = {
  selectedMachine: { name?: string } | null;
  compatibleParts: Part[];
  onAddPart: (part: Part) => void;
  onSubmitQuote: (opts: {
    contact_name: string;
    contact_email: string;
    contact_phone: string;
    machine_serial: string;
    notes: string;
  }) => void;
};

export default function QuotePrompt({ selectedMachine, compatibleParts, onAddPart, onSubmitQuote }: Props) {
  const [contact_name, setContactName] = useState('');
  const [contact_email, setContactEmail] = useState('');
  const [contact_phone, setContactPhone] = useState('');
  const [machine_serial, setMachineSerial] = useState('');
  const [notes, setNotes] = useState('');
  const [sent, setSent] = useState(false);

  const submit = () => {
    onSubmitQuote({
      contact_name,
      contact_email,
      contact_phone,
      machine_serial,
      notes,
    });
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm sticky top-4">
      <div className="flex items-center gap-2 mb-4">
        <ClipboardList className="w-4 h-4 text-brand-yellow" />
        <h2 className="text-lg font-bold text-brand-navy">Devis pièces — sélection machine</h2>
      </div>

      {selectedMachine && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 rounded border border-brand-yellow/30 bg-brand-yellow/10"
        >
          <div className="text-xs font-mono text-brand-navy/70 mb-1">Engin sélectionné</div>
          <div className="font-semibold text-brand-navy">{selectedMachine.name || '—'}</div>
          <input
            type="text"
            placeholder="N° de série de l'engin (optionnel)"
            value={machine_serial}
            onChange={(e) => setMachineSerial(e.target.value)}
            className="mt-2 w-full px-3 py-2 rounded border border-slate-200 text-sm focus:border-brand-yellow focus:ring-brand-yellow"
          />
        </motion.div>
      )}

      <div className="space-y-2 mb-4">
        {compatibleParts.map((part) => (
          <div key={part.id} className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
            <div className="flex-1">
              <div className="font-medium text-brand-navy">{part.reference}</div>
              <div className="text-xs text-slate-500">{part.name}</div>
              <div className="text-xs text-slate-600">{part.price_eur.toLocaleString('fr-FR')} €</div>
            </div>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => onAddPart(part)}
              className="text-xs bg-brand-navy text-white px-3 py-2 rounded font-semibold hover:brightness-110 transition"
            >
              Ajouter
            </motion.button>
          </div>
        ))}
        {compatibleParts.length === 0 && (
          <div className="text-sm text-slate-500 text-center py-4">
            Sélectionnez un engin pour afficher les pièces compatibles.
          </div>
        )}
      </div>

      <div className="space-y-2 mb-3">
        <input
          type="text"
          placeholder="Nom / entreprise"
          value={contact_name}
          onChange={(e) => setContactName(e.target.value)}
          className="w-full px-3 py-2 rounded border border-slate-200 text-sm focus:border-brand-yellow focus:ring-brand-yellow"
        />
        <input
          type="email"
          placeholder="Email"
          value={contact_email}
          onChange={(e) => setContactEmail(e.target.value)}
          className="w-full px-3 py-2 rounded border border-slate-200 text-sm focus:border-brand-yellow focus:ring-brand-yellow"
        />
        <input
          type="tel"
          placeholder="Téléphone"
          value={contact_phone}
          onChange={(e) => setContactPhone(e.target.value)}
          className="w-full px-3 py-2 rounded border border-slate-200 text-sm focus:border-brand-yellow focus:ring-brand-yellow"
        />
        <textarea
          placeholder="Précisions: application, chantier, pièces déjà installées..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-3 py-2 rounded border border-slate-200 text-sm focus:border-brand-yellow focus:ring-brand-yellow"
        />
      </div>

      <button
        onClick={submit}
        className="w-full bg-brand-forest text-white py-3 rounded font-semibold hover:brightness-110 transition"
      >
        Envoyer la demande de devis
      </button>

      <AnimatePresence>
        {sent && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 p-3 bg-brand-forest/10 border border-brand-forest rounded text-sm text-brand-forest flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            Devis envoyé. Réponse sous 24h avec tarif FOB Abidjan.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
