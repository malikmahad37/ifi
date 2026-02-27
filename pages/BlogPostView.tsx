import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';
import { BlogPost, ContactInfo } from '../types';

interface BlogPostViewProps {
  blogs: BlogPost[];
  contact: ContactInfo;
}

const BlogPostView: React.FC<BlogPostViewProps> = ({ blogs, contact }) => {
  const { id } = useParams<{ id: string }>();
  const blog = blogs.find(b => b.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!blog) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-black text-theme-base mb-4 uppercase">Article Not Found</h2>
        <Link to="/blog" className="text-brand-lime font-bold hover:underline">Return to Blog</Link>
      </div>
    );
  }

  const shareUrl = window.location.href;

  return (
    <div className="min-h-screen pb-20 px-4 max-w-4xl mx-auto pt-8">
      <Link to="/blog" className="inline-flex items-center gap-2 text-theme-base/50 [.light-theme_&]:text-theme-base/80 hover:text-brand-lime transition-colors mb-10 text-[10px] font-black uppercase tracking-widest">
        <ArrowLeft className="w-4 h-4" /> Back to Articles
      </Link>

      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-10"
      >
        <header className="space-y-6 text-center">
          <div className="flex items-center justify-center gap-6 text-theme-base/40 [.light-theme_&]:text-theme-base/60 text-[10px] font-black uppercase tracking-widest mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(blog.date).toLocaleDateString()}
            </div>
            {blog.author && (
                <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {blog.author}
                </div>
            )}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-theme-base leading-tight uppercase tracking-tighter drop-shadow-sm">
            {blog.title}
          </h1>
          <h2 className="urdu-text text-brand-lime text-2xl md:text-4xl font-bold leading-normal">
            {blog.titleUrdu}
          </h2>
        </header>

        <div className="aspect-[21/9] w-full rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-transparent to-transparent opacity-80 z-10" />
          <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
        </div>

        <div className="glass-panel p-8 md:p-12 rounded-[2rem] border border-theme-base/5 space-y-10 shadow-xl">
          <div className="prose prose-lg prose-invert max-w-none text-theme-base/80 [.light-theme_&]:text-theme-base space-y-6 text-lg leading-relaxed">
            <div dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br />') }} />
          </div>

          <div className="h-px bg-theme-base/10 w-full" />

          <div className="prose prose-lg prose-invert max-w-none urdu-text text-brand-lime/90 [.light-theme_&]:text-brand-text/90 space-y-6 text-2xl leading-relaxed text-right" dir="rtl">
            <div dangerouslySetInnerHTML={{ __html: blog.contentUrdu.replace(/\n/g, '<br />') }} />
          </div>
        </div>

        <div className="flex justify-between items-center py-6 border-t border-theme-base/10">
          <div className="text-[10px] uppercase font-black tracking-widest text-theme-base/40">
            Share this article
          </div>
          <div className="flex gap-4">
            <a href={`https://wa.me/?text=${encodeURIComponent(blog.title + " " + shareUrl)}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-theme-base/5 hover:bg-[#25D366] hover:text-white rounded-full transition-colors text-theme-base">
              <Share2 className="w-5 h-5" />
            </a>
          </div>
        </div>
      </motion.article>
    </div>
  );
};

export default BlogPostView;
