import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, ArrowRight, ShieldCheck, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Cart() {
  const { cart, removeFromCart, total } = useApp();
  const [checkingOut, setCheckingOut] = useState(false);

  if (cart.length === 0 && !checkingOut) {
    return (
      <div className="pt-40 pb-20 px-12 text-center max-w-xl mx-auto min-h-[60vh] flex flex-col justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-5xl font-display italic mb-8">El Elixir está vacío</h2>
          <p className="text-paper/40 font-light mb-12 leading-relaxed tracking-wide">
            Parece que no has invocado ninguna emoción todavía. <br />
            Explora el almacén de escenas para comenzar tu ritual creativo.
          </p>
          <Link 
            to="/tienda"
            className="bg-paper text-ink px-12 py-5 rounded-full text-[10px] uppercase tracking-[0.3em] font-black hover:bg-gold hover:text-paper transition-all inline-block"
          >
            Volver a la Tienda
          </Link>
        </motion.div>
      </div>
    );
  }

  if (checkingOut) {
    return (
      <div className="pt-40 pb-20 px-12 text-center max-w-xl mx-auto min-h-[60vh] flex flex-col justify-center">
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <ShieldCheck size={80} className="text-gold mx-auto mb-8" strokeWidth={1} />
          <h2 className="text-5xl font-display italic mb-6">Sesión Confirmada</h2>
          <p className="text-gold/60 font-medium mb-12 leading-relaxed uppercase tracking-[0.3em] text-[10px]">
            La transacción ha sido segura y encriptada. <br />
            ID del Ritual: {Math.random().toString(36).substr(2, 9).toUpperCase()}
          </p>
          <div className="p-10 bg-paper/[0.03] border border-paper/10 rounded-[2.5rem] mb-12 backdrop-blur-md">
            <p className="text-[9px] uppercase tracking-[0.4em] font-bold opacity-30 mb-4">Inversión Artística</p>
            <p className="text-5xl font-mono text-gold tracking-tighter italic">${total.toFixed(2)}</p>
          </div>
          <Link 
            to="/"
            className="bg-paper text-ink px-12 py-5 rounded-full text-[10px] uppercase tracking-[0.3em] font-black hover:bg-gold hover:text-paper transition-all inline-block shadow-2xl shadow-white/5"
          >
            Finalizar Ritual
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-40 pb-20 px-12 max-w-7xl mx-auto grid lg:grid-cols-12 gap-16">
      <div className="lg:col-span-7">
        <h1 className="text-6xl font-display italic tracking-tight mb-16">Tus Invocaciones</h1>
        
        <div className="space-y-12 border-t border-paper/10 pt-12">
          <AnimatePresence mode='popLayout'>
            {cart.map((item) => (
              <motion.div 
                key={item.variantId ? `${item.product.id}-${item.variantId}` : item.product.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-10 group"
              >
                <div className="w-28 h-36 rounded-2xl overflow-hidden bg-ink grayscale group-hover:grayscale-0 transition-all duration-700 border border-paper/10">
                  <img src={item.product.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-3xl font-display italic group-hover:text-gold transition-colors">{item.product.name}</h3>
                    <p className="font-mono text-xl text-gold">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                  
                  {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {Object.entries(item.selectedOptions).map(([name, val]) => (
                        <span key={name} className="text-[7px] uppercase tracking-widest font-black bg-gold/10 text-gold/80 px-2.5 py-1 rounded-full border border-gold/20">
                          {name}: {val}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <p className="text-[9px] uppercase font-bold tracking-[0.3em] opacity-30">
                      Unidad: ${item.product.price} / Cant: {item.quantity}
                    </p>
                    <button 
                      onClick={() => removeFromCart(item.product.id, item.variantId)}
                      className="text-red-400/50 hover:text-red-400 transition-colors p-2 active:scale-95"
                    >
                      <Trash2 size={20} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="lg:col-span-5">
        <div className="bg-paper/[0.03] border border-paper/10 p-12 rounded-[3.5rem] sticky top-40 backdrop-blur-md">
          <h2 className="text-[10px] uppercase tracking-[0.5em] font-bold text-gold mb-12">Ritual de Pago</h2>
          
          <div className="space-y-6 mb-12 text-sm font-light opacity-50 tracking-wide">
            <div className="flex justify-between items-center">
              <span>Subtotal</span>
              <span className="font-mono">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Impuestos Sagrados</span>
              <span className="font-mono">$0.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Gestión</span>
              <span className="font-mono">Incluida</span>
            </div>
            <div className="h-px bg-paper/10 my-8"></div>
            <div className="flex justify-between items-center text-2xl font-display italic opacity-100 italic">
              <span className="text-gold">Total Final</span>
              <span className="text-3xl tracking-tighter">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3 text-[9px] uppercase tracking-[0.3em] font-bold opacity-30 mb-4 justify-center">
              <ShieldCheck size={14} className="text-gold" /> Pasarela Encriptada Segura
            </div>
            <button 
              onClick={() => setCheckingOut(true)}
              className="w-full bg-gold text-ink py-6 rounded-full text-[11px] uppercase tracking-[0.3em] font-black hover:bg-paper hover:text-ink transition-all flex items-center justify-center gap-4 shadow-3xl shadow-gold/10 active:scale-95"
            >
              Confirmar Invocación
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
