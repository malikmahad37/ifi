
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Category } from '../types';

interface ProductListProps {
  categories: Category[];
}

const ProductList: React.FC<ProductListProps> = ({ categories }) => {
  return (
    <div className="min-h-screen pt-20 pb-12 bg-bg-base transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-10 space-y-2">
          <p className="text-brand-lime text-[9px] font-black tracking-[0.5em] uppercase opacity-60">The Collection</p>
          <h1 className="text-3xl md:text-4xl font-black text-theme-base leading-none uppercase tracking-tighter">
            COMPLETE<br /><span className="text-theme-base/20">INDUSTRIAL</span> CATALOG
          </h1>
          <div className="w-12 h-0.5 bg-brand-lime opacity-40"></div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {categories.map((category, idx) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="group block glass-panel rounded-2xl overflow-hidden border border-theme-base/5 transition-all hover:border-brand-lime/20"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 brightness-75"
                />
                <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 rounded text-[9px] text-brand-lime font-black uppercase tracking-widest">
                  0{idx + 1}
                </div>
              </div>
              <div className="p-4 md:p-6 space-y-3">
                <div className="space-y-0.5">
                  <h2 className="text-lg md:text-xl font-black text-theme-base tracking-tight uppercase leading-tight">{category.name}</h2>
                  <p className="urdu-text text-brand-lime text-sm md:text-base font-bold">{category.nameUrdu}</p>
                </div>

                <p className="text-theme-base/30 text-[10px] md:text-xs leading-relaxed line-clamp-2">
                  {category.description}
                </p>

                <div className="flex items-center gap-2 text-brand-lime font-black tracking-[0.1em] uppercase text-[9px] pt-2 border-t border-theme-base/5">
                  View Series <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
