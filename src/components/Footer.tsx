import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Lock, Instagram, Youtube, Mail, ArrowRight } from 'lucide-react';

export default function Footer() {
  const { siteContent } = useApp();

  return (
    <footer className="bg-brand-black border-t border-white/5 pt-32 pb-16 px-6 lg:px-12 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-12 gap-12 lg:gap-24 mb-32">
          <div className="col-span-12 lg:col-span-6 space-y-10">
            <h2 className="text-5xl font-display font-light leading-none tracking-tight">
              BÁRBARA <span className="text-brand-gold italic">HIGUERA</span>
            </h2>
            <p className="text-white/30 text-sm max-w-sm leading-relaxed font-light">
               Escritora de emociones y curadora de realidades sonoras. Un estudio dedicado a la narrativa ritual y la estética del rastro.
            </p>
            <div className="flex gap-10">
              <Instagram className="cursor-pointer text-white/30 hover:text-brand-gold transition-colors" size={20} strokeWidth={1} />
              <Youtube className="cursor-pointer text-white/30 hover:text-brand-gold transition-colors" size={20} strokeWidth={1} />
              <Mail className="cursor-pointer text-white/30 hover:text-brand-gold transition-colors" size={20} strokeWidth={1} />
            </div>
          </div>
          
          <div className="col-span-12 lg:col-span-3 space-y-10">
            <span className="text-[10px] uppercase tracking-[0.5em] text-brand-gold font-bold block">Navegación</span>
            <ul className="space-y-4">
              <li><Link to="/" className="text-[11px] uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors">Inicio</Link></li>
              <li><Link to="/tienda" className="text-[11px] uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors">Boutique</Link></li>
              <li><Link to="/cart" className="text-[11px] uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors">Carrito</Link></li>
            </ul>
          </div>

          <div className="col-span-12 lg:col-span-3 space-y-10">
            <span className="text-[10px] uppercase tracking-[0.5em] text-brand-gold font-bold block">Protocolo</span>
            <div className="space-y-6">
               <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-light leading-relaxed">
                 Subscríbete para recibir fragmentos del archivo y noticias del rito.
               </p>
               <div className="flex border-b border-white/10 py-3 group">
                  <input placeholder="EMAIL" className="bg-transparent text-[10px] uppercase tracking-[0.3em] outline-none flex-grow text-white placeholder:text-white/10" />
                  <ArrowRight size={14} className="text-white/20 group-focus-within:text-brand-gold transition-colors" />
               </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-16 border-t border-white/5 text-[8px] uppercase tracking-[0.4em] text-white/20">
          <span>© 2024 BÁRBARA HIGUERA</span>
          <div className="flex items-center gap-10">
            <span className="font-mono">RITUAL_MANIFESTO_V.01</span>
            <Link to="/login" className="hover:text-brand-gold transition-colors">
              <Lock size={12} strokeWidth={1} />
            </Link>
          </div>
          <span>CDMX // ESTUDIO RITUAL®</span>
        </div>
      </div>
    </footer>
  );
}
