import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Category } from '../types';

interface ProductListProps {
  categories: Category[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

const ProductList: React.FC<ProductListProps> = ({ categories }) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.nameUrdu.includes(searchQuery) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-16 pb-12 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-6 space-y-2"
        >
          <p className="text-brand-lime [.light-theme_&]:text-brand-text text-[9px] font-black tracking-[0.5em] uppercase opacity-60 [.light-theme_&]:opacity-80">The Collection</p>
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-theme-base leading-none uppercase tracking-tighter">
                COMPLETE<br /><span className="text-theme-base/20 [.light-theme_&]:text-theme-base/40">INDUSTRIAL</span> CATALOG
              </h1>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 64 }}
                transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
                className="h-1 bg-brand-lime opacity-40 mt-4"
              />
            </div>

            {/* Added Search Bar */}
            <div className="w-full md:w-72 relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 [.light-theme_&]:bg-white border border-theme-base/10 rounded-xl px-5 py-3 text-sm text-theme-base focus:outline-none focus:border-brand-lime/50 placeholder:text-theme-base/30 transition-all font-bold"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-brand-lime opacity-50 pointer-events-none" />
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={searchQuery} // Re-animate on search
          className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8"
        >
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category, idx) => (
              <Link
                key={category.id}
                to={`/category/${category.id}`}
              >
                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="group block glass-panel rounded-2xl overflow-hidden border border-theme-base/5 transition-all hover:border-brand-lime/20 h-full shadow-lg hover:shadow-brand-lime/10"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <motion.img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover brightness-75 [.light-theme_&]:brightness-95"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4 }}
                    />
                    <div className="absolute top-3 left-3 px-2 py-1 bg-theme-base/90 [.light-theme_&]:bg-brand-lime rounded text-[9px] text-bg-base [.light-theme_&]:text-white font-black uppercase tracking-widest z-10 shadow-sm">
                      0{idx + 1}
                    </div>
                    <div className="absolute inset-0 bg-brand-lime/10 [.light-theme_&]:bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-4 md:p-6 space-y-3 bg-transparent [.light-theme_&]:bg-white/80">
                    <div className="space-y-0.5">
                      <h2 className="text-lg md:text-xl font-black text-theme-base tracking-tight uppercase leading-tight group-hover:text-brand-lime [.light-theme_&]:group-hover:text-brand-text transition-colors">{category.name}</h2>
                      <p className="urdu-text text-brand-lime/80 [.light-theme_&]:text-brand-text/90 text-sm md:text-base font-bold">{category.nameUrdu}</p>
                    </div>

                    <p className="text-theme-base/30 [.light-theme_&]:text-theme-muted text-[10px] md:text-xs leading-relaxed line-clamp-2">
                      {category.description}
                    </p>

                    <div className="flex items-center gap-2 text-brand-lime [.light-theme_&]:text-brand-text font-black tracking-[0.1em] uppercase text-[9px] pt-2 border-t border-theme-base/5 [.light-theme_&]:border-theme-base/10">
                      <span className="group-hover:translate-x-1 transition-transform">View Series</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 text-center opacity-40">
              <p className="text-theme-base uppercase tracking-widest text-xs">No products found</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
export default ProductList;
