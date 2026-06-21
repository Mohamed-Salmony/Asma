import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import AnimatedCounter from '../ui/AnimatedCounter';
import { motion } from 'motion/react';
import { Award, Briefcase, Smile, CheckCircle } from 'lucide-react';

export default function StatsBar() {
  const { t } = useLanguage();

  const stats = [
    {
      id: 'stat-experience',
      icon: Award,
      targetValue: 16,
      suffix: '+',
      labelKey: 'stats.experience',
    },
    {
      id: 'stat-projects',
      icon: Briefcase,
      targetValue: 500,
      suffix: '+',
      labelKey: 'stats.projects',
    },
    {
      id: 'stat-quality',
      icon: CheckCircle,
      targetValue: 100,
      suffix: '%',
      labelKey: 'stats.quality',
    },
    {
      id: 'stat-clients',
      icon: Smile,
      targetValue: 50,
      suffix: '+',
      labelKey: 'stats.clients',
    },
  ];

  return (
    <section id="stats" className="relative bg-[#080d1e] py-12 border-y border-brand-blue/10 overflow-hidden">
      {/* Background neon ambient line */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-brand-blue/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-brand-teal/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.id}
                className="flex flex-col items-center text-center p-4 rounded-2xl bg-brand-navy/35 border border-brand-blue/5 hover:border-brand-blue/15 transition-all duration-300"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                {/* Statistics Icon */}
                <div className="p-2.5 rounded-xl bg-brand-blue/10 text-brand-teal mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                
                {/* Counting numeric state */}
                <AnimatedCounter
                  id={`${stat.id}-counter`}
                  targetValue={stat.targetValue}
                  suffix={stat.suffix}
                />
                
                {/* Translation label */}
                <span className="text-xs md:text-sm text-gray-400 font-semibold tracking-wide uppercase mt-2.5">
                  {t(stat.labelKey)}
                </span>
              </motion.div>
            );
          })}
          
        </div>
      </div>
    </section>
  );
}
