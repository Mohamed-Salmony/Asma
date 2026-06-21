import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { ShieldCheck, Layers, BarChart3, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function WhyUs() {
  const { t } = useLanguage();

  const columns = [
    {
      icon: Layers,
      titleKey: 'whyChooseUs.col1Title',
      descKey: 'whyChooseUs.col1Desc',
      color: 'from-brand-blue to-blue-500'
    },
    {
      icon: ShieldCheck,
      titleKey: 'whyChooseUs.col2Title',
      descKey: 'whyChooseUs.col2Desc',
      color: 'from-brand-teal to-cyan-500'
    },
    {
      icon: BarChart3,
      titleKey: 'whyChooseUs.col3Title',
      descKey: 'whyChooseUs.col3Desc',
      color: 'from-brand-gold to-yellow-600'
    }
  ];

  return (
    <section id="why-us" className="relative py-24 bg-[#0a1126] border-y border-brand-blue/10 overflow-hidden islamic-grid-premium">
      {/* Absolute glow lighting */}
      <div className="absolute top-1/3 left-1/4 w-[35vw] h-[35vw] rounded-full bg-brand-teal/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[35vw] h-[35vw] rounded-full bg-brand-blue/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-black tracking-widest text-brand-gold uppercase px-3 py-1 rounded-full bg-brand-gold/10 w-fit mx-auto mb-4"
          >
            {t('whyChooseUs.badge')}
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-extrabold text-white mb-4"
          >
            {t('whyChooseUs.title')}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-sm md:text-base"
          >
            {t('whyChooseUs.subtitle')}
          </motion.p>
        </div>

        {/* Column grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          {columns.map((col, idx) => {
            const Icon = col.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group p-8 rounded-2xl border border-brand-blue/10 bg-brand-navy/40 backdrop-blur-sm hover:border-brand-blue/35 transition-all duration-300 relative overflow-hidden"
              >
                {/* Background active glow */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-blue/5 rounded-full blur-2xl group-hover:bg-brand-blue/15 transition-all duration-500" />

                {/* Column Icon block inside a glowing gradient circle */}
                <div className={`p-3 rounded-xl bg-gradient-to-tr ${col.color} text-white shadow-lg w-fit mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-brand-blue transition-colors">
                  {t(col.titleKey)}
                </h3>

                <p className="text-sm text-gray-400 leading-relaxed">
                  {t(col.descKey)}
                </p>
                
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
