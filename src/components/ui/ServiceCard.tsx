import React, { useState, useRef } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface ServiceCardProps {
  key?: any;
  id: string;
  index: number;
  icon: any;
  title: string;
  desc: string;
  techs: string[];
  pricing: string;
  onClick: () => void;
}

export default function ServiceCard({
  id,
  index,
  icon: Icon,
  title,
  desc,
  techs,
  pricing,
  onClick,
}: ServiceCardProps) {
  const { language, t } = useLanguage();
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Track 3D tilt coordinate state
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    transition: 'transform 0.5s ease',
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Mouse coordinates relative to card center container
    const x = e.clientX - rect.left - width / 2;
    const y = e.clientY - rect.top - height / 2;
    
    // Calculate degree thresholds of rotations (max 10 degrees)
    const rotateX = -(y / (height / 2)) * 8;
    const rotateY = (x / (width / 2)) * 8;
    
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s ease',
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
    });
  };

  return (
    <motion.div
      id={id}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={tiltStyle}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="group relative rounded-2xl glow-card p-6 cursor-pointer overflow-hidden border border-brand-blue/15 shadow-xl bg-brand-navy/50"
      onClick={onClick}
    >
      {/* Background ambient radial blue highlight */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-brand-blue/10 rounded-full blur-3xl group-hover:bg-brand-blue/25 transition-all duration-500" />
      <div className="absolute bottom-0 left-0 w-36 h-36 bg-brand-teal/5 rounded-full blur-3xl group-hover:bg-brand-teal/20 transition-all duration-500" />

      {/* Card Header with Glowing Icon Backdrop */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-teal text-white shadow-xl group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-white group-hover:text-brand-blue transition-colors duration-300">
          {title}
        </h3>
      </div>

      {/* Main Body Description */}
      <p className="text-sm text-gray-300 leading-relaxed mb-6">
        {desc}
      </p>

      {/* Footer Content: Tech tags */}
      <div className="mt-auto space-y-4 pt-4 border-t border-brand-blue/10">
        <div>
          <span className="text-xs font-semibold text-brand-teal uppercase tracking-wider block mb-2">
            {t('services.techStack')}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {techs.map((tech) => (
              <span
                key={tech}
                className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-brand-blue/10 text-brand-blue border border-brand-blue/20"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="text-[10px] text-gray-400 block">
              {t('services.pricingRange')}
            </span>
            <span className="text-xs font-mono font-bold text-brand-gold">
              {pricing}
            </span>
          </div>
          
          <span className="text-xs text-brand-blue font-bold group-hover:translate-x-1 group-hover:text-brand-teal transition-all duration-300 inline-flex items-center gap-1">
            {t('services.cta')} {language === 'ar' ? '←' : '→'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
