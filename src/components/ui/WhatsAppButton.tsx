import React from 'react';
import { MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../../hooks/useLanguage';

export default function WhatsAppButton() {
  const { language } = useLanguage();
  
  // Riyadh consultant hotline - 053-153-4385
  const waNumber = "966531534385";
  const defaultMessage = language === 'ar' 
    ? 'السلام عليكم، أرغب بالإستفسار عن خدمات أسما للتقنية المتقدمة AAT وبدء مشروعي.' 
    : 'Hello, I would like to inquire about ASMA Advanced Technology (AAT) services and starting my project.';
  
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <motion.a
      id="whatsapp-floating-hub"
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      title="Chat on WhatsApp"
      className="fixed bottom-6 z-50 flex items-center justify-center p-3.5 bg-green-500 rounded-full text-white shadow-2xl hover:bg-green-600 border border-green-400/30 transition-all focus:outline-none focus:ring-2 focus:ring-green-400"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      style={{
        // Respecting RTL, floating at opposite bottom corner
        right: language === 'ar' ? 'auto' : '24px',
        left: language === 'ar' ? '24px' : 'auto',
      }}
    >
      <span className="absolute inset-0 rounded-full bg-green-500/40 animate-ping opacity-75"></span>
      {/* Icon custom wifi signal above look - represents AAT Wi-Fi / connectivity brand */}
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.455L0 24zm6.59-4.846c1.66.986 3.285 1.503 4.887 1.505 5.518 0 10.007-4.478 10.01-9.986.001-2.67-1.031-5.176-2.905-7.05C16.658 1.745 14.16 1.71 11.492 11.492c-5.513 0-10.004 4.479-10.007 9.988-.001 1.83.499 3.613 1.447 5.191L1.87 22.135l5.777-1.514zM16.6 13.06c-.253-.127-1.497-.738-1.728-.822-.232-.085-.401-.127-.57.127-.168.254-.653.822-.799.99-.147.169-.294.19-.547.063-.253-.127-1.07-.394-2.037-1.257-.753-.671-1.261-1.502-1.41-1.755-.147-.254-.016-.39.111-.517.114-.115.253-.294.38-.443.126-.147.168-.253.253-.422.084-.168.041-.316-.021-.443-.063-.127-.57-1.373-.78-1.884-.206-.497-.413-.429-.57-.437-.147-.008-.316-.008-.485-.008-.168 0-.443.063-.674.316-.232.253-.884.864-.884 2.11s.906 2.443 1.033 2.612c.126.168 1.782 2.718 4.318 3.812.603.26 1.074.415 1.44.532.606.193 1.157.166 1.593.101.485-.072 1.497-.611 1.707-1.201.21-.59.21-1.097.147-1.201-.063-.105-.232-.147-.485-.274z"/>
      </svg>
    </motion.a>
  );
}
