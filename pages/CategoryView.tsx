import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, CheckCircle2, ChevronLeft } from 'lucide-react';
import { Category, ContactInfo } from '../types';

interface CategoryViewProps {
  categories: Category[];
  contact: ContactInfo;
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
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

const CategoryView: React.FC<CategoryViewProps> = ({ categories, contact }) => {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    const found = categories.find(c => c.id === id);
    if (found) setCategory(found);
    window.scrollTo(0, 0);
  }, [id, categories]);

  if (!category) return <div className="min-h-screen flex items-center justify-center text-theme-base text-[10px] tracking-widest uppercase italic opacity-20">Accessing Catalog...</div>;

  const handleWhatsApp = (seriesName: string) => {
    const text = `Hi iFi, I am looking for information on ${seriesName} from the ${category.name} category.`;
    window.open(`https://wa.me/${contact.whatsapp.replace(/\+/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const seriesList = category.series || [];

  return (
    <div className="min-h-screen pb-20 transition-colors duration-300">
      {/* Header - Optimized for Mobile */}
      <div className="relative h-[25vh] md:h-[35vh] flex items-end overflow-hidden">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          src={category.image}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover brightness-[0.4]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 w-full pb-6 md:pb-10 z-10">
          <Link to="/products" className="flex items-center gap-2 text-brand-lime font-black uppercase tracking-[0.3em] text-[8px] md:text-[10px] mb-4 opacity-100 transition-all group drop-shadow-md">
            <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform drop-shadow" /> BACK TO CATALOG
          </Link>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
            className="space-y-2 drop-shadow-lg"
          >
            <p className="text-brand-lime text-[9px] md:text-[11px] font-black tracking-[0.5em] uppercase opacity-90 drop-shadow">Industrial Category</p>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none drop-shadow-xl">{category.name}</h1>
            <p className="urdu-text text-brand-lime text-xl md:text-3xl font-bold leading-none mt-2 drop-shadow-md">{category.nameUrdu}</p>
          </motion.div>
        </div>
      </div>

      {/* Series Collection - Compact Grid */}
      <div className="max-w-7xl mx-auto px-4 mt-6 md:mt-10">
        {seriesList.length === 0 ? (
          <div className="text-center py-20 opacity-30 text-[10px] uppercase tracking-[0.3em]">No items in this collection</div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6"
          >
            {seriesList.map((series, index) => (
              <motion.div
                key={series.id}
                variants={itemVariants}
                whileHover={{ y: -3 }}
                className="group glass-panel rounded-2xl md:rounded-3xl overflow-hidden border border-theme-base/5 hover:border-brand-lime/30 transition-all hover:shadow-xl hover:shadow-brand-lime/5 flex flex-col [.light-theme_&]:bg-white/80"
              >
                {/* Image Area */}
                <div className="relative aspect-square overflow-hidden bg-black flex-shrink-0">
                  <motion.img
                    src={series.image}
                    alt={series.name}
                    className="w-full h-full object-cover brightness-[0.8]"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>
                  <div className="absolute bottom-3 left-3 right-3 z-10 drop-shadow-lg">
                    <h3 className="text-white font-black text-sm md:text-base uppercase tracking-tight leading-tight line-clamp-2 drop-shadow-md">{series.name}</h3>
                    <p className="urdu-text text-brand-lime text-xs md:text-sm font-bold mt-0.5 drop-shadow">{series.nameUrdu}</p>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-3 md:p-5 flex flex-col flex-grow gap-3 md:gap-4 bg-transparent">
                  {/* Sizes */}
                  <div className="flex flex-wrap gap-1.5">
                    {(series.sizes || []).slice(0, 3).map((size) => (
                      <span key={size} className="px-2 py-1 bg-theme-base/5 [.light-theme_&]:bg-black/5 rounded md:rounded-md text-theme-base/60 [.light-theme_&]:text-theme-muted text-[9px] md:text-[10px] font-bold border border-theme-base/5 [.light-theme_&]:border-black/5">
                        {size}
                      </span>
                    ))}
                    {(series.sizes || []).length > 3 && (
                      <span className="px-2 py-1 bg-theme-base/5 [.light-theme_&]:bg-brand-lime/10 rounded md:rounded-md text-brand-lime [.light-theme_&]:text-brand-text text-[9px] md:text-[10px] font-bold border border-theme-base/5 [.light-theme_&]:border-brand-lime/20">
                        +{(series.sizes || []).length - 3}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-theme-base/40 [.light-theme_&]:text-theme-muted text-[9px] md:text-[10px] leading-relaxed line-clamp-2 flex-grow">
                    {series.description}
                  </p>

                  {/* Action */}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleWhatsApp(series.name)}
                    className="w-full py-2.5 md:py-3 bg-brand-lime/10 hover:bg-brand-lime text-brand-lime [.light-theme_&]:bg-brand-lime [.light-theme_&]:text-black [.light-theme_&]:shadow-sm hover:text-black font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all text-[9px] md:text-[10px]"
                  >
                    WhatsApp Inquiry <MessageCircle className="w-3 h-3 md:w-3.5 md:h-3.5 fill-current" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CategoryView;
