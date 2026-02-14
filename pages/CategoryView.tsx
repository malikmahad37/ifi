
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MessageCircle, CheckCircle2, ChevronLeft } from 'lucide-react';
import { Category, ContactInfo } from '../types';

interface CategoryViewProps {
  categories: Category[];
  contact: ContactInfo;
}

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
    <div className="min-h-screen pb-20 bg-bg-base transition-colors duration-300">
      {/* Header - Optimized for Mobile */}
      <div className="relative h-[30vh] md:h-[40vh] flex items-end">
        <img src={category.image} alt={category.name} className="absolute inset-0 w-full h-full object-cover brightness-[0.3]" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/30 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 w-full pb-8 md:pb-12">
          <Link to="/products" className="flex items-center gap-2 text-brand-lime font-black uppercase tracking-[0.3em] text-[8px] md:text-[10px] mb-4 opacity-60 hover:opacity-100 transition-all group">
            <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> BACK TO CATALOG
          </Link>
          <div className="space-y-2">
            <p className="text-brand-lime text-[9px] md:text-[11px] font-black tracking-[0.5em] uppercase opacity-80">Industrial Category</p>
            <h1 className="text-3xl md:text-5xl font-black text-theme-base tracking-tighter uppercase leading-none drop-shadow-xl">{category.name}</h1>
            <p className="urdu-text text-brand-lime/90 text-xl md:text-3xl font-bold leading-none mt-2">{category.nameUrdu}</p>
          </div>
        </div>
      </div>

      {/* Series Collection - Compact Grid */}
      <div className="max-w-7xl mx-auto px-4 mt-8 md:mt-16">
        {seriesList.length === 0 ? (
          <div className="text-center py-20 opacity-30 text-[10px] uppercase tracking-[0.3em]">No items in this collection</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {seriesList.map((series) => (
              <div key={series.id} className="group glass-panel rounded-2xl md:rounded-3xl overflow-hidden border border-theme-base/5 hover:border-brand-lime/30 transition-all hover:translate-y-[-2px] hover:shadow-2xl hover:shadow-brand-lime/5 flex flex-col">
                {/* Image Area */}
                <div className="relative aspect-square overflow-hidden bg-theme-base/5">
                  <img src={series.image} alt={series.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-theme-base font-black text-sm md:text-base uppercase tracking-tight leading-tight line-clamp-2 drop-shadow-md">{series.name}</h3>
                    <p className="urdu-text text-brand-lime text-xs md:text-sm font-bold mt-0.5">{series.nameUrdu}</p>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-3 md:p-5 flex flex-col flex-grow gap-3 md:gap-4">
                  {/* Sizes */}
                  <div className="flex flex-wrap gap-1.5">
                    {(series.sizes || []).slice(0, 3).map((size) => (
                      <span key={size} className="px-2 py-1 bg-theme-base/5 rounded md:rounded-md text-theme-base/60 text-[9px] md:text-[10px] font-bold border border-theme-base/5">
                        {size}
                      </span>
                    ))}
                    {(series.sizes || []).length > 3 && (
                      <span className="px-2 py-1 bg-theme-base/5 rounded md:rounded-md text-brand-lime text-[9px] md:text-[10px] font-bold border border-theme-base/5">
                        +{(series.sizes || []).length - 3}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-theme-base/40 text-[9px] md:text-[10px] leading-relaxed line-clamp-2 flex-grow">
                    {series.description}
                  </p>

                  {/* Action */}
                  <button
                    onClick={() => handleWhatsApp(series.name)}
                    className="w-full py-2.5 md:py-3 bg-brand-lime/10 hover:bg-brand-lime text-brand-lime hover:text-black font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all text-[9px] md:text-[10px]"
                  >
                    WhatsApp Inquiry <MessageCircle className="w-3 h-3 md:w-3.5 md:h-3.5 fill-current" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryView;
