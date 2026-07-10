'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { MessageCircle, Phone, CheckCircle2, AlertCircle } from 'lucide-react';

type Message = {
  id: string;
  from: string;
  text: string;
  at: string;
  status: 'sent' | 'delivered' | 'read';
};

const MOCK_INBOX: Message[] = [
  { id: 'm1', from: '+2250700000000', text: 'Bonjour, prix pour XE215 ?', at: '2026-07-04T09:00:00Z', status: 'read' },
  { id: 'm2', from: '+2250500000000', text: 'Délai de livraison Abidjan ?', at: '2026-07-04T09:05:00Z', status: 'delivered' },
];

export default function WhatsAppConnect() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [phone, setPhone] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState(false);
  const [input, setInput] = useState('');

  const connect = () => {
    if (!phone) return;
    // TODO: call backend WhatsApp bridge with phone
    console.log('WhatsApp connect:', phone);
    setConnected(true);
    setMessages(MOCK_INBOX);
  };

  const send = () => {
    if (!input.trim()) return;
    const msg: Message = {
      id: `m${Date.now()}`,
      from: phone,
      text: input.trim(),
      at: new Date().toISOString(),
      status: 'sent',
    };
    setMessages((m) => [...m, msg]);
    setInput('');
    // TODO: send via backend
  };

  return (
    <div ref={ref} className="w-full py-16 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Connect */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm"
        >
          <h3 className="text-xl font-bold text-brand-navy mb-2">WhatsApp Business</h3>
          <p className="text-sm text-slate-600 mb-4">
            Connexion du numero pour recevoir les leads et envoyer des devis.
          </p>

          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="tel"
                placeholder="+2250700000000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 px-3 py-2 rounded border border-slate-200 focus:border-brand-yellow focus:ring-brand-yellow"
              />
              <button
                onClick={connect}
                className="bg-brand-forest text-white px-4 py-2 rounded font-semibold hover:brightness-110 transition"
              >
                Connecter
              </button>
            </div>

            <div className="flex items-center gap-2 text-sm">
              {connected ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-brand-forest" />
                  <span className="text-brand-forest">Connecté</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-500">Non connecté</span>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Right: Live inbox */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="w-4 h-4 text-brand-forest" />
            <h4 className="font-semibold text-brand-navy">Messages</h4>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {messages.length === 0 && (
              <div className="text-sm text-slate-500">Aucun message pour l’instant.</div>
            )}
            {messages.map((m) => (
              <div key={m.id} className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-slate-400 mt-1" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-brand-navy">{m.from}</div>
                  <div className="text-sm text-slate-700">{m.text}</div>
                  <div className="text-xs text-slate-400">{new Date(m.at).toLocaleString('fr-FR')}</div>
                </div>
                <div className="text-xs text-slate-500">{m.status}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ecrire un message..."
              className="flex-1 px-3 py-2 rounded border border-slate-200 focus:border-brand-yellow focus:ring-brand-yellow"
            />
            <button
              onClick={send}
              className="bg-brand-navy text-white px-4 py-2 rounded font-semibold hover:brightness-110 transition"
            >
              Envoyer
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
