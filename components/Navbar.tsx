
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Settings, LogOut, Lock } from 'lucide-react';
import { LOGO_URL } from '../constants';
import ThemeToggle from './ThemeToggle';

interface NavbarProps {
  isAdmin: boolean;
  onLogout: () => void;
}

const navVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

const Navbar: React.FC<NavbarProps> = ({ isAdmin, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className="sticky top-0 z-50 bg-bg-base/95 backdrop-blur-xl border-b border-theme-base/5 transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex-shrink-0 flex items-center gap-2.5 group">
            <div className="w-10 h-10 flex items-center justify-center bg-brand-lime rounded-lg p-1.5 shadow-lg shadow-brand-lime/20 relative overflow-hidden transition-transform group-hover:scale-105">
              <img src={LOGO_URL} alt="iFi Logo" className="w-full h-full object-contain relative z-10" />
            </div>
            <div className="border-l border-theme-base/10 pl-2.5">
              <p className="text-[9px] uppercase tracking-[0.3em] text-theme-base font-black leading-none">Ittefaq Fasteners</p>
              <p className="text-[9px] uppercase tracking-[0.3em] text-brand-text font-black leading-none mt-1">Industries</p>
              <p className="text-[7px] uppercase tracking-[0.4em] text-theme-base/40 [.light-theme_&]:text-theme-base/70 font-bold leading-none mt-1">SINCE 1987</p>
            </div>
          </Link>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-1 py-1 text-[10px] font-black tracking-[0.3em] transition-all uppercase ${isActive(link.path)
                    ? 'text-brand-lime border-b border-brand-lime'
                    : 'text-theme-base/40 [.light-theme_&]:text-theme-base/70 hover:text-theme-base'
                    }`}
                >
                  {link.name}
                </Link>
              ))}

              <div className="flex items-center gap-3 ml-2 pl-4 border-l border-theme-base/10">
                <ThemeToggle />
                {!isAdmin ? (
                  <Link
                    to="/login"
                    className="p-2 text-theme-base/20 [.light-theme_&]:text-theme-base/60 hover:text-brand-lime hover:bg-theme-base/5 rounded-full transition-all"
                    title="Admin Access"
                  >
                    <Lock className="w-4 h-4" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/admin"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-black tracking-widest text-black bg-brand-lime rounded-full hover:brightness-110 transition-all"
                    >
                      <Settings className="w-3 h-3" />
                      ADMIN
                    </Link>
                    <button
                      onClick={onLogout}
                      className="p-1.5 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all"
                      title="Logout"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            {!isAdmin && (
              <Link to="/login" className="p-2 text-theme-base/20 [.light-theme_&]:text-theme-base/60 hover:text-theme-base transition-colors">
                <Lock className="w-4 h-4" />
              </Link>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-theme-base/50 [.light-theme_&]:text-theme-base/80 hover:text-brand-lime focus:outline-none transition-colors"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-bg-base/95 backdrop-blur-xl border-t border-theme-base/5 overflow-hidden"
          >
            <div className="px-4 pt-4 pb-8 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-4 text-[11px] font-black tracking-[0.3em] uppercase border-b border-theme-base/5 ${isActive(link.path) ? 'text-brand-lime font-bold' : 'text-theme-base/40 [.light-theme_&]:text-theme-base/80'
                    }`}
                >
                  {link.name}
                </Link>
              ))}
              {isAdmin && (
                <>
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-4 text-[11px] font-black tracking-[0.3em] uppercase text-brand-lime border-b border-theme-base/5"
                  >
                    ADMIN PANEL
                  </Link>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-4 py-4 text-[11px] font-black tracking-[0.3em] uppercase text-red-500/70"
                  >
                    LOGOUT
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
