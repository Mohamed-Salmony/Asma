import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { Check, Info, ShieldCheck, Star } from 'lucide-react';
import { motion } from 'motion/react';

interface PackagesProps {
  onNavigate: (sectionId: string) => void;
}

export default function Packages({ onNavigate }: PackagesProps) {
  const { t } = useLanguage();

  const packs = [
    {
      id: 'pack-starter',
      titleKey: 'pricing.starter',
      price: '10,000 - 18,000',
      pop: false,
      features: [
        'responsive',
        'cms',
        'basicSeo',
        'support3'
      ],
      notIncluded: [
        'mobile',
        'adminPortal',
        'api',
        'firebase',
        'erp',
        'ai'
      ]
    },
    {
      id: 'pack-growth',
      titleKey: 'pricing.growth',
      price: '30,000 - 55,000',
      pop: true,
      features: [
        'responsive',
        'cms',
        'mobile',
        'adminPortal',
        'api',
        'firebase',
        'hosting',
        'basicSeo',
        'support12'
      ],
      notIncluded: [
        'erp',
        'ai'
      ]
    },
    {
      id: 'pack-full',
      titleKey: 'pricing.full',
      price: '60,000+',
      pop: false,
      features: [
        'responsive',
        'cms',
        'mobile',
        'adminPortal',
        'api',
        'firebase',
        'hosting',
        'erp',
        'ai',
        'analytics',
        'launches',
        'support12'
      ],
      notIncluded: []
    }
  ];

  return (
    <section id="packages" className="relative py-24 bg-[#0a1126] border-t border-brand-blue/10 overflow-hidden islamic-grid-premium">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-blue/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-black tracking-widest text-brand-gold uppercase px-3 py-1 rounded-full bg-brand-gold/10 w-fit mx-auto mb-4"
          >
            {t('pricing.badge')}
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-extrabold text-white mb-4"
          >
            {t('pricing.title')}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-sm md:text-base"
          >
            {t('pricing.subtitle')}
          </motion.p>
        </div>

        {/* Pricing tiers grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-4">
          {packs.map((pack, idx) => (
            <motion.div
              key={pack.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className={`relative flex flex-col justify-between p-8 rounded-3xl border ${
                pack.pop
                  ? 'border-brand-blue bg-[#0d1c44] shadow-2xl shadow-brand-blue/15 scale-100 lg:scale-[1.03] lg:-translate-y-2'
                  : 'border-brand-blue/10 bg-brand-navy/60'
              } backdrop-blur-sm hover:border-brand-blue/30 transition-all duration-300 overflow-hidden`}
            >
              {/* Highlight background element */}
              {pack.pop && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/20 rounded-full blur-2xl pointer-events-none" />
              )}

              {/* Tag / Badge header */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white uppercase tracking-wide">
                  {t(pack.titleKey)}
                </h3>
                
                {pack.pop && (
                  <span className="inline-flex items-center gap-1 text-[9px] font-mono font-black uppercase text-brand-gold bg-brand-gold/10 border border-brand-gold/30 px-2.5 py-1 rounded-full">
                    <Star className="w-3 h-3 fill-current animate-pulse" />
                    <span>{t('pricing.mostPopular')}</span>
                  </span>
                )}
              </div>

              {/* Price rate display */}
              <div className="pb-6 border-b border-brand-blue/10 mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl md:text-4xl font-black font-mono text-white">
                    {pack.price}
                  </span>
                  <span className="text-xs text-brand-teal font-extrabold uppercase">
                    {t('pricing.sar')}
                  </span>
                </div>
                <span className="text-xs text-gray-400 mt-2 block">
                  {pack.id === 'pack-starter'
                    ? 'SME launch rate'
                    : pack.id === 'pack-growth'
                    ? 'Recommended value baseline'
                    : 'Scalable customized rate'}
                </span>
              </div>

              {/* Feature List */}
              <div className="space-y-4 mb-8 grow">
                {/* Active features */}
                {pack.features.map((feat) => (
                  <div key={feat} className="flex items-start gap-3 text-xs text-gray-200">
                    <Check className={`w-4 h-4 shrink-0 mt-0.5 rounded p-0.5 ${pack.pop ? 'bg-brand-blue text-white' : 'bg-brand-teal/20 text-brand-teal border border-brand-teal/25'}`} />
                    <span>{t(`pricing.features.${feat}`)}</span>
                  </div>
                ))}

                {/* Blocked/Disabled features for visual pricing transparency */}
                {pack.notIncluded.map((feat) => (
                  <div key={feat} className="flex items-start gap-3 text-xs text-gray-500 line-through opacity-45">
                    <Check className="w-4 h-4 shrink-0 mt-0.5 rounded bg-gray-500/10 text-gray-500 p-0.5" />
                    <span>{t(`pricing.features.${feat}`)}</span>
                  </div>
                ))}
              </div>

              {/* CTA launch */}
              <button
                id={`btn-select-${pack.id}`}
                onClick={() => onNavigate('contact')}
                className={`w-full py-4 rounded-full font-bold text-xs tracking-wider transition-all scale-100 hover:scale-[1.02] cursor-pointer ${
                  pack.pop
                    ? 'bg-gradient-to-r from-brand-blue to-brand-teal text-white shadow-lg'
                    : 'bg-brand-blue/10 border border-brand-blue/30 text-white hover:bg-brand-blue/20'
                }`}
              >
                {t('pricing.cta')}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Investment regulatory advice notice */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-2 mt-12 p-3.5 px-5 rounded-2xl border border-brand-blue/15 bg-brand-navy/40 w-fit mx-auto text-xs text-gray-400"
        >
          <Info className="w-4 h-4 text-brand-teal" />
          <span>All our contracts carry a 12-month free maintenance SLA for minor code revisions and patches.</span>
        </motion.div>

      </div>
    </section>
  );
}
