import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const API_KEY = process.env.IVM_API_KEY || 'change-me';

app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    const key = req.headers['x-api-key'];
    const fromLocalhost = req.ip === '127.0.0.1' || req.ip === '::1';
    if (!fromLocalhost && key !== API_KEY) {
      return res.status(401).json({ error: 'unauthorized' });
    }
  }
  next();
});

app.use('/api/quote-alert', (req, res) => {
  res.status(202).json({ status: 'queued', source: 'ivoire-monade-backend' });
});

app.get('/api/dry-run/status', (req, res) => {
  res.json({
    status: 'ok',
    data: {
      btc: { price: 64210.45, changePct: 3.24, lastSignal: 'none' },
      eth: { price: 1790.42, changePct: 1.12, lastSignal: 'none' },
      updatedAt: new Date().toISOString(),
    },
  });
});

app.use(
  '/_next',
  createProxyMiddleware({ target: 'http://127.0.0.1:3000', changeOrigin: true, ws: true })
);

let landsCache = null;
let landsCacheAt = 0;
const LANDS_TTL_MS = 60_000;

function readLands() {
  const fs = require('fs');
  const path = require('path');
  const file = path.join(__dirname, '..', 'frontend', 'external', 'immobilier-ci-data', 'lands', 'index.jsonl');
  const raw = fs.readFileSync(file, 'utf8');
  const now = Date.now();
  if (!landsCache || now - landsCacheAt > LANDS_TTL_MS) {
    landsCache = raw
      .split('\n')
      .filter((line) => line.trim())
      .map((line) => JSON.parse(line));
    landsCacheAt = now;
  }
  return landsCache;
}

app.get('/api/lands', (req, res) => {
  const { city, type, min, max, q } = req.query;
  let data = readLands();
  if (city) data = data.filter((l) => l.city === city);
  if (type) data = data.filter((l) => l.type === type);
  if (min) data = data.filter((l) => l.price_xof >= Number(min));
  if (max) data = data.filter((l) => l.price_xof <= Number(max));
  if (q) {
    const query = String(q).toLowerCase();
    data = data.filter(
      (l) =>
        l.title.toLowerCase().includes(query) ||
        l.city.toLowerCase().includes(query) ||
        l.neighborhood.toLowerCase().includes(query)
    );
  }
  res.json({ status: 'ok', count: data.length, data });
});

app.get('/api/lands/:slug', (req, res) => {
  const lands = readLands();
  const item = lands.find((l) => l.slug === req.params.slug);
  if (!item) return res.status(404).json({ status: 'not_found' });
  res.json({ status: 'ok', data: item });
});

app.post('/api/reservation', (req, res) => {
  const body = req.body || {};
  const required = ['name', 'whatsapp', 'usage'];
  const missing = required.filter((k) => !body[k]);
  if (missing.length) {
    return res.status(400).json({ status: 'error', missing, message: 'Champs requis manquants' });
  }
  const ticket = {
    id: `TR-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 999 + 1)}`,
    createdAt: new Date().toISOString(),
    landSlug: body.landSlug || null,
    contact: {
      name: body.name,
      whatsapp: body.whatsapp,
      email: body.email || null,
      budget: body.budget || null,
      usage: body.usage,
    },
    message: body.message || null,
    source: 'site',
    status: 'new',
  };
  return res.status(202).json({ status: 'queued', ticket, whatsapp_prefill: `Bonjour, je suis intéressé par un terrain (${ticket.id})` });
});

app.get('*', (req, res) => {
  res.redirect(302, `http://127.0.0.1:3000${req.url}`);
});

const readOnlyWallet = '0x5c74572a0F5081a9696E6e3FEA3AE637a0204e0b';

const paperState = {
  mode: 'dry_run',
  capital: 10000,
  wallet: readOnlyWallet,
  positions: [],
  lastSignal: 'none',
  updatedAt: new Date().toISOString(),
};

function pnl() {
  let realized = 0;
  for (const p of paperState.positions) {
    if (p.status === 'closed') realized += p.pnl || 0;
  }
  return { realized, open: paperState.positions.filter(p => p.status === 'open').length };
}

app.get('/api/trading/status', (req, res) => {
  res.json({
    ok: true,
    mode: paperState.mode,
    autopilot: true,
    autodream: true,
    cycle: '8m',
    wallet: paperState.wallet,
    capital: paperState.capital,
    pnl: pnl(),
    lastSignal: paperState.lastSignal,
    updatedAt: paperState.updatedAt,
  });
});

app.get('/api/trading/positions', (req, res) => {
  res.json({ ok: true, data: paperState.positions });
});

app.post('/api/trading/signal', express.json(), (req, res) => {
  const body = req.body || {};
  const allowed = ['buy','sell','hold'];
  const side = String(body.side || 'hold').toLowerCase();
  if (!allowed.includes(side)) return res.status(400).json({ ok: false, error: 'bad side' });
  const ticket = {
    id: `PAPER-${Date.now()}-${Math.floor(Math.random()*900+100)}`,
    side,
    symbol: String(body.symbol || 'UNKNOWN'),
    qty: Number(body.qty || 0),
    price: Number(body.price || 0),
    status: side === 'hold' ? 'skipped' : 'open',
    pnl: 0,
    createdAt: new Date().toISOString(),
  };
  paperState.lastSignal = side;
  paperState.updatedAt = ticket.createdAt;
  if (ticket.status === 'open') paperState.positions.push(ticket);
  return res.status(202).json({ ok: true, ticket, mode: paperState.mode });
});

app.post('/api/trading/kill-switch', express.json(), (req, res) => {
  paperState.mode = paperState.mode === 'dry_run' ? 'stopped' : 'dry_run';
  paperState.lastSignal = paperState.mode === 'stopped' ? 'kill' : 'resume';
  paperState.updatedAt = new Date().toISOString();
  return res.json({ ok: true, mode: paperState.mode });
});

app.get('/api/trading/telegram/status', (req, res) => {
  res.json({ ok: true, telegram: { active: true, home: '6499054466', killKeyword: '/kill' } });
});

const port = Number(process.env.PORT) || 8080;
app.listen(port, '127.0.0.1', () => {
  console.log(`ivoire-monade backend on ${port}`);
});
