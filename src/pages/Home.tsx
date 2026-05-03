import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Music, Ghost, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';

export default function Home() {
  const { siteContent } = useApp();

  return (
    <div className="relative min-h-screen">
      <div className="noise-filter" />
      
      <main className="pt-40 lg:pt-56 pb-32 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-12 gap-12 lg:gap-20 items-stretch">
          
          {/* Intro */}
          <div className="col-span-12 lg:col-span-6 flex flex-col justify-center space-y-16">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-4 mb-10">
                <div className="w-10 h-[1px] bg-brand-gold" />
                <span className="text-[10px] uppercase tracking-[0.5em] text-brand-gold font-bold">Concepto Ritualista</span>
              </div>
              
              <h1 className="text-7xl lg:text-[10rem] font-display leading-[0.85] tracking-tight mb-12">
                {siteContent.heroTitle.split(',').map((part, i) => (
                  <span key={i} className={cn(
                    "block",
                    i === 0 ? "italic font-light" : "text-brand-gold text-5xl lg:text-[7.5rem] not-italic uppercase font-stylized font-bold tracking-[0.2em] mt-8 opacity-90 transition-all duration-[2s] border-b border-brand-gold/10 inline-block pb-4"
                  )}>
                    {part}
                  </span>
                ))}
              </h1>
              
              <p className="text-white/40 text-sm lg:text-base max-w-lg leading-relaxed font-light mb-16 px-1 border-l border-white/10 ml-1">
                {siteContent.heroSubtitle}
              </p>

              <div className="flex flex-wrap gap-8 items-center">
                <Link to="/tienda" className="btn-primary">
                  Ver Colección <ArrowRight size={16} />
                </Link>
                <div className="font-mono text-[9px] uppercase tracking-widest opacity-20">EST. 2024 // CDMX</div>
              </div>
            </motion.div>
          </div>

          {/* Visual Showcase */}
          <div className="col-span-12 lg:col-span-6 relative flex items-center justify-center">
             <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
               className="relative w-full aspect-[4/5] bg-brand-slate group overflow-hidden"
             >
                <img 
                  src={siteContent.heroImage} 
                  alt="Portrait" 
                  className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-90 transition-all duration-[2.5s]"
                />
                <div className="absolute inset-0 border-[20px] border-brand-black/20" />
                <div className="absolute bottom-12 left-12 right-12 p-8 glass-panel">
                   <h2 className="text-3xl font-display italic mb-4">{siteContent.philosophyTitle}</h2>
                   <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold font-black">Escritura de Emociones</p>
                </div>
             </motion.div>
          </div>
        </div>

        {/* Narrative Section */}
        <section id="identidad" className="mt-64 grid grid-cols-12 gap-12 lg:gap-32 items-center">
           <div className="col-span-12 lg:col-span-5 space-y-12">
              <h3 className="text-5xl font-display leading-[1.1] italic">"La música es la arquitectura invisible de lo que sentimos."</h3>
              <p className="text-white/40 text-sm leading-loose max-w-md font-light">
                {siteContent.philosophyText1}
              </p>
              <div className="flex gap-4">
                <Music size={20} className="text-brand-gold/60" />
                <div className="w-[1px] h-12 bg-white/10" />
                <Sparkles size={20} className="text-brand-gold/60" />
              </div>
           </div>
           <div className="col-span-12 lg:col-span-7">
              <div className="relative aspect-[21/9] overflow-hidden grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-1000">
                 <img src={siteContent.philosophyImage} alt="Ritual" className="w-full h-full object-cover scale-105" />
              </div>
              <p className="text-[10px] uppercase tracking-[0.4em] mt-8 text-right font-black opacity-20">Visual Narrative // Protocol 001</p>
           </div>
        </section>
      </main>
    </div>
  );
}
