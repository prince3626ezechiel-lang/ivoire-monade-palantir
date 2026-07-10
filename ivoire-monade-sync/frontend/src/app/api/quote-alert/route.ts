import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

type Quote = {
  id?: string;
  source: string;
  section: string;
  client_name?: string;
  contact_email?: string;
  contact_phone?: string;
  machine_serial?: string;
  items: unknown[];
  total_eur: number;
  currency: string;
  status: string;
};

const INBOX = join(process.env.HOME || '/root', '.null', 'inbox');

async function writeTicket(quote: Quote) {
  await mkdir(INBOX, { recursive: true });
  const file = join(INBOX, `quote-${Date.now()}.json`);
  await writeFile(file, JSON.stringify(quote, null, 2), 'utf8');
  return file;
}

async function writeEvidence(type: string, payload: unknown) {
  const dir = join(process.env.HOME || '/root', '.null', 'evidence');
  await mkdir(dir, { recursive: true });
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const file = join(dir, `${ts}-${type}.json`);
  await writeFile(file, JSON.stringify({ ts, type, payload }, null, 2), 'utf8');
  return file;
}

async function sendTelegram(quote: Quote) {
  try {
    const res = await fetch('http://127.0.0.1:17832', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: '6499054466',
        text: `Nouvelle demande de devis IVOIRE MONADE\nSource: ${quote.source}\nSection: ${quote.section}\nMontant: ${quote.total_eur} ${quote.currency}\nClient: ${quote.client_name ?? 'Prospect site'}`,
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      await writeEvidence('incident', { step: 'telegram', status: res.status, body });
      return { ok: false, reason: `gateway_${res.status}` };
    }
    const result = await res.json().catch(() => ({}));
    await writeEvidence('certificate', { step: 'telegram', result });
    await writeEvidence('handoff', { source: quote.source, section: quote.section, next: 'sales' });
    return { ok: true };
  } catch (e) {
    await writeEvidence('incident', { step: 'telegram', error: String(e) });
    return { ok: false, reason: 'gateway_unreachable' };
  }
}

export async function POST(request: Request) {
  try {
    const quote: Quote = await request.json();
    const ticketPath = await writeTicket(quote);
    const telegram = await sendTelegram(quote);
    return NextResponse.json({ ok: true, ticketPath, telegram });
  } catch (error) {
    await writeEvidence('incident', { step: 'quote-route', error: String(error) });
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
