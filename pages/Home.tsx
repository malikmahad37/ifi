import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Box, Zap } from 'lucide-react';
import { Category, ContactInfo } from '../types';
import Logo from '../components/Logo';

interface HomeProps {
  categories: Category[];
  contact: ContactInfo;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

import NutBoltAnimation from '../components/NutBoltAnimation';

// ... (existing helper functions or interfaces)

const Home: React.FC<HomeProps> = ({ categories, contact }) => {
  return (
    <div className="min-h-screen transition-colors duration-300 overflow-hidden">
      {/* Hero Section - Optimized for Mobile */}
      <section className="relative pt-10 md:pt-16 pb-8 flex flex-col items-center justify-center min-h-[60vh] px-4">
        {/* Animated Nut/Bolt Background for Light Theme */}
        <NutBoltAnimation />

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Background removed as per user request - effectively handled by NutBoltAnimation now */}
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="z-10 text-center space-y-6 md:space-y-8 max-w-2xl w-full"
        >
          {/* Logo Container Box */}
          <div className="flex flex-col items-center relative perspective-[1000px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotateX: -20, y: -50 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 15,
                mass: 1,
                duration: 0.8
              }}
              whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0], transition: { duration: 0.3 } }}
              className="bg-brand-lime p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-2xl shadow-brand-lime/30 mb-6 md:mb-10 cursor-pointer relative z-10"
            >
              <Logo className="w-24 h-24 md:w-56 md:h-56" />
              {/* Outer glowing ring for the logo */}
              <motion.div
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.15, opacity: 0 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0 rounded-[2rem] md:rounded-[3rem] border-2 border-brand-lime pointer-events-none"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-3 relative z-20">
              <motion.div className="flex justify-center items-center gap-1 overflow-hidden h-20 md:h-32">
                {['i', 'F', 'i'].map((letter, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: 100, opacity: 0, rotateZ: i % 2 === 0 ? -10 : 10 }}
                    animate={{ y: 0, opacity: 1, rotateZ: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 12,
                      delay: 0.2 + (i * 0.1)
                    }}
                    className="text-7xl md:text-[8rem] font-black text-brand-lime tracking-tighter uppercase leading-none drop-shadow-lg inline-block"
                    whileHover={{ y: -10, color: '#ffffff', transition: { duration: 0.2 } }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5, type: "spring" }}
                className="text-sm md:text-2xl font-black text-theme-base/70 [.light-theme_&]:text-theme-base tracking-[0.2em] md:tracking-[0.25em] uppercase leading-tight mt-4"
              >
                Ittefaq Fasteners Industries
              </motion.h1>

              <div className="relative">
                <motion.div
                  className="h-1 bg-brand-lime/80 mx-auto my-5 rounded-full z-10 relative shadow-[0_0_10px_rgba(210,232,45,0.8)]"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.7, duration: 0.8, ease: "anticipate" }}
                />
                <div className="absolute top-0 left-0 w-full h-1 bg-gray-200/20 rounded-full z-0" />
              </div>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.5 }}
                className="urdu-text text-brand-lime text-3xl md:text-5xl font-bold mt-4 drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)]"
              >
                اتفاق فاسٹنرز انڈسٹریز
              </motion.p>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="pt-8">
            <Link to="/products">
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "rgba(var(--brand-lime), 0.9)" }}
                whileTap={{ scale: 0.98 }}
                className="bg-brand-lime text-bg-base font-black px-8 py-4 rounded-full text-sm md:text-base uppercase tracking-widest shadow-lg shadow-brand-lime/20 flex items-center gap-2 mx-auto"
              >
                Explore Products <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Home Catalog - Premium Grid */}
      <section className="pb-16 pt-8 md:pb-24 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 md:mb-16 space-y-3"
        >
          <h2 className="text-3xl md:text-6xl font-black text-theme-base uppercase tracking-tight">
            Our <span className="text-brand-lime inline-block">Products</span>
          </h2>
          <p className="urdu-text text-gray-400 text-lg md:text-2xl font-bold">ہماری پروڈکٹس دیکھیں</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
                whileHover={{ y: -5 }}
                className="group relative overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] aspect-[3/4] md:aspect-[4/5] glass-panel border border-theme-base/5 shadow-2xl hover:shadow-brand-lime/10 transition-all h-full"
              >
                <div className="absolute inset-0 bg-brand-lime/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <motion.img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover brightness-[0.6] group-hover:brightness-[0.7] transition-all duration-500"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />

                <div className="absolute bottom-0 left-0 p-5 md:p-8 w-full z-10">
                  <motion.div
                    initial={{ x: -10, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <h3 className="text-lg md:text-3xl font-black text-white mb-1 uppercase tracking-tighter leading-none drop-shadow-md group-hover:text-brand-lime transition-colors">{category.name}</h3>
                    <p className="urdu-text text-brand-lime text-lg md:text-2xl font-bold mb-4 md:mb-6">{category.nameUrdu}</p>
                  </motion.div>

                  <div className="flex items-center gap-2 text-brand-lime font-black text-[9px] md:text-[10px] tracking-[0.2em] uppercase overflow-hidden">
                    <span className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300 drop-shadow-md">View Collection</span>
                    <ArrowRight className="w-3 h-3 md:w-4 md:h-4 transform -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 delay-75 drop-shadow-md" />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quality Trust - Responsive Features */}
      <section className="py-16 md:py-32 bg-theme-base/[0.02] relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-theme-base/10 to-transparent" />

        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 text-center">
          {[
            { icon: ShieldCheck, title: "Premium Quality", urdu: "اعلیٰ معیار", desc: "Rigorous ISO standard testing for every batch." },
            { icon: Box, title: "All Sizes", urdu: "تمام سائز", desc: "Vast inventory of every metric and standard size." },
            { icon: Zap, title: "Fast Delivery", urdu: "فوری ڈیلیوری", desc: "Optimized logistics for express delivery nationwide." }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
              whileHover={{ y: -5 }}
              className="space-y-6 group p-6 rounded-3xl hover:bg-gray-50 transition-colors duration-300"
            >
              <div
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-brand-lime/5 mx-auto flex items-center justify-center text-brand-lime group-hover:bg-brand-lime group-hover:text-black transition-all duration-300 shadow-xl"
              >
                <item.icon className="w-8 h-8 md:w-10 md:h-10" />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg md:text-xl font-black text-theme-base uppercase tracking-widest leading-none group-hover:text-brand-lime transition-colors">{item.title}</h4>
                <p className="urdu-text text-brand-lime text-2xl font-bold leading-none">{item.urdu}</p>
              </div>
              <p className="text-theme-base/30 [.light-theme_&]:text-theme-base/70 text-xs md:text-sm leading-relaxed max-w-[250px] mx-auto">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
export default Home;
