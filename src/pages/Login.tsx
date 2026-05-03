import { useState, FormEvent, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

export default function Login() {
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const { login, isAdmin } = useApp();
  const navigate = useNavigate();

  const ADMIN_EMAIL = 'bspock1990@gmail.com';

  useEffect(() => {
    if (isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!password) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
      return;
    }

    setStatus('loading');
    const success = await login(ADMIN_EMAIL, password);
    
    if (success) {
      navigate('/admin');
    } else {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 scale-110"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1514525253344-f814d07b6655?auto=format&fit=crop&q=80&w=2000")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.2) saturate(0.5) blur(4px)'
        }}
      />
      
      {/* Cinematic Overlays */}
      <div className="absolute inset-0 bg-ink/70 z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-black/60 z-0" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-[400px] px-6 z-10"
      >
        <div className="bg-paper/10 border border-paper/10 p-10 md:p-14 rounded-[3.5rem] backdrop-blur-3xl relative overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="text-center relative z-10">
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-gold/20 shadow-[0_0_40px_rgba(212,175,55,0.15)]"
            >
              <Lock className="text-gold" size={28} strokeWidth={1} />
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-display italic mb-3 text-gold tracking-tight">El Portal</h1>
            <p className="text-[10px] uppercase tracking-[0.5em] font-black text-paper/30 mb-12">Reservado para la Hechicera</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gold/30 group-focus-within:text-gold transition-colors">
                <Lock size={16} strokeWidth={1.5} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Llave del Ritual"
                className="w-full bg-black/40 border border-paper/10 rounded-2xl pl-16 pr-6 py-5 text-sm outline-none focus:border-gold/50 transition-all font-mono text-paper placeholder:text-paper/20 backdrop-blur-md"
                autoFocus
              />
            </div>

            <AnimatePresence>
              {status === 'error' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center gap-3 text-red-500 text-[11px] uppercase tracking-[0.2em] font-bold"
                >
                  <AlertCircle size={14} /> 
                  Ritual Fallido
                </motion.div>
              )}
            </AnimatePresence>
            
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-gold text-ink py-6 rounded-2xl text-[10px] uppercase tracking-[0.4em] font-black hover:bg-white hover:text-black transition-all flex items-center justify-center gap-4 shadow-[0_20px_40px_rgba(0,0,0,0.4)] active:scale-95 disabled:opacity-50 relative group overflow-hidden"
            >
              {status === 'loading' ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  <span className="relative z-10">Invocar Panel</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform relative z-10" />
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-12 text-center relative z-10">
            <div className="h-[1px] w-12 bg-white/10 mx-auto mb-6" />
            <p className="text-[9px] uppercase tracking-[0.4em] text-paper/20 font-medium leading-loose">
              Protección Arcaica <br /> 
              Vía Firebase Security Protocol
            </p>
          </div>

          {/* Atmospheric Elements */}
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-gold/5 rounded-full blur-[100px] z-0" />
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-white/5 rounded-full blur-[100px] z-0" />
        </div>

        {/* Home Link */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={() => navigate('/')}
          className="mt-12 mx-auto flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-paper/40 hover:text-gold transition-colors"
        >
          <span>Volver al Reino Exterior</span>
        </motion.button>
      </motion.div>
    </div>
  );
}
