'use client';

import { motion } from 'framer-motion';
import { ExternalLink, MapPin, Tag } from 'lucide-react';

type Article = {
  id: string;
  title: string;
  date: string;
  category: string;
  source: string;
  url: string;
  summary: string;
  products: string[];
  locations: string[];
};

type Props = {
  article: Article;
  index: number;
};

export default function ArticleCard({ article, index }: Props) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-brand-forest bg-brand-forest/10 px-2 py-1 rounded">
          {article.category}
        </span>
        <span className="text-xs text-slate-500">{article.date}</span>
      </div>

      <h3 className="font-semibold text-brand-navy mb-2 leading-snug">
        {article.title}
      </h3>

      <p className="text-sm text-slate-600 mb-3">{article.summary}</p>

      <div className="flex flex-wrap gap-2 mb-3">
        {article.locations.map((loc) => (
          <span
            key={loc}
            className="text-xs flex items-center gap-1 text-slate-700 bg-slate-100 px-2 py-1 rounded"
          >
            <MapPin className="w-3 h-3" /> {loc}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {article.products.map((sku) => (
          <span
            key={sku}
            className="text-xs flex items-center gap-1 text-slate-700 bg-slate-50 border border-slate-200 px-2 py-1 rounded"
          >
            <Tag className="w-3 h-3" /> {sku}
          </span>
        ))}
      </div>

      <a
        href={article.url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 text-sm text-brand-navy font-semibold hover:underline"
      >
        <ExternalLink className="w-4 h-4" /> Source : {article.source}
      </a>
    </motion.article>
  );
}
