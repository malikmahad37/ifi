
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { ContactInfo } from '../types';

import Logo from './Logo';

interface FooterProps {
  contact: ContactInfo;
}

const Footer: React.FC<FooterProps> = ({ contact }) => {
  return (
    <footer className="bg-bg-base border-t border-theme-base/5 pt-16 pb-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="space-y-4">
            <div className="space-y-2">
              <Logo className="w-24 h-24" />
              <h3 className="text-[9px] font-black tracking-[0.3em] uppercase text-theme-base/60">
                Ittefaq Fasteners Industries
              </h3>
            </div>
            <p className="text-theme-base/20 text-[11px] leading-relaxed max-w-xs">
              Pioneering industrial fastener excellence since 1987. Quality that industry leaders trust.
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="text-theme-base text-[10px] font-black tracking-[0.4em] uppercase">Quick Access</h4>
            <ul className="space-y-2.5">
              <li><Link to="/" className="text-theme-base/30 hover:text-brand-lime transition-all text-[10px] font-bold uppercase tracking-widest">Home</Link></li>
              <li><Link to="/products" className="text-theme-base/30 hover:text-brand-lime transition-all text-[10px] font-bold uppercase tracking-widest">Product Catalog</Link></li>
              <li><Link to="/contact" className="text-theme-base/30 hover:text-brand-lime transition-all text-[10px] font-bold uppercase tracking-widest">Contact Sales</Link></li>
              <li><Link to="/login" className="text-theme-base/30 hover:text-brand-lime transition-all text-[10px] font-bold uppercase tracking-widest">Admin Login</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-theme-base text-[10px] font-black tracking-[0.4em] uppercase">Official Location</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-lime shrink-0 opacity-40" />
                <div className="space-y-1">
                  <p className="text-theme-base/40 text-[10px] font-bold leading-relaxed">{contact.address}</p>
                </div>
              </li>
              <li className="flex items-center gap-3 text-theme-base/40 text-[10px] font-bold tracking-widest">
                <Phone className="w-4 h-4 text-brand-lime shrink-0 opacity-40" />
                {contact.phone}
              </li>
              {contact.email && (
                <li className="flex items-center gap-3 text-theme-base/40 text-[10px] font-bold tracking-widest">
                  <Mail className="w-4 h-4 text-brand-lime shrink-0 opacity-40" />
                  {contact.email}
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-theme-base/5 pt-6 text-center md:text-left">
          <p className="text-theme-base/10 text-[8px] uppercase font-black tracking-[0.4em]">
            &copy; {new Date().getFullYear()} iFi ITTEFAQ FASTENERS INDUSTRIES. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
