
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { ContactInfo } from '../types';

import Logo from './Logo';

interface FooterProps {
  contact: ContactInfo;
}

const Footer: React.FC<FooterProps> = ({ contact }) => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="bg-bg-base border-t border-theme-base/5 pt-16 pb-6 transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
        >
          <motion.div className="space-y-4" variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
            <div className="space-y-2">
              <Logo className="w-24 h-24" />
              <h3 className="text-[9px] font-black tracking-[0.3em] uppercase text-theme-base/60 [.light-theme_&]:text-theme-base/90">
                Ittefaq Fasteners Industries
              </h3>
            </div>
            <p className="text-theme-base/20 [.light-theme_&]:text-theme-base/70 text-[11px] leading-relaxed max-w-xs">
              Pioneering industrial fastener excellence since 1987. Quality that industry leaders trust.
            </p>
          </motion.div>

          <motion.div className="space-y-6" variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
            <h4 className="text-theme-base text-[10px] font-black tracking-[0.4em] uppercase">Quick Access</h4>
            <ul className="space-y-2.5">
              <li><Link to="/" className="text-theme-base/30 [.light-theme_&]:text-theme-base/80 hover:text-brand-lime [.light-theme_&]:hover:text-brand-text transition-all text-[10px] font-bold uppercase tracking-widest">Home</Link></li>
              <li><Link to="/products" className="text-theme-base/30 [.light-theme_&]:text-theme-base/80 hover:text-brand-lime [.light-theme_&]:hover:text-brand-text transition-all text-[10px] font-bold uppercase tracking-widest">Product Catalog</Link></li>
              <li><Link to="/contact" className="text-theme-base/30 [.light-theme_&]:text-theme-base/80 hover:text-brand-lime [.light-theme_&]:hover:text-brand-text transition-all text-[10px] font-bold uppercase tracking-widest">Contact Sales</Link></li>
              <li><Link to="/login" className="text-theme-base/30 [.light-theme_&]:text-theme-base/80 hover:text-brand-lime [.light-theme_&]:hover:text-brand-text transition-all text-[10px] font-bold uppercase tracking-widest">Admin Login</Link></li>
            </ul>
          </motion.div>

          <motion.div className="space-y-6" variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
            <h4 className="text-theme-base text-[10px] font-black tracking-[0.4em] uppercase">Official Location</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-text shrink-0 opacity-60" />
                <div className="space-y-1">
                  <p className="text-theme-base/40 [.light-theme_&]:text-theme-base/80 text-[10px] font-bold leading-relaxed">{contact.address}</p>
                </div>
              </li>
              <li className="flex items-center gap-3 text-theme-base/40 [.light-theme_&]:text-theme-base/80 text-[10px] font-bold tracking-widest">
                <Phone className="w-4 h-4 text-brand-text shrink-0 opacity-60" />
                {contact.phone}
              </li>
              {contact.email && (
                <li className="flex items-center gap-3 text-theme-base/40 [.light-theme_&]:text-theme-base/80 text-[10px] font-bold tracking-widest">
                  <Mail className="w-4 h-4 text-brand-text shrink-0 opacity-60" />
                  {contact.email}
                </li>
              )}
            </ul>
          </motion.div>
        </motion.div>

        <div className="border-t border-theme-base/5 pt-6 text-center md:text-left">
          <p className="text-theme-base/10 [.light-theme_&]:text-theme-base/50 text-[8px] uppercase font-black tracking-[0.4em]">
            &copy; {new Date().getFullYear()} iFi ITTEFAQ FASTENERS INDUSTRIES. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
