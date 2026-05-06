import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Music, Ghost, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';

export default function Home() {
  const { siteContent } = useApp();

  return (
    <div className="relative min-h-screen">
      <main className="pt-40 lg:pt-56 pb-40 px-6 lg:px-12 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24 items-center">
          
          {/* Intro */}
          <div className="md:col-span-12 lg:col-span-7 flex flex-col justify-center space-y-12 lg:space-y-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-6 mb-12">
                <div className="w-12 h-[1px] bg-brand-gold" />
                <span className="text-[10px] md:text-xs uppercase tracking-[0.6em] text-brand-gold font-black">Escritura Ritualista</span>
              </div>
              
              <h1 className="text-5xl md:text-8xl lg:text-[10rem] font-display leading-[0.85] tracking-tighter mb-10">
                {siteContent.heroTitle.split(',').map((part, i) => (
                  <span key={i} className={cn(
                    "block",
                    i === 0 ? "italic font-light text-brand-paper/90 light:text-brand-black" : "text-brand-gold text-3xl md:text-6xl lg:text-[8rem] not-italic uppercase font-stylized font-medium tracking-[0.1em] mt-6 md:mt-10"
                  )}>
                    {part.trim()}
                  </span>
                ))}
              </h1>
              
              <p className="text-brand-paper/40 light:text-brand-black/40 text-xs md:text-lg max-w-xl leading-relaxed font-light mb-16 pl-6 border-l border-brand-gold/20">
                {siteContent.heroSubtitle}
              </p>

              <div className="flex flex-wrap gap-10 items-center">
                <Link to="/tienda" className="btn-primary group w-full sm:w-auto">
                  <span>Encontrar Mi Frecuencia</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.4em] opacity-30 flex items-center gap-4">
                  <span className="w-4 h-[1px] bg-brand-paper/20 light:bg-brand-black/20" />
                  EST. 2024 // MÉXICO
                </div>
              </div>
            </motion.div>
          </div>

          {/* Visual Showcase */}
          <div className="md:col-span-12 lg:col-span-5 relative flex items-center justify-center">
             <motion.div
               initial={{ opacity: 0, scale: 0.98, y: 30 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
               className="relative w-full aspect-[4/5] bg-brand-slate group"
             >
                <div className="absolute inset-0 bg-brand-gold/5 z-10 pointer-events-none group-hover:opacity-0 transition-opacity duration-1000" />
                <img 
                  src={siteContent.heroImage} 
                  alt="Barbara Higuera Portrait" 
                  className="w-full h-full object-cover grayscale brightness-[0.7] group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-[2.5s] ease-out-expo"
                />
                
                {/* Decorative Frame */}
                <div className="absolute -inset-4 border border-brand-gold/10 pointer-events-none -z-10" />
                <div className="absolute -inset-8 border border-brand-gold/5 pointer-events-none -z-10" />

                <div className="absolute -bottom-6 -right-6 md:-bottom-20 md:-right-20 p-8 md:p-14 glass-panel max-w-[200px] md:max-w-xs z-20">
                   <h2 className="text-xl md:text-4xl font-display italic mb-5 leading-tight text-white light:text-brand-black">{siteContent.philosophyTitle}</h2>
                   <div className="w-8 md:w-12 h-[1px] bg-brand-gold mb-5" />
                   <p className="text-[8px] md:text-[10px] uppercase tracking-[0.4em] text-brand-gold font-black leading-relaxed">Arquitectura del sentimiento</p>
                </div>
             </motion.div>
          </div>
        </div>

        {/* Narrative Section */}
        <section id="identidad" className="mt-48 md:mt-96 grid grid-cols-1 md:grid-cols-12 gap-16 lg:gap-32 items-center">
           <div className="md:col-span-12 lg:col-span-5 space-y-16">
              <div className="space-y-6">
                <span className="text-[10px] uppercase tracking-[0.6em] text-brand-gold/60">Manifiesto</span>
                <h3 className="text-4xl md:text-7xl font-display leading-[1] italic text-brand-paper/90 light:text-brand-black tracking-tighter">"{siteContent.manifestoQuote}"</h3>
              </div>
              
              <div className="pl-10 border-l-2 border-brand-gold/10 space-y-6">
                <p className="text-brand-paper/40 light:text-brand-black/40 text-sm md:text-lg leading-loose max-w-md font-light italic">
                  {siteContent.philosophyText1}
                </p>
                {siteContent.philosophyText2 && (
                  <p className="text-brand-paper/20 light:text-brand-black/20 text-xs md:text-base leading-loose max-w-md font-light">
                    {siteContent.philosophyText2}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-8">
                <div className="flex gap-4">
                  <Music size={24} strokeWidth={1} className="text-brand-gold" />
                  <Ghost size={24} strokeWidth={1} className="text-brand-gold/40" />
                  <Compass size={24} strokeWidth={1} className="text-brand-gold/40" />
                </div>
                <div className="flex-grow h-[1px] bg-brand-gold/10" />
              </div>
           </div>

           <div className="md:col-span-12 lg:col-span-7 relative">
              <motion.div 
                whileInView={{ opacity: 1, scale: 1 }}
                initial={{ opacity: 0, scale: 1.05 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5 }}
                className="relative aspect-[16/9] overflow-hidden grayscale brightness-50 hover:grayscale-0 hover:brightness-100 transition-all duration-[2s] group"
              >
                 <img src={siteContent.philosophyImage} alt="Ritual" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[4s]" />
                 <div className="absolute inset-0 bg-ink/20 group-hover:bg-transparent transition-colors duration-1000" />
              </motion.div>
              <div className="absolute -top-12 -right-6 text-[10px] uppercase tracking-[0.8em] font-black opacity-10 [writing-mode:vertical-rl] h-full">
                Creative Narrative // Protocol 001
              </div>
           </div>
        </section>
      </main>
    </div>
  );
}
