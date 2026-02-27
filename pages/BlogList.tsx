import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';
import { BlogPost } from '../types';

interface BlogListProps {
  blogs: BlogPost[];
}

const BlogList: React.FC<BlogListProps> = ({ blogs }) => {
  return (
    <div className="min-h-screen pb-20 px-4 max-w-6xl mx-auto pt-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 mb-16"
      >
        <div className="inline-flex items-center gap-2 bg-brand-lime/10 px-4 py-2 rounded-full text-brand-lime">
          <BookOpen className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Latest Updates</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-theme-base tracking-tighter uppercase uppercase drop-shadow-sm">
          iFi <span className="text-brand-lime">Blog</span>
        </h1>
        <p className="text-theme-base/50 text-sm md:text-base max-w-2xl mx-auto font-bold">
          Stay informed with the latest updates from Ittefaq Fasteners Industries.
        </p>
      </motion.div>

      {blogs.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="text-center py-20 bg-theme-base/5 rounded-[2rem] border border-theme-base/10"
        >
          <p className="text-theme-base/40 text-lg font-black uppercase tracking-widest">Check back soon for our first article</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <Link key={blog.id} to={`/blog/${blog.id}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group h-full bg-theme-base/5 rounded-3xl border border-theme-base/5 overflow-hidden shadow-lg hover:shadow-brand-lime/10 transition-all flex flex-col"
              >
                <div className="relative aspect-video overflow-hidden">
                  <div className="absolute inset-0 bg-brand-lime/0 group-hover:bg-brand-lime/20 z-10 transition-colors duration-300 pointer-events-none" />
                  <img src={blog.image} alt={blog.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-brand-lime text-[10px] font-black uppercase tracking-widest mb-3">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(blog.date).toLocaleDateString()}
                  </div>
                  
                  <h2 className="text-xl font-black text-theme-base mb-2 line-clamp-2 uppercase leading-tight group-hover:text-brand-lime transition-colors">
                    {blog.title}
                  </h2>
                  <p className="urdu-text text-theme-base/70 text-lg font-bold mb-3 line-clamp-1">{blog.titleUrdu}</p>
                  
                  <p className="text-theme-base/50 text-xs leading-relaxed line-clamp-3 mb-6 flex-grow">
                    {blog.excerpt}
                  </p>
                  
                  <div className="mt-auto flex items-center gap-2 text-[10px] font-black text-brand-lime uppercase tracking-widest group-hover:bg-brand-lime/10 w-max px-3 py-1.5 rounded-lg transition-colors">
                    Read Article <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;
