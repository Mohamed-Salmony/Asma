import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { Compass, Palette, Code, CheckCircle2, Rocket, ArrowRight, ArrowDown } from 'lucide-react';
import { motion } from 'motion/react';

export default function Process() {
  const { t, language } = useLanguage();

  const steps = [
    {
      num: '01',
      icon: Compass,
      titleKey: 'process.step1',
      descKey: 'process.step1Desc',
      color: 'bg-indigo-500'
    },
    {
      num: '02',
      icon: Palette,
      titleKey: 'process.step2',
      descKey: 'process.step2Desc',
      color: 'bg-brand-blue'
    },
    {
      num: '03',
      icon: Code,
      titleKey: 'process.step3',
      descKey: 'process.step3Desc',
      color: 'bg-brand-teal'
    },
    {
      num: '04',
      icon: CheckCircle2,
      titleKey: 'process.step4',
      descKey: 'process.step4Desc',
      color: 'bg-brand-gold'
    },
    {
      num: '05',
      icon: Rocket,
      titleKey: 'process.step5',
      descKey: 'process.step5Desc',
      color: 'bg-brand-green'
    }
  ];

  return (
    <section id="process" className="relative py-24 bg-brand-navy border-t border-brand-blue/10 overflow-hidden select-none">
      <div className="absolute top-10 right-10 w-96 h-96 bg-brand-blue/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-black tracking-widest text-brand-teal uppercase px-3 py-1 rounded-full bg-brand-blue/10 w-fit mx-auto mb-4"
          >
            {t('process.badge')}
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-extrabold text-white mb-4"
          >
            {t('process.title')}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-sm md:text-base"
          >
            {t('process.subtitle')}
          </motion.p>
        </div>

        {/* Process Roadmap Timeline */}
        {/* Desktop Timeline (Horizontal) */}
        <div className="hidden lg:grid grid-cols-5 gap-8 relative">
          
          {/* Timeline Linking Connection Vector */}
          <div className="absolute top-[35px] inset-x-8 h-0.5 bg-gradient-to-r from-indigo-500 via-brand-teal to-brand-green/70 z-0 opacity-40" />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                {/* Step Circle Node */}
                <div className="relative mb-6">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white border-2 border-[#162758] bg-[#0c142c] ring-8 ring-brand-navy shadow-xl`}>
                    <Icon className="w-6 h-6 text-brand-teal" />
                  </div>
                  
                  {/* Floating index tag */}
                  <span className={`absolute -bottom-2 right-1/2 translate-x-1/2 text-[9px] font-mono font-black text-white px-2 py-0.5 rounded-full ${step.color} shadow`}>
                    {step.num}
                  </span>
                </div>

                {/* Information Card */}
                <h4 className="text-lg font-bold text-white mb-3">
                  {t(step.titleKey)}
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed max-w-[200px]">
                  {t(step.descKey)}
                </p>
              </motion.div>
            );
          })}
          
        </div>

        {/* Mobile/Tablet Timeline (Vertical) */}
        <div className="lg:hidden flex flex-col gap-10 relative">
          {/* Vertical Link Wire */}
          <div className="absolute top-8 left-8 bottom-8 w-0.5 bg-gradient-to-b from-indigo-500 via-brand-teal to-brand-green/70 z-0 opacity-40" style={{ left: language === 'ar' ? 'auto' : '32px', right: language === 'ar' ? '32px' : 'auto' }} />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: language === 'ar' ? 20 : -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex items-start gap-5 relative z-10"
                style={{ flexDirection: language === 'ar' ? 'row-reverse' : 'row' }}
              >
                {/* Step Indicator */}
                <div className="relative shrink-0">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-white border-2 border-[#162758] bg-[#0c142c] ring-4 ring-brand-navy shadow-lg">
                    <Icon className="w-6 h-6 text-brand-teal" />
                  </div>
                  <span className={`absolute -bottom-1.5 right-1/2 translate-x-1/2 text-[9px] font-mono font-black text-white px-2 py-0.5 rounded-full ${step.color} shadow`}>
                    {step.num}
                  </span>
                </div>

                {/* Timeline Card details */}
                <div className={`p-5 rounded-2xl border border-brand-blue/10 bg-brand-navy/60 backdrop-blur-sm grow ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                  <h4 className="text-base font-bold text-white mb-2">
                    {t(step.titleKey)}
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {t(step.descKey)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
