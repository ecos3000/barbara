import { motion } from 'motion/react';
import { Sparkles, Brain, Zap, Heart, ArrowRight, Music, Ghost } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useState } from 'react';
import { cn } from '../lib/utils';
import Footer from '../components/Footer';

export default function Rituals() {
  const { products, siteContent } = useApp();
  const ritualProducts = products.filter(p => p.category === 'ritual');

  return (
    <div className="relative min-h-screen">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-gold/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[15%] right-[5%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[150px]" />
      </div>

      <main className="pt-56 pb-40 px-6 lg:px-12 max-w-[1400px] mx-auto relative z-10">
        <header className="mb-40 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-6 mb-12">
              <div className="w-12 h-[1px] bg-gold" />
              <span className="text-[10px] md:text-xs uppercase tracking-[0.6em] text-gold font-black">Prácticas de Elevación</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-display leading-[0.85] tracking-tighter mb-10 italic">
              {siteContent.ritualsTitle.split(' ').map((word, i) => (
                <span key={i} className={i === siteContent.ritualsTitle.split(' ').length - 1 ? "text-gold not-italic font-stylized font-medium ml-4" : ""}>
                  {word}{i < siteContent.ritualsTitle.split(' ').length - 1 ? ' ' : ''}
                </span>
              ))}
            </h1>
            
            <p className="text-paper/40 text-sm md:text-xl max-w-2xl leading-relaxed font-light pl-6 border-l border-gold/20 mb-16">
              {siteContent.ritualsSubtitle}
            </p>
          </motion.div>
        </header>

        {/* Benefits Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-56">
          {(siteContent.ritualsBenefits || []).map((benefit, i) => {
            const Icon = benefit.icon === 'Brain' ? Brain : 
                         benefit.icon === 'Zap' ? Zap : 
                         benefit.icon === 'Heart' ? Heart : 
                         benefit.icon === 'Sparkles' ? Sparkles : Music;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="group p-10 bg-paper/[0.02] border border-white/5 hover:border-gold/20 transition-all rounded-[3rem]"
              >
                <Icon className="text-gold mb-8 group-hover:scale-110 transition-transform" size={32} strokeWidth={1} />
                <h3 className="text-2xl font-display italic mb-4">{benefit.title}</h3>
                <p className="text-sm font-light text-paper/40 leading-relaxed">{benefit.desc}</p>
              </motion.div>
            );
          })}
        </section>

        {/* Ritual Items */}
        <section className="space-y-40">
          <div className="flex justify-between items-end border-b border-white/5 pb-10">
            <h2 className="text-4xl font-display italic">Catálogo de Ritual</h2>
            <span className="text-[10px] uppercase tracking-widest opacity-20 font-bold">{ritualProducts.length} DISPONIBLES</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            {ritualProducts.map((ritual, i) => (
              <motion.div 
                key={ritual.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: i * 0.1 }}
                className="group relative"
              >
                <div className="relative aspect-[16/9] overflow-hidden rounded-[3rem] mb-10 bg-paper/5 border border-white/5">
                  <img 
                    src={ritual.image} 
                    alt={ritual.name}
                    className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-90 transition-all duration-[2.5s]" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-60" />
                  
                  <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                    <div className="bg-gold/10 backdrop-blur-md border border-gold/20 px-4 py-2 rounded-full">
                      <span className="text-[9px] uppercase tracking-widest font-black text-gold">${ritual.price}</span>
                    </div>
                  </div>
                </div>

                <div className="px-4">
                  <h3 className="text-4xl font-display italic mb-6 group-hover:text-gold transition-colors">{ritual.name}</h3>
                  <p className="text-paper/40 text-base font-light leading-relaxed mb-8 max-w-lg">
                    {ritual.description}
                  </p>
                  <button className="flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] font-black text-gold hover:text-paper transition-all group/btn">
                    <span>Invocación Digital</span>
                    <ArrowRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}

            {ritualProducts.length === 0 && (
              <div className="col-span-2 py-40 text-center border-2 border-dashed border-white/5 rounded-[4rem]">
                 <Ghost className="mx-auto text-paper/10 mb-8" size={64} strokeWidth={0.5} />
                 <h3 className="text-3xl font-display italic text-paper/20">La cámara está vacía.</h3>
                 <p className="text-[10px] uppercase tracking-[0.4em] opacity-20 mt-4 leading-loose">
                   Próximamente archivos de meditación, <br />
                   técnicas de respiración y guías de enfoque.
                 </p>
              </div>
            )}
          </div>
        </section>

        {/* Closing Quote */}
        <section className="mt-72 text-center max-w-3xl mx-auto">
          <div className="w-16 h-[1px] bg-gold/20 mx-auto mb-16" />
          <h2 className="text-5xl md:text-7xl font-display italic text-paper/80 leading-tight tracking-tighter">
            "{siteContent.closingQuote}"
          </h2>
          <div className="mt-16 flex justify-center gap-8 text-gold/30">
             <Music size={20} />
             <Sparkles size={20} />
             <Heart size={20} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
