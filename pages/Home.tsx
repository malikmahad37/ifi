
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, Phone, ShieldCheck, Box, Zap } from 'lucide-react';
import { Category, ContactInfo } from '../types';
import Logo from '../components/Logo';

interface HomeProps {
  categories: Category[];
  contact: ContactInfo;
}

const Home: React.FC<HomeProps> = ({ categories, contact }) => {
  return (
    <div className="bg-bg-base min-h-screen transition-colors duration-300">
      {/* Hero Section - Optimized for Mobile */}
      <section className="relative pt-10 md:pt-16 pb-12 flex flex-col items-center justify-center overflow-hidden px-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-brand-lime/10 rounded-full blur-[80px] md:blur-[100px]"></div>
        </div>

        <div className="z-10 text-center animate-fade-in space-y-6 md:space-y-8 max-w-lg w-full">
          {/* Logo Container Box */}
          <div className="flex flex-col items-center">
            <div className="bg-brand-lime p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl shadow-brand-lime/20 mb-6 md:mb-8 transform hover:scale-105 transition-transform duration-500">
              <Logo className="w-24 h-24 md:w-44 md:h-44" />
            </div>

            <div className="space-y-1">
              <h2 className="text-5xl md:text-7xl font-black text-brand-lime tracking-tighter uppercase leading-none">iFi</h2>
              <h1 className="text-xs md:text-xl font-black text-[#8ea4b0] tracking-[0.15em] md:tracking-[0.1em] uppercase leading-tight mt-1">
                ITTEFAQ FASTENERS INDUSTRIES
              </h1>
              <p className="urdu-text text-brand-lime text-xl md:text-3xl font-bold mt-2">
                اتفاق فاسٹنرز انڈسٹریز
              </p>
            </div>
          </div>


        </div>
      </section>

      {/* Home Catalog - Premium Grid */}
      <section className="py-16 md:py-24 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-10 md:mb-16 space-y-2">
          <h2 className="text-3xl md:text-5xl font-black text-theme-base uppercase tracking-tight">
            Our <span className="text-brand-lime">Products</span>
          </h2>
          <p className="urdu-text text-white/30 text-lg md:text-xl font-bold">ہماری پروڈکٹس دیکھیں</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="group relative overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] aspect-[3/4] md:aspect-[4/5] glass-panel border border-theme-base/5 shadow-2xl transition-all hover:border-brand-lime/20"
            >
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 brightness-[0.35]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4 md:p-8 w-full transform md:translate-y-1 group-hover:translate-y-0 transition-transform">
                <h3 className="text-base md:text-2xl font-black text-theme-base mb-0.5 uppercase tracking-tighter leading-tight drop-shadow-md">{category.name}</h3>
                <p className="urdu-text text-brand-lime text-base md:text-xl font-bold mb-3 md:mb-4">{category.nameUrdu}</p>
                <div className="flex items-center gap-1.5 md:gap-2 text-brand-lime font-black text-[8px] md:text-[9px] tracking-[0.2em] uppercase opacity-70 group-hover:opacity-100 transition-opacity">
                  View <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quality Trust - Responsive Features */}
      <section className="py-16 md:py-20 bg-theme-base/[0.01]">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10 text-center">
          {[
            { icon: ShieldCheck, title: "Premium Quality", urdu: "اعلیٰ معیار", desc: "Rigorous ISO standard testing for every batch." },
            { icon: Box, title: "All Sizes", urdu: "تمام سائز", desc: "Vast inventory of every metric and standard size." },
            { icon: Zap, title: "Fast Delivery", urdu: "فوری ڈیلیوری", desc: "Optimized logistics for express delivery nationwide." }
          ].map((item, i) => (
            <div key={i} className="space-y-4 group">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-brand-lime/5 mx-auto flex items-center justify-center text-brand-lime group-hover:bg-brand-lime group-hover:text-black transition-all duration-500 shadow-lg border border-theme-base/5">
                <item.icon className="w-7 h-7 md:w-8 md:h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base md:text-lg font-black text-theme-base uppercase tracking-widest leading-none">{item.title}</h4>
                <p className="urdu-text text-brand-lime text-xl font-bold leading-none">{item.urdu}</p>
              </div>
              <p className="text-theme-base/20 text-[10px] md:text-[11px] leading-relaxed max-w-[200px] mx-auto opacity-60">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
