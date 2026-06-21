import React, { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import ServiceCard from '../ui/ServiceCard';
import { Globe, Smartphone, Monitor, Brain, Megaphone, Play, X, Check, Calendar, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ServicesGridProps {
  onNavigate: (sectionId: string) => void;
}

export default function ServicesGrid({ onNavigate }: ServicesGridProps) {
  const { t, language } = useLanguage();
  const [selectedService, setSelectedService] = useState<number | null>(null);

  // Mapping 6 service blocks
  const servicesData = [
    {
      id: 'srv-web',
      idx: 0,
      icon: Globe,
      titleKey: 'services.web.title',
      descKey: 'services.web.desc',
      longDescKey: 'services.web.longDesc',
      techs: ['Next.js', 'React', 'ASP.NET Core', 'Tailwind', 'REST APIs'],
      pricing: '10,000 - 18,000 SAR',
      bullets: ['High-speed static compilation', 'Full Zakat/Taxes local compliance', 'Headless CMS content control', 'Integrated micro-checkout solutions']
    },
    {
      id: 'srv-mobile',
      idx: 1,
      icon: Smartphone,
      titleKey: 'services.mobile.title',
      descKey: 'services.mobile.desc',
      longDescKey: 'services.mobile.longDesc',
      techs: ['Flutter', 'iOS', 'Android', 'Dart', 'Firebase Auth'],
      pricing: '30,000 - 55,000 SAR',
      bullets: ['Biometric auth & FaceID integrators', 'Local storage encryptions', 'Offline sync operations', 'Custom push alert streams']
    },
    {
      id: 'srv-desktop',
      idx: 2,
      icon: Monitor,
      titleKey: 'services.desktop.title',
      descKey: 'services.desktop.desc',
      longDescKey: 'services.desktop.longDesc',
      techs: ['WPF', '.NET 8', 'SQL Server', 'ERP Systems', 'C#'],
      pricing: '45,000 - 80,000 SAR',
      bullets: ['Central stock level automation', 'Local industrial thermal printing', 'Offline backup client structures', 'ZATCA Billing integration']
    },
    {
      id: 'srv-ai',
      idx: 3,
      icon: Brain,
      titleKey: 'services.ai.title',
      descKey: 'services.ai.desc',
      longDescKey: 'services.ai.longDesc',
      techs: ['OpenAI', 'Gemini API', 'n8n', 'Power BI', 'SQL DQL'],
      pricing: '35,000 - 75,000 SAR',
      bullets: ['Automated PDF patient summaries', 'Localized sentiment analytics', 'Intelligent lead filtering systems', 'No-code workflow systems']
    },
    {
      id: 'srv-marketing',
      idx: 4,
      icon: Megaphone,
      titleKey: 'services.marketing.title',
      descKey: 'services.marketing.desc',
      longDescKey: 'services.marketing.longDesc',
      techs: ['SEO Local SEO', 'Google Ads', 'Social Media Ads', 'Analytics Hub'],
      pricing: '8,000 - 25,000 SAR/mo',
      bullets: ['Landing-page A/B split setups', 'Local Google Maps optimizations', 'Conversion dashboards', 'Strategic acquisition funnel planning']
    },
    {
      id: 'srv-motion',
      idx: 5,
      icon: Play,
      titleKey: 'services.motion.title',
      descKey: 'services.motion.desc',
      longDescKey: 'services.motion.longDesc',
      techs: ['Adobe Suite', 'Figma Wireframes', 'Core Branding', '3D Blender'],
      pricing: '5,000 - 15,000 SAR',
      bullets: ['Complete brand visual standards', 'Explainer videos & promotional reels', 'Interactive Figma prototype designs', 'Lottie graphic animations']
    }
  ];

  const activeServiceObj = selectedService !== null ? servicesData[selectedService] : null;

  return (
    <section id="services" className="relative py-24 bg-brand-navy islamic-grid-premium overflow-hidden">
      {/* Background decoration elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-blue/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-teal/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        
        {/* Title Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-black tracking-widest text-brand-teal uppercase px-3 py-1 rounded-full bg-brand-blue/10 w-fit mx-auto mb-4"
          >
            {t('services.badge')}
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-extrabold text-white mb-4"
          >
            {t('services.title')}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-sm md:text-base"
          >
            {t('services.subtitle')}
          </motion.p>
        </div>

        {/* 6 Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesData.map((srv, idx) => (
            <ServiceCard
              key={srv.id}
              id={srv.id}
              index={idx}
              icon={srv.icon}
              title={t(srv.titleKey)}
              desc={t(srv.descKey)}
              techs={srv.techs}
              pricing={srv.pricing}
              onClick={() => setSelectedService(idx)}
            />
          ))}
        </div>

      </div>

      {/* Interactive Modal Drawer detail container */}
      <AnimatePresence>
        {activeServiceObj && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay dark blur backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#040814]/90 backdrop-blur-md cursor-pointer"
              onClick={() => setSelectedService(null)}
            />

            {/* Main Details Body card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative w-full max-w-2xl bg-[#091124] border border-brand-blue/30 rounded-2xl p-6 md:p-8 overflow-hidden shadow-2xl space-y-6"
            >
              {/* Gold lights backplane decor */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand-blue/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />

              {/* Close Button Header */}
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-teal text-white shadow-md">
                    <activeServiceObj.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-white">
                      {t(activeServiceObj.titleKey)}
                    </h3>
                    <span className="text-xs text-brand-teal font-semibold tracking-wide">
                      AAT Saudi Tech Solutions
                    </span>
                  </div>
                </div>

                <button
                  id="srv-modal-close"
                  onClick={() => setSelectedService(null)}
                  className="p-1 px-2.5 rounded-lg border border-brand-blue/20 bg-brand-navy/60 hover:bg-brand-blue/15 hover:border-brand-teal transition-all text-white hover:rotate-90 duration-300"
                  aria-label="Close details"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Description Body */}
              <div className="text-gray-300 space-y-4 text-sm md:text-base relative z-10 leading-relaxed">
                <p className="font-semibold text-white">
                  {t(activeServiceObj.descKey)}
                </p>
                <p>
                  {t(activeServiceObj.longDescKey)}
                </p>
              </div>

              {/* Standard Checklists */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 relative z-10">
                {activeServiceObj.bullets.map((bullet, k) => (
                  <div key={k} className="flex items-start gap-2.5 text-xs text-gray-300">
                    <Check className="w-4 h-4 text-brand-teal shrink-0 mt-0.5 border border-brand-teal/20 rounded bg-brand-teal/10" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>

              {/* Badges and tags footer */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-6 border-t border-brand-blue/10 relative z-10">
                {/* Tech chip lists */}
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-bold">
                    {t('services.techStack')}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {activeServiceObj.techs.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-blue/10 border border-brand-blue/20 text-brand-blue font-semibold"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Investment rates */}
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-bold">
                    {t('services.pricingRange')}
                  </span>
                  <span className="text-lg font-mono font-black text-brand-gold">
                    {activeServiceObj.pricing}
                  </span>
                </div>
              </div>

              {/* CTA trigger */}
              <div className="pt-2 flex justify-end">
                <button
                  id="srv-modal-cta-inquire"
                  onClick={() => {
                    setSelectedService(null);
                    onNavigate('contact');
                  }}
                  className="px-6 py-3 rounded-full font-bold text-xs tracking-wider text-white bg-gradient-to-r from-brand-blue to-brand-teal hover:shadow-lg hover:shadow-brand-blue/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{t('hero.ctaStart')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
