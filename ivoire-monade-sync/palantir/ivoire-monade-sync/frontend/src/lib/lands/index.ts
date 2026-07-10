export interface Land {
  id: string;
  slug: string;
  title: string;
  city: string;
  commune: string;
  neighborhood: string;
  country: string;
  type: 'residentiel' | 'commercial' | 'industriel' | 'loisirs' | 'agricole';
  usage: string;
  status: 'disponible' | 'reserve' | 'vendu';
  surface_m2: number;
  surface_unit: string;
  price_xof: number;
  price_currency: string;
  price_negotiable: boolean;
  price_ttc: boolean;
  notary_fees_xof: number;
  security_deposit_xof: number;
  title_type: string;
  title_number: string;
  title_status: 'verifie' | 'en_attente' | 'conteste';
  title_document_url: string;
  cadastral_plan_url: string;
  urbanization_status: 'loti' | 'non_loti';
  utilities: string[];
  photos: string[];
  drone_video_url: string;
  virtual_tour_url: string;
  description: string;
  features: string[];
  latitude: number;
  longitude: number;
  notary_partner_id: string;
  developer_name: string;
  developer_siret: string;
  commission_ttc: boolean;
  commission_rate: number;
  created_at: string;
  updated_at: string;
  meta: {
    indexed: boolean;
    dispute_free: boolean;
    url: string;
  };
}

export async function getAllLands(): Promise<Land[]> {
  const fs = await import('fs');
  const path = await import('path');
  const file = path.join(process.cwd(), 'external', 'immobilier-ci-data', 'lands', 'index.jsonl');
  const raw = fs.readFileSync(file, 'utf8');
  return raw
    .split('\n')
    .filter((line) => line.trim())
    .map((line) => JSON.parse(line) as Land);
}

export async function getLandBySlug(slug: string): Promise<Land | null> {
  const lands = await getAllLands();
  return lands.find((l) => l.slug === slug) ?? null;
}

export function formatXOF(n: number): string {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
}

export function landWhatsAppLink(land: Land, phone = '2250700000000'): string {
  const text = encodeURIComponent(
    `Bonjour, je suis intéressé par le terrain : ${land.title} — ${land.city}, ${formatXOF(land.price_xof)}. Pouvez-vous me donner plus d'informations ?`
  );
  return `https://wa.me/${phone}?text=${text}`;
}
