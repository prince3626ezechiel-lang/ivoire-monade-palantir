export type Product = {
  id: string;
  type: 'engin' | 'piece_detachee' | 'option' | 'kit' | 'service';
  category: string;
  family: string;
  brand: 'XCMG' | 'autre';
  name: string;
  sku: string;
  mpn: string | null;
  description_short: string;
  description_long: string;
  price_type: 'partenaire' | 'public' | 'sur_devis';
  prices: {
    base_currency: string;
    partner_price_usd: number | null;
    retail_price_usd: number | null;
    min_order_qty: number | null;
    price_notes: string | null;
  };
  availability: 'en_stock' | 'sur_commande' | 'disponible_30j' | 'disponible_60j' | 'disponible_90j' | 'epuise' | 'inconnu';
  lead_time_days: number | null;
  warranty_months: number | null;
  origin_country: string | null;
  images: Array<{ src: string; alt: string; scene: 'photo_5k' | 'fiche_technique' | 'packaging' | 'chantier' | 'certificat'; license?: string; width?: number | null; height?: number | null }>;
  technical_specs: Record<string, string | number>;
  compliance?: Record<string, string>;
  documents?: Array<{ title: string; href: string; mime: string }>;
  tags?: string[];
  slug?: string | null;
  created_at: string;
  updated_at: string;
  use_cases?: Array<{ location: string; activity: string; context: string }>;
};

export const products = [
  {
    id: 'ENG-XE18U',
    type: 'engin',
    category: 'Excavator',
    family: 'U Series',
    brand: 'XCMG',
    name: 'XE18U',
    sku: 'XCMG-XE18U',
    mpn: null,
    description_short: 'Mini excavator 1.79t, 11.8kW, ideal for confined sites.',
    description_long: 'Compact crawler excavator from XCMG U Series, suited for urban, landscaping, and light foundation work.',
    price_type: 'sur_devis',
    prices: { base_currency: 'USD', partner_price_usd: null, retail_price_usd: null, min_order_qty: 1, price_notes: 'Quote required; FOB Xuzhou or 48h Abidjan delivery.' },
    availability: 'disponible_30j',
    lead_time_days: 30,
    warranty_months: 12,
    origin_country: 'China',
    images: [{ src: '/products/xcmg/xe18u.jpg', alt: 'XE18U mini excavator', scene: 'fiche_technique', license: 'XCMG_official' }],
    technical_specs: { operating_weight_kg: 1795, bucket_capacity_m3: 0.04, rated_power_kw: 11.8, engine_speed_rpm: 2300 },
    compliance: {},
    tags: ['mini-excavator', 'u-series', 'urban', '1-5t'],
    slug: 'xe18u',
    created_at: '2026-07-04T00:00:00Z',
    updated_at: '2026-07-04T00:00:00Z'
  },
  {
    id: 'ENG-XE27U-CANOPY',
    type: 'engin',
    category: 'Excavator',
    family: 'U Series',
    brand: 'XCMG',
    name: 'XE27U Canopy',
    sku: 'XCMG-XE27U-CANOPY',
    mpn: null,
    description_short: 'Compact excavator 2.68t, open canopy, 15.4kW.',
    description_long: 'Compact excavator with open canopy for easy transport and rental fleets.',
    price_type: 'sur_devis',
    prices: { base_currency: 'USD', partner_price_usd: null, retail_price_usd: null, min_order_qty: 1, price_notes: 'Quote required' },
    availability: 'disponible_30j',
    lead_time_days: 30,
    warranty_months: 12,
    origin_country: 'China',
    images: [{ src: '/products/xcmg/xe27u.jpg', alt: 'XE27U canopy', scene: 'fiche_technique', license: 'XCMG_official' }],
    technical_specs: { operating_weight_kg: 2680, bucket_capacity_m3: 0.06, rated_power_kw: 15.4, engine_speed_rpm: 2400 },
    compliance: {},
    tags: ['mini-excavator', 'u-series', 'canopy', '1-5t'],
    slug: 'xe27u-canopy',
    created_at: '2026-07-04T00:00:00Z',
    updated_at: '2026-07-04T00:00:00Z'
  },
  {
    id: 'ENG-XE35U',
    type: 'engin',
    category: 'Excavator',
    family: 'U Series',
    brand: 'XCMG',
    name: 'XE35U',
    sku: 'XCMG-XE35U',
    mpn: null,
    description_short: 'Compact excavator 4.2t, 0.12m3 bucket, 18.2kW.',
    description_long: 'Versatile compact excavator for utility and civil works.',
    price_type: 'sur_devis',
    prices: { base_currency: 'USD', partner_price_usd: null, retail_price_usd: null, min_order_qty: 1, price_notes: 'Quote required' },
    availability: 'disponible_30j',
    lead_time_days: 30,
    warranty_months: 12,
    origin_country: 'China',
    images: [{ src: '/products/xcmg/xe35u.jpg', alt: 'XE35U', scene: 'fiche_technique', license: 'XCMG_official' }],
    technical_specs: { operating_weight_kg: 4200, bucket_capacity_m3: 0.12, rated_power_kw: 18.2, engine_speed_rpm: 2200 },
    compliance: {},
    tags: ['compact-excavator', 'u-series', '5-10t'],
    slug: 'xe35u',
    created_at: '2026-07-04T00:00:00Z',
    updated_at: '2026-07-04T00:00:00Z'
  },
  {
    id: 'ENG-XE75U',
    type: 'engin',
    category: 'Excavator',
    family: 'U Series',
    brand: 'XCMG',
    name: 'XE75U',
    sku: 'XCMG-XE75U',
    mpn: null,
    description_short: 'Mid-size excavator 7.68t, 45kW, ideal for utilities.',
    description_long: 'Mid-size crawler excavator balancing power and transportability.',
    price_type: 'sur_devis',
    prices: { base_currency: 'USD', partner_price_usd: null, retail_price_usd: null, min_order_qty: 1, price_notes: 'Quote required' },
    availability: 'disponible_30j',
    lead_time_days: 30,
    warranty_months: 12,
    origin_country: 'China',
    images: [{ src: '/products/xcmg/xe75u.jpg', alt: 'XE75U', scene: 'fiche_technique', license: 'XCMG_official' }],
    technical_specs: { operating_weight_kg: 7680, bucket_capacity_m3: 0.33, rated_power_kw: 45, engine_speed_rpm: 2200 },
    compliance: {},
    tags: ['mid-excavator', 'u-series', '5-10t'],
    slug: 'xe75u',
    created_at: '2026-07-04T00:00:00Z',
    updated_at: '2026-07-04T00:00:00Z',
    use_cases: [
      { location: 'Tongon', activity: 'Gold mine support', context: 'Accompagnement des travaux auxiliaires sur site minier.' },
      { location: 'Abidjan', activity: 'Urban utilities', context: 'Travaux utilitaires et réseaux en zone urbaine.' }
    ]
  },
  {
    id: 'ENG-XE80U',
    type: 'engin',
    category: 'Excavator',
    family: 'U Series',
    brand: 'XCMG',
    name: 'XE80U',
    sku: 'XCMG-XE80U',
    mpn: null,
    description_short: 'Excavator 9.25t, 0.33m3 bucket, 54.6kW.',
    description_long: 'Workhorse excavator for small civil and infrastructure tasks.',
    price_type: 'sur_devis',
    prices: { base_currency: 'USD', partner_price_usd: null, retail_price_usd: null, min_order_qty: 1, price_notes: 'Quote required' },
    availability: 'disponible_30j',
    lead_time_days: 30,
    warranty_months: 12,
    origin_country: 'China',
    images: [{ src: '/products/xcmg/xe80u.jpg', alt: 'XE80U', scene: 'fiche_technique', license: 'XCMG_official' }],
    technical_specs: { operating_weight_kg: 9250, bucket_capacity_m3: 0.33, rated_power_kw: 54.6, engine_speed_rpm: 2200 },
    compliance: {},
    tags: ['mid-excavator', 'u-series', '10-20t'],
    slug: 'xe80u',
    created_at: '2026-07-04T00:00:00Z',
    updated_at: '2026-07-04T00:00:00Z',
    use_cases: [
      { location: 'Koné', activity: 'Mining early works', context: 'Préparation de site et accès pour le projet Koné.' },
      { location: 'San-Pédro', activity: 'Port logistics', context: 'Entretien des zones logistiques portuaires.' }
    ]
  },
  {
    id: 'ENG-XE75SL',
    type: 'engin',
    category: 'Excavator',
    family: 'Amphibious',
    brand: 'XCMG',
    name: 'XE75SL',
    sku: 'XCMG-XE75SL',
    mpn: null,
    description_short: 'Amphibious excavator 10.6t, 42.4kW.',
    description_long: 'Amphibious undercarriage excavator for waterlogged and coastal work.',
    price_type: 'sur_devis',
    prices: { base_currency: 'USD', partner_price_usd: null, retail_price_usd: null, min_order_qty: 1, price_notes: 'Quote required' },
    availability: 'disponible_30j',
    lead_time_days: 30,
    warranty_months: 12,
    origin_country: 'China',
    images: [{ src: '/products/xcmg/xe75sl.jpg', alt: 'XE75SL amphibious excavator', scene: 'fiche_technique', license: 'XCMG_official' }],
    technical_specs: { operating_weight_kg: 10600, bucket_capacity_m3: 0.21, rated_power_kw: 42.4 },
    compliance: {},
    tags: ['amphibious', 'excavator', 'special'],
    slug: 'xe75sl',
    created_at: '2026-07-04T00:00:00Z',
    updated_at: '2026-07-04T00:00:00Z'
  },
  {
    id: 'ENG-XE215EV',
    type: 'engin',
    category: 'Excavator',
    family: 'New Energy',
    brand: 'XCMG',
    name: 'XE215EV',
    sku: 'XCMG-XE215EV',
    mpn: null,
    description_short: 'Electric excavator 23.5t, 120kW, 1.05m3 bucket.',
    description_long: 'Battery-electric crawler excavator for low-emission quarry and construction work.',
    price_type: 'sur_devis',
    prices: { base_currency: 'USD', partner_price_usd: null, retail_price_usd: null, min_order_qty: 1, price_notes: 'Quote required' },
    availability: 'sur_commande',
    lead_time_days: 45,
    warranty_months: 12,
    origin_country: 'China',
    images: [{ src: '/products/xcmg/xe215ev.jpg', alt: 'XE215EV electric excavator', scene: 'fiche_technique', license: 'XCMG_official' }],
    technical_specs: { operating_weight_kg: 23500, bucket_capacity_m3: 1.05, rated_power_kw: 120 },
    compliance: {},
    tags: ['electric', 'excavator', 'new-energy', '20-30t'],
    slug: 'xe215ev',
    created_at: '2026-07-04T00:00:00Z',
    updated_at: '2026-07-04T00:00:00Z'
  },
  {
    id: 'ENG-XE230M',
    type: 'engin',
    category: 'Material Handler',
    family: 'Material Handler',
    brand: 'XCMG',
    name: 'XE230M',
    sku: 'XCMG-XE230M',
    mpn: null,
    description_short: 'Material handler 27t, 135kW, 0.6m3 grapple.',
    description_long: 'High-reach material handler for ports, recycling, and bulk handling.',
    price_type: 'sur_devis',
    prices: { base_currency: 'USD', partner_price_usd: null, retail_price_usd: null, min_order_qty: 1, price_notes: 'Quote required' },
    availability: 'disponible_60j',
    lead_time_days: 60,
    warranty_months: 12,
    origin_country: 'China',
    images: [{ src: '/products/xcmg/xe230m.jpg', alt: 'XE230M material handler', scene: 'fiche_technique', license: 'XCMG_official' }],
    technical_specs: { operating_weight_kg: 27000, grapple_capacity_m3: 0.6, rated_power_kw: 135 },
    compliance: {},
    tags: ['material-handler', '20-30t', 'port'],
    slug: 'xe230m',
    created_at: '2026-07-04T00:00:00Z',
    updated_at: '2026-07-04T00:00:00Z'
  },
  {
    id: 'ENG-XE215LC',
    type: 'engin',
    category: 'Excavator',
    family: 'LC Series',
    brand: 'XCMG',
    name: 'XE215LC',
    sku: 'XCMG-XE215LC',
    mpn: null,
    description_short: 'Standard LC excavator 23.5t, 1.05m3 bucket.',
    description_long: 'Stable LC configuration for deep dig and general earthmoving.',
    price_type: 'sur_devis',
    prices: { base_currency: 'USD', partner_price_usd: null, retail_price_usd: null, min_order_qty: 1, price_notes: 'Quote required' },
    availability: 'disponible_30j',
    lead_time_days: 30,
    warranty_months: 12,
    origin_country: 'China',
    images: [{ src: '/products/xcmg/xe215lc.jpg', alt: 'XE215LC', scene: 'fiche_technique', license: 'XCMG_official' }],
    technical_specs: { operating_weight_kg: 23500, bucket_capacity_m3: 1.05, rated_power_kw: 135, engine_speed_rpm: 2050 },
    compliance: {},
    tags: ['excavator', 'lc-series', '20-30t'],
    slug: 'xe215lc',
    created_at: '2026-07-04T00:00:00Z',
    updated_at: '2026-07-04T00:00:00Z',
    use_cases: [
      { location: 'Tongon', activity: 'Mining production', context: 'Fouilles et chargement pour la mine de Tongon.' },
      { location: 'Koné', activity: 'Project construction', context: 'Terrassement et préparation infrastructure du projet Koné.' }
    ]
  },
  {
    id: 'ENG-XE215DA',
    type: 'engin',
    category: 'Excavator',
    family: 'LC Series',
    brand: 'XCMG',
    name: 'XE215DA',
    sku: 'XCMG-XE215DA',
    mpn: null,
    description_short: 'Heavy-duty 23.5t class, reinforced undercarriage.',
    description_long: 'Reinforced undercarriage configuration for tough earthmoving.',
    price_type: 'sur_devis',
    prices: { base_currency: 'USD', partner_price_usd: null, retail_price_usd: null, min_order_qty: 1, price_notes: 'Quote required' },
    availability: 'disponible_30j',
    lead_time_days: 30,
    warranty_months: 12,
    origin_country: 'China',
    images: [{ src: '/products/xcmg/xe215da.jpg', alt: 'XE215DA', scene: 'fiche_technique', license: 'XCMG_official' }],
    technical_specs: { operating_weight_kg: 23300, bucket_capacity_m3: 1.0, rated_power_kw: 128.5, engine_speed_rpm: 2100 },
    compliance: {},
    tags: ['excavator', 'lc-series', 'heavy-duty', '20-30t'],
    slug: 'xe215da',
    created_at: '2026-07-04T00:00:00Z',
    updated_at: '2026-07-04T00:00:00Z',
    use_cases: [
      { location: 'Koné', activity: 'Heavy earthmoving', context: 'Travaux lourds de préparation et d’accès.' },
      { location: 'Tongon', activity: 'Mining support', context: 'Support de production et entretien des pistes.' }
    ]
  }
];
