import { motion } from 'motion/react';
import { ShoppingBag, Plus, Minus, Info, Music, Search, Compass } from 'lucide-react';
import { useApp, Product } from '../context/AppContext';
import { useState } from 'react';
import { cn } from '../lib/utils';

export default function Shop() {
  const { products, addToCart } = useApp();
  const [filter, setFilter] = useState<'all' | 'music' | 'lyrics' | 'merch' | 'art'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState(1000);

  const filteredProducts = products.filter(p => {
    if (p.category === 'ritual') return false; // Rituals have their own page
    const matchesCategory = filter === 'all' || p.category === filter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = p.price <= maxPrice;
    return matchesCategory && matchesSearch && matchesPrice;
  });

  return (
    <div className="pt-56 pb-40 px-6 lg:px-12 max-w-7xl mx-auto min-h-screen">
      <header className="mb-40 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <span className="text-[10px] uppercase tracking-[0.8em] text-brand-gold font-bold mb-8 block">Boutique & Archivo</span>
          <h1 className="text-7xl lg:text-9xl font-display italic tracking-tighter mb-10">Curaduría Alquímica</h1>
          <p className="text-base font-light text-white/30 max-w-xl mx-auto tracking-wide leading-relaxed">
            Una colección rigurosa de objetos, frecuencias y textos seleccionados para la transformación emocional.
          </p>
        </motion.div>

        {/* Professional Minimal Filters */}
        <div className="mt-24 flex flex-col md:flex-row gap-12 items-center w-full justify-between border-y border-white/5 py-10">
           <div className="flex flex-wrap gap-14">
              {(['all', 'music', 'lyrics', 'merch', 'art'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={cn(
                    "text-[10px] uppercase tracking-[0.4em] font-bold transition-all relative py-2",
                    filter === cat ? "text-brand-gold" : "text-white/20 hover:text-white/60"
                  )}
                >
                  {cat === 'all' ? 'Todo' : 
                   cat === 'music' ? 'Frecuencia' : 
                   cat === 'lyrics' ? 'Escritura' :
                   cat === 'merch' ? 'Objeto' : 'Imagen'}
                  {filter === cat && (
                    <motion.div layoutId="shopFilterUnder" className="absolute -bottom-2 left-0 w-full h-[1px] bg-brand-gold" />
                  )}
                </button>
              ))}
           </div>

           <div className="flex items-center gap-12 w-full md:w-auto">
              <div className="relative group/search flex-grow md:flex-grow-0">
                 <input 
                   placeholder="BUSCAR EN ARCHIVO..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="bg-transparent border-b border-white/10 py-3 pl-0 pr-12 text-[9px] uppercase tracking-[0.4em] font-bold outline-none focus:border-brand-gold transition-all w-full md:w-64 placeholder:text-white/10"
                 />
                 <Search className="absolute right-0 top-1/2 -translate-y-1/2 text-white/20 group-focus-within/search:text-brand-gold" size={14} />
              </div>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-32">
          {filteredProducts.map((product: Product) => (
            <div key={product.id}>
              <ProductCard 
                product={product} 
                onAdd={(opts: Record<string, string>, variant?: any) => addToCart(product, opts, variant)}
              />
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-40 text-center animate-pulse">
             <h3 className="text-4xl font-display italic text-white/20">Silencio absoluto.</h3>
             <p className="text-[10px] uppercase tracking-[0.4em] opacity-20 mt-4">Ninguna obra coincide con tu búsqueda.</p>
          </div>
        )}
      </div>
  );
}

function ProductCard({ product, onAdd }: { 
  product: Product; 
  onAdd: (options: Record<string, string>, variant?: any) => void 
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    product.options?.forEach(opt => {
      initial[opt.name] = opt.values[0] || '';
    });
    return initial;
  });

  const matchingVariant = product.variants?.find(v => 
    Object.entries(selectedOptions).every(([name, val]) => v.combination[name] === val)
  );

  const currentPrice = matchingVariant ? matchingVariant.price : product.price;
  const currentStock = matchingVariant ? matchingVariant.stock : product.stock;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden mb-8 bg-brand-slate group">
        <motion.img 
          src={product.image} 
          alt={product.name}
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-90 transition-all duration-[2s]"
        />
        
        <div className={cn(
          "absolute inset-0 bg-brand-black/60 transition-all duration-700 flex flex-col items-center justify-center p-8",
          isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
        )}>
          <button 
            onClick={() => onAdd(selectedOptions, matchingVariant)}
            disabled={currentStock === 0}
            className="btn-primary w-full shadow-2xl"
          >
            {currentStock > 0 ? (
              <>Añadir al Carrito <ShoppingBag size={14} /></>
            ) : 'Existencias Agotadas'}
          </button>
          
          {product.audioUrl && (
            <motion.button 
              whileHover={{ scale: 1.02 }}
              onClick={() => window.open(product.audioUrl, '_blank')}
              className="mt-6 text-[9px] uppercase tracking-[0.4em] font-bold text-white/50 hover:text-brand-gold flex items-center gap-3 transition-colors"
            >
              <Music size={14} /> Escuchar Preludio
            </motion.button>
          )}
        </div>
        
        <div className="absolute top-6 left-6 p-3 bg-brand-black/40 backdrop-blur-md border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
           <span className="text-[7px] uppercase tracking-widest font-black text-white/60">{product.id}</span>
        </div>
      </div>

      <div className="space-y-6 px-1">
        <div className="flex justify-between items-start gap-8">
          <div>
            <h3 className="text-3xl font-display italic leading-none mb-3 group-hover:text-brand-gold transition-colors duration-500">
              {product.name}
            </h3>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-30">{product.category}</p>
          </div>
          <span className="text-xl font-sans font-light tracking-tighter text-brand-gold leading-none">${currentPrice}</span>
        </div>

        <p className="text-[13px] font-light text-white/40 leading-relaxed max-w-[280px]">
          {product.description}
        </p>

        {product.options && product.options.length > 0 && (
          <div className="pt-6 grid grid-cols-1 gap-6 border-t border-white/5">
            {product.options.map((opt) => (
              <div key={opt.name} className="flex flex-col gap-3">
                <span className="text-[8px] uppercase tracking-[0.4em] font-bold opacity-20">{opt.name}</span>
                <div className="flex flex-wrap gap-4">
                  {opt.values.map((val) => (
                    <button
                      key={val}
                      onClick={() => setSelectedOptions(prev => ({ ...prev, [opt.name]: val }))}
                      className={cn(
                        "text-[9px] uppercase tracking-[0.2em] font-medium py-1 transition-all border-b",
                        selectedOptions[opt.name] === val 
                          ? "text-brand-gold border-brand-gold" 
                          : "text-white/20 border-transparent hover:text-white/50"
                      )}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
