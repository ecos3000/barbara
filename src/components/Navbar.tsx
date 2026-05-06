import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Menu, X, User, Heart, Lock, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cart, siteContent, theme, toggleTheme } = useApp();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Identidad', path: '/#identidad' },
    { name: 'Música', path: '/tienda' },
    { name: 'Rituales', path: '/rituales' },
  ];

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return null;
      case '/tienda': return 'MÚSICA Y ARCO';
      case '/rituales': return 'RITUALES';
      case '/cart': return 'CARRITO';
      case '/admin': return 'GESTIÓN';
      case '/login': return 'ACCESO';
      default: return siteContent.siteName.toUpperCase();
    }
  };

  const dynamicTitle = getPageTitle();

  return (
    <nav className={cn(
      "fixed top-0 left-0 w-full z-50 transition-all duration-700 flex items-center",
      scrolled ? "bg-brand-black/95 backdrop-blur-md border-b border-white/5 h-20" : "bg-transparent h-28"
    )}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full flex items-center justify-between">
        <Link to="/" className="group flex items-center gap-4">
          <AnimatePresence mode="wait">
            {!dynamicTitle ? (
              <motion.div
                key="logo"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col leading-[0.8]"
              >
                {siteContent.siteName.split(' ').map((word, i, arr) => (
                  <span 
                    key={i} 
                    className={cn(
                      "text-xl lg:text-2xl tracking-[0.4em] font-sans font-extrabold uppercase transition-all whitespace-nowrap",
                      i === arr.length - 1 && arr.length > 1 ? "text-brand-gold font-light italic mt-1" : "text-white light:text-brand-black"
                    )}
                  >
                    {word}
                  </span>
                ))}
                <span className="text-[6px] uppercase tracking-[0.6em] text-white/30 font-bold group-hover:text-white/60 transition-all mt-3 block">ESTUDIO RITUAL</span>
              </motion.div>
            ) : (
              <motion.div
                key="title"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center gap-4"
              >
                <div className="w-8 h-[1px] bg-brand-gold/40" />
                <span className="text-2xl font-display italic tracking-[0.2em] text-brand-gold">{dynamicTitle}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-14">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "text-[9px] uppercase tracking-[0.4em] font-bold transition-all hover:text-brand-gold relative group/link",
                location.pathname === link.path ? "text-brand-gold" : "text-white/40"
              )}
            >
              {link.name}
              <motion.span 
                layoutId="navDot"
                className={cn(
                  "absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-gold",
                  location.pathname === link.path ? "opacity-100" : "opacity-0 group-hover/link:opacity-50"
                )}
              />
            </Link>
          ))}
          <Link to="/cart" className="relative group flex items-center gap-3 pl-8 border-l border-white/10 hover:text-brand-gold transition-colors dark:text-white light:text-brand-black">
            <ShoppingBag size={16} strokeWidth={2} />
            <span className="text-[9px] uppercase tracking-widest font-black">Carrito</span>
            {cartCount > 0 && (
              <span className="bg-brand-gold text-brand-black text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-black">
                {cartCount}
              </span>
            )}
          </Link>

          <button 
            onClick={toggleTheme}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all text-white light:text-brand-black light:bg-black/5"
            aria-label="Cambiar tema"
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>

        <div className="md:hidden">
          <button 
            className="p-3"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[100] md:hidden bg-brand-black/98 backdrop-blur-2xl flex flex-col p-12"
          >
            <div className="flex justify-between items-center mb-20">
              <span className="text-[10px] uppercase tracking-widest opacity-40">Navegación</span>
              <button onClick={() => setIsOpen(false)} className="p-4 bg-white/5 rounded-full hover:bg-brand-gold hover:text-brand-black transition-all">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex flex-col gap-10">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "text-5xl font-display italic transition-colors truncate",
                      location.pathname === link.path ? "text-brand-gold" : "text-white/60"
                    )}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-auto pt-12 border-t border-paper/10 flex justify-between items-center">
               <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center gap-4 text-white/20 hover:text-brand-gold transition-colors group">
                  <Lock size={14} className="group-hover:translate-y-[-1px] transition-transform" />
                  <span className="text-[8px] uppercase tracking-[0.4em] font-bold">Gestión Interna</span>
               </Link>
               <p className="text-[8px] uppercase tracking-widest opacity-20">Estética por Barbara H.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
