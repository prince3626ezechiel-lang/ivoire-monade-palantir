'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const IMAGES = [
  {
    src: '/images/trading/img_a60c074d81c3.jpg',
    label: 'UI UX Pro Max',
    hint: 'Interface sombre, badges tech, typographie claire.',
  },
  {
    src: '/images/trading/img_176f6c4f090f.jpg',
    label: 'Refero Styles',
    hint: 'Design system propre, emphasis produit.',
  },
  {
    src: '/images/trading/img_8f06a91e5da8.jpg',
    label: 'Mobbin',
    hint: 'Références d’apps, microcopy, lisibilité mobile.',
  },
  {
    src: '/images/trading/img_36972a8631f8.jpg',
    label: 'Aceternity UI',
    hint: 'Composants animés, glassmorphism léger.',
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const card = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function InspirationGrid() {
  return (
    <motion.section
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
    >
      {IMAGES.map((img) => (
        <motion.div
          key={img.label}
          variants={card}
          whileHover={{ y: 5, scale: 1.012 }}
          className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-xl transition"
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={img.src}
              alt={img.label}
              fill
              className="object-cover transition group-hover:scale-105"
            />
          </div>
          <div className="p-4">
            <div className="text-sm font-semibold text-brand-navy">{img.label}</div>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">{img.hint}</p>
          </div>
        </motion.div>
      ))}
    </motion.section>
  );
}
