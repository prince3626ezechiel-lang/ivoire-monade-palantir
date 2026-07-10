'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Play } from 'lucide-react';

export default function LandHero({
  title,
  photos,
  droneVideoUrl,
  priceXof,
  city,
  neighborhood,
  surfaceM2,
}: {
  title: string;
  photos: string[];
  droneVideoUrl?: string;
  priceXof: number;
  city: string;
  neighborhood: string;
  surfaceM2: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="relative h-[86vh] min-h-[560px] w-full overflow-hidden rounded-b-3xl">
      {/* Background */}
      <motion.img
        initial={{ scale: 1.08, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        src={photos[0]}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Play button */}
      {droneVideoUrl && (
        <motion.a
          href={droneVideoUrl}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: 0.6, type: 'spring' }}
          className="absolute bottom-24 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-md"
        >
          <Play className="ml-1" size={18} />
        </motion.a>
      )}

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 px-5 pb-10">
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold tracking-tight text-white"
        >
          {title}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.45 }}
          className="mt-3 flex flex-wrap items-end gap-3 text-white"
        >
          <span className="text-2xl font-semibold">
            {new Intl.NumberFormat('fr-FR').format(priceXof)} FCFA
          </span>
          <span className="rounded-full border border-white/20 px-2 py-0.5 text-xs">
            {city} — {neighborhood}
          </span>
          <span className="rounded-full border border-white/20 px-2 py-0.5 text-xs">
            {surfaceM2} m²
          </span>
        </motion.div>
      </div>
    </section>
  );
}
