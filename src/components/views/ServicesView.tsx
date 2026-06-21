import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { Globe, Smartphone, Monitor, Brain, Megaphone, Play, ArrowLeft, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface ServicesViewProps {
  onBack: () => void;
  onInquire: () => void;
}

export default function ServicesView({ onBack, onInquire }: ServicesViewProps) {
  const { t, language } = useLanguage();

  const services = [
    {
      icon: Globe,
      color: 'text-brand-blue bg-brand-blue/10 border-brand-blue/20',
      titleKey: 'services.web.title',
      descKey: 'services.web.desc',
      longKey: 'services.web.longDesc',
      techs: ['Next.js', 'React', 'ASP.NET Core', 'Tailwind CSS', 'Vite', 'Node.js', 'TypeScript', 'Drizzle ORM'],
      price: '10,000 - 18,000 SAR',
      featuresKey: ['responsive', 'cms', 'basicSeo', 'support3']
    },
    {
      icon: Smartphone,
      color: 'text-brand-teal bg-brand-teal/10 border-brand-teal/20',
      titleKey: 'services.mobile.title',
      descKey: 'services.mobile.desc',
      longKey: 'services.mobile.longDesc',
      techs: ['Flutter', 'iOS SDK', 'Android SDK', 'Dart', 'Firebase Auth', 'CoreML', 'REST APIs'],
      price: '30,000 - 55,000 SAR',
      featuresKey: ['mobile', 'adminPortal', 'api', 'firebase', 'support12']
    },
    {
      icon: Monitor,
      color: 'text-brand-gold bg-brand-gold/10 border-brand-gold/20',
      titleKey: 'services.desktop.title',
      descKey: 'services.desktop.desc',
      longKey: 'services.desktop.longDesc',
      techs: ['WPF', '.NET 8', 'SQL Server', 'C#', 'WCF', 'Electron', 'Local DB'],
      price: '45,000 - 80,000 SAR',
      featuresKey: ['erp', 'adminPortal', 'firebase', 'support12']
    },
    {
      icon: Brain,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      titleKey: 'services.ai.title',
      descKey: 'services.ai.desc',
      longKey: 'services.ai.longDesc',
      techs: ['OpenAI API', 'Gemini Pro SDK', 'n8n pipelines', 'Power BI', 'Python', 'D3.js', 'Vector DB'],
      price: '35,000 - 75,000 SAR',
      featuresKey: ['ai', 'analytics', 'api', 'support12']
    },
    {
      icon: Megaphone,
      color: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
      titleKey: 'services.marketing.title',
      descKey: 'services.marketing.desc',
      longKey: 'services.marketing.longDesc',
      techs: ['SEO Audits', 'Google Ads', 'Social campaigns', 'Analytics Hub', 'Funnels', 'Lighthouse Optimization'],
      price: '8,000 - 25,000 SAR/mo',
      featuresKey: ['basicSeo', 'launches', 'analytics']
    },
    {
      icon: Play,
      color: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
      titleKey: 'services.motion.title',
      descKey: 'services.motion.desc',
      longKey: 'services.motion.longDesc',
      techs: ['Adobe After Effects', 'Premiere Pro', 'Photoshop', 'Illustrator', 'Figma Wireframes', 'Blender 3D'],
      price: '5,000 - 15,000 SAR',
      featuresKey: ['cms', 'responsive', 'basicSeo']
    }
  ];

  return (
    <div id="view-services-root" className="min-h-screen bg-brand-navy pt-28 pb-20 overflow-hidden islamic-grid-premium">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        
        {/* Back Link */}
        <button
          onClick={onBack}
          className="group inline-flex items-center gap-2 mb-8 text-xs font-bold text-brand-teal hover:text-white transition-colors cursor-pointer"
        >
          {language === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}</span>
        </button>

        {/* Header Block */}
        <div className="max-w-3xl mb-16 space-y-4">
          <span className="text-xs font-black tracking-widest text-brand-teal uppercase px-3 py-1 rounded-full bg-brand-blue/10 w-fit block">
            {t('services.badge')}
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white">
            {t('services.title')}
          </h1>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            {t('services.subtitle')}
          </p>
        </div>

        {/* Deep Detailed Cards Lists */}
        <div className="space-y-12">
          {services.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <motion.div
                key={srv.titleKey}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="p-8 rounded-3xl border border-brand-blue/10 bg-brand-navy/60 hover:border-brand-blue/35 transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                {/* Visual Block (5 Cols) */}
                <div className="lg:col-span-5 space-y-6">
                  <div className={`p-4 rounded-2xl border ${srv.color} w-fit`}>
                    <Icon className="w-10 h-10" />
                  </div>

                  <h2 className="text-2xl font-extrabold text-white">
                    {t(srv.titleKey)}
                  </h2>

                  <p className="text-sm text-gray-400 leading-relaxed">
                    {t(srv.longKey)}
                  </p>
                </div>

                {/* Specs Block (7 Cols) */}
                <div className="lg:col-span-7 p-6 rounded-2xl bg-brand-navy/40 border border-brand-blue/5 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Tech stack */}
                    <div>
                      <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-widest mb-3">
                        {t('services.techStack')}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {srv.techs.map((tech) => (
                          <span
                            key={tech}
                            className="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-[#0b142b] text-brand-blue border border-brand-blue/20"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Pricing range */}
                    <div>
                      <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-widest mb-3">
                        {t('services.pricingRange')}
                      </span>
                      <div className="p-3 bg-brand-gold/5 border border-brand-gold/15 rounded-xl w-fit">
                        <span className="text-lg font-mono font-black text-brand-gold">
                          {srv.price}
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Highlights checklist */}
                  <div className="pt-4 border-t border-brand-blue/10 space-y-3">
                    <span className="text-[10px] text-gray-400 font-extrabold block uppercase tracking-wider">
                      Core deliveries included:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {srv.featuresKey.map((feat) => (
                        <div key={feat} className="flex items-start gap-2 text-xs text-gray-300">
                          <Check className="w-4 h-4 text-brand-teal shrink-0 mt-0.5" />
                          <span>{t(`pricing.features.${feat}`)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Call to action */}
                  <div className="pt-4 flex justify-end">
                    <button
                      id={`btn-inquire-service-${idx}`}
                      onClick={onInquire}
                      className="px-6 py-3 rounded-full font-bold text-xs tracking-wide text-white bg-gradient-to-r from-brand-blue to-brand-teal hover:shadow-lg hover:shadow-brand-blue/20 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Inquire Now</span>
                      {language === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                    </button>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
