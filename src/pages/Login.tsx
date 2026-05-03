import { useState, FormEvent, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, ArrowRight, AlertCircle } from 'lucide-react';

export default function Login() {
   const [password, setPassword] = useState('');
  const [errorStatus, setErrorStatus] = useState<'idle' | 'invalid' | 'complexity'>('idle');
  const { login, isAdmin } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);

  const validateComplexity = (pass: string) => {
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    return pass.length >= 8 && hasUpper && hasLower && hasNumber && hasSpecial;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!password) {
      setErrorStatus('invalid');
      setTimeout(() => setErrorStatus('idle'), 2000);
      return;
    }

    if (login(password)) {
      navigate('/admin');
    } else {
      setErrorStatus('invalid');
      setTimeout(() => setErrorStatus('idle'), 2000);
    }
  };

  return (
    <div className="pt-40 pb-20 px-12 text-center max-w-md mx-auto min-h-[70vh] flex flex-col justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-paper/[0.03] border border-paper/10 p-12 rounded-[3.5rem] backdrop-blur-md"
      >
        <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-gold/20">
          <Lock className="text-gold" size={24} strokeWidth={1.5} />
        </div>
        
        <h1 className="text-4xl font-display italic mb-4">Acceso Reservado</h1>
        <p className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-30 mb-10">Solo para la Hechicera</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña del Ritual"
              className={`w-full bg-ink border ${errorStatus !== 'idle' ? 'border-red-500' : 'border-paper/10'} rounded-2xl px-6 py-4 text-sm outline-none focus:border-gold transition-colors text-center font-mono`}
              autoFocus
            />
            {errorStatus !== 'idle' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute -bottom-8 left-0 right-0 flex items-center justify-center gap-2 text-red-400 text-[10px] uppercase tracking-widest font-bold"
              >
                <AlertCircle size={12} /> 
                {errorStatus === 'invalid' ? 'Acceso Denegado' : 'Contraseña Débil'}
              </motion.div>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full bg-gold text-ink py-5 rounded-full text-xs uppercase tracking-[0.3em] font-black hover:bg-paper hover:text-ink transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
          >
            Entrar al Panel
            <ArrowRight size={16} />
          </button>
        </form>
        
        <p className="mt-12 text-[9px] uppercase tracking-[0.4em] opacity-20 font-medium">
          Acceso Encriptado y Seguro
        </p>
      </motion.div>
    </div>
  );
}
