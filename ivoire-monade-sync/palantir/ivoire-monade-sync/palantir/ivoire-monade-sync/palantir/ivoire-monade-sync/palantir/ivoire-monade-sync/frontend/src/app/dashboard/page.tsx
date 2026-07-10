'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Radio } from 'lucide-react';

type DryRunPoint = {
  price: number;
  updatedAt: string;
};

export default function DashboardPage() {
  const [btc, setBtc] = useState<DryRunPoint | null>(null);
  const [eth, setEth] = useState<DryRunPoint | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch('/api/dry-run/status');
        if (!res.ok) throw new Error('fetch failed');
        const json = await res.json();
        if (!cancelled) {
          setBtc({
            price: json.data.btc.price,
            updatedAt: json.data.btc.updatedAt || new Date().toISOString(),
          });
          setEth({
            price: json.data.eth.price,
            updatedAt: json.data.eth.updatedAt || new Date().toISOString(),
          });
          setError(null);
        }
      } catch (e) {
        if (!cancelled) setError('Flux dry_run indisponible');
      }
    };
    load();
    const id = setInterval(load, 15000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-brand-navy text-white px-6 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Dashboard Live</h1>
            <p className="text-slate-300 text-sm">Dry run structuré + alertes Telegram.</p>
          </div>
          <Radio className="w-5 h-5 text-brand-yellow" />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        {error && (
          <div className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-3">{error}</div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'BTC/USDT', value: btc?.price ?? '—' },
            { title: 'ETH/USDT', value: eth?.price ?? '—' },
            { title: 'Drawdown', value: '0%' },
            { title: 'Alertes', value: '0' },
          ].map((kpi) => (
            <div key={kpi.title} className="border border-slate-200 bg-white rounded-xl p-5 shadow-sm">
              <div className="text-sm text-slate-500">{kpi.title}</div>
              <div className="text-2xl font-bold text-brand-navy mt-1">{kpi.value}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
