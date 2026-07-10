import type { Metadata } from 'next';
import './globals.css';
import { SITE_CONFIG } from '@/lib/siteConfig';

export const metadata: Metadata = {
  metadataBase: new URL(`https://${SITE_CONFIG.domain}`),
  title: {
    default: `${SITE_CONFIG.name} — XCMG Heavy Equipment`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: `Vente B2B d'engins XCMG et pièces détachées. Devis, support, livraison CI/Afrique sur ${SITE_CONFIG.domain}.`,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    title: `${SITE_CONFIG.name} — XCMG Heavy Equipment`,
    description: "Prix directs • Support local • Livraison FOB Abidjan • Pièces en stock",
    url: 'https://ivoire-monade.shop',
    siteName: SITE_CONFIG.name,
    locale: 'fr_CI',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_CONFIG.name} — XCMG Heavy Equipment`,
    description: "Prix directs • Support local • Livraison FOB Abidjan",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
