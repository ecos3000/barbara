import React, { useState, useEffect, useRef } from 'react';
import { useApp, Product } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Save, Trash2, Layout, PlusCircle, FileText, Package, LogOut,
  Upload, Check, RotateCcw, Search, Sparkles, Image as ImageIcon, X, Loader2, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Admin() {
  const { products, updateProduct, isAdmin, logout, siteContent, updateSiteContent, addProduct, removeProduct, changePassword, loading } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'inventory' | 'content' | 'links' | 'settings'>('inventory');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [showAddSuccess, setShowAddSuccess] = useState(false);
  
  // Upload Feedback
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Settings
  const [newPass, setNewPass] = useState('');
  const [passStatus, setPassStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // Content values for editing
  const [editedContent, setEditedContent] = useState(siteContent);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/login');
    }
  }, [isAdmin, loading, navigate]);

  // Auto-save logic for site content and links
  useEffect(() => {
    if (activeTab === 'inventory') return; // Inventory handles its own individual saves via direct store updates
    
    // Check if content actually changed compared to siteContent in context
    const hasChanged = JSON.stringify(editedContent) !== JSON.stringify(siteContent);
    if (!hasChanged) return;

    setSaveStatus('saving');
    
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    
    saveTimeoutRef.current = setTimeout(() => {
      updateSiteContent(editedContent);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1500);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [editedContent, activeTab]);

  if (!isAdmin) return null;

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>, trackingId: string, productId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('audio') && !file.name.endsWith('.mp3')) {
      setUploadError("Formato de audio no válido. Se requiere MP3.");
      return;
    }

    if (file.size > 25 * 1024 * 1024) { 
      setUploadError("El archivo es demasiado pesado (Máx 25MB).");
      return;
    }

    setUploadError(null);
    setUploadProgress(prev => ({ ...prev, [trackingId]: 0 }));

    const reader = new FileReader();
    
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(prev => ({ ...prev, [trackingId]: progress }));
      }
    };

    reader.onloadstart = () => {
      setUploadProgress(prev => ({ ...prev, [trackingId]: 10 }));
    };

    reader.onloadend = () => {
      updateProduct(productId, { audioUrl: reader.result as string });
      setUploadProgress(prev => {
        const copy = { ...prev };
        delete copy[trackingId];
        return copy;
      });
    };

    reader.readAsDataURL(file);
  };

  const handleImageUploadWithFeedback = (e: React.ChangeEvent<HTMLInputElement>, id: string, isSiteContent: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('image')) {
      setUploadError("El archivo seleccionado debe ser una imagen.");
      return;
    }

    if (file.size > 0.8 * 1024 * 1024) {
      setUploadError("Imagen demasiado grande para base de datos (Límite 0.8MB). Para imágenes mayores, usa una URL externa.");
      return;
    }

    setUploadError(null);
    setUploadProgress(prev => ({ ...prev, [id]: 0 }));

    const reader = new FileReader();
    
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(prev => ({ ...prev, [id]: progress }));
      }
    };

    reader.onloadend = () => {
      const url = reader.result as string;
      if (isSiteContent) {
        setEditedContent(prev => ({ ...prev, [id]: url }));
      } else {
        updateProduct(id, { image: url });
      }
      setUploadProgress(prev => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    };

    reader.readAsDataURL(file);
  };

  const PRESET_ASSETS = [
    'https://images.unsplash.com/photo-1514525253361-bee87380cf40?auto=format&fit=crop&q=80&w=800', // Music
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800', // Ritual
    'https://images.unsplash.com/photo-1459749411177-0421800673e6?auto=format&fit=crop&q=80&w=800', // Art
    'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800', // Dark
    'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800'  // Atmospheric
  ];

  const regenerateWithAI = (type: string, id?: string) => {
    // This would normally call an API. For now, we simulate with a high-quality relevant Unsplash URL
    const url = `https://images.unsplash.com/photo-${Math.random().toString(36).substr(2, 9)}?auto=format&fit=crop&q=80&w=1200&sig=${Math.random()}`;
    
    if (id) {
      updateProduct(id, { image: url });
    } else {
      setEditedContent(prev => ({ ...prev, [type]: url }));
    }
    alert('Imagen regenerada artísticamente (Simulado)');
  };

  const addOption = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const newOptions = [...(product.options || []), { name: 'Color/Talla/Formato', values: ['Opción 1'] }];
      updateProduct(productId, { options: newOptions });
    }
  };

  const updateOptionName = (productId: string, optIndex: number, name: string) => {
    const product = products.find(p => p.id === productId);
    if (product && product.options) {
      const newOptions = [...product.options];
      newOptions[optIndex] = { ...newOptions[optIndex], name };
      updateProduct(productId, { options: newOptions });
    }
  };

  const addOptionValue = (productId: string, optIndex: number) => {
    const product = products.find(p => p.id === productId);
    if (product && product.options) {
      const newOptions = [...product.options];
      newOptions[optIndex] = { ...newOptions[optIndex], values: [...newOptions[optIndex].values, 'Nuevo'] };
      updateProduct(productId, { options: newOptions });
    }
  };

  const removeOptionValue = (productId: string, optIndex: number, valIndex: number) => {
    const product = products.find(p => p.id === productId);
    if (product && product.options) {
      const newOptions = [...product.options];
      newOptions[optIndex] = { ...newOptions[optIndex], values: newOptions[optIndex].values.filter((_, i) => i !== valIndex) };
      updateProduct(productId, { options: newOptions });
    }
  };

  const removeOption = (productId: string, optIndex: number) => {
    const product = products.find(p => p.id === productId);
    if (product && product.options) {
      updateProduct(productId, { options: product.options.filter((_, i) => i !== optIndex) });
    }
  };

  const addVariant = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const combination = (product.options || []).reduce((acc, opt) => {
        acc[opt.name] = opt.values[0] || '';
        return acc;
      }, {} as Record<string, string>);

      const newVariants = [
        ...(product.variants || []),
        {
          id: `var_${Date.now()}`,
          title: 'Nueva Variante',
          price: product.price,
          stock: product.stock,
          combination
        }
      ];
      updateProduct(productId, { variants: newVariants });
    }
  };

  const updateVariant = (productId: string, variantId: string, updates: any) => {
    const product = products.find(p => p.id === productId);
    if (product && product.variants) {
      const newVariants = product.variants.map(v => 
        v.id === variantId ? { ...v, ...updates } : v
      );
      updateProduct(productId, { variants: newVariants });
    }
  };

  const removeVariant = (productId: string, variantId: string) => {
    const product = products.find(p => p.id === productId);
    if (product && product.variants) {
      updateProduct(productId, { variants: product.variants.filter(v => v.id !== variantId) });
    }
  };

  const handleUpdatePassword = async () => {
    if (newPass.length < 8) {
      setPassStatus('error');
      setTimeout(() => setPassStatus('idle'), 3000);
      return;
    }
    const success = await changePassword(newPass);
    if (success) {
      setPassStatus('success');
      setNewPass('');
    } else {
      setPassStatus('error');
    }
    setTimeout(() => setPassStatus('idle'), 3000);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      removeProduct(productToDelete);
      setProductToDelete(null);
    }
  };

  const handleAddProduct = () => {
    const newId = `prod_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    addProduct({
      id: newId,
      name: 'Nueva Obra',
      description: 'Una nueva pieza para el catálogo...',
      price: 0,
      image: 'https://images.unsplash.com/photo-1514525253361-bee87380cf40?auto=format&fit=crop&q=80&w=800',
      category: 'merch',
      stock: 0
    });
    setShowAddSuccess(true);
    setTimeout(() => setShowAddSuccess(false), 3000);
  };

  const updateSocialLink = (index: number, field: 'platform' | 'url', value: string) => {
    const newLinks = [...editedContent.socialLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setEditedContent({ ...editedContent, socialLinks: newLinks });
  };

  const updateCustomButton = (index: number, field: 'label' | 'url', value: string) => {
    const newButtons = [...editedContent.customButtons];
    newButtons[index] = { ...newButtons[index], [field]: value };
    setEditedContent({ ...editedContent, customButtons: newButtons });
  };

  const addSocialLink = () => {
    setEditedContent({
      ...editedContent,
      socialLinks: [...(editedContent.socialLinks || []), { platform: 'Nueva Red', url: '' }]
    });
  };

  const addCustomButton = () => {
    setEditedContent({
      ...editedContent,
      customButtons: [...(editedContent.customButtons || []), { label: 'Nuevo Botón', url: '' }]
    });
  };

  const addBenefit = () => {
    setEditedContent({
      ...editedContent,
      ritualsBenefits: [...(editedContent.ritualsBenefits || []), { icon: 'Brain', title: 'Nuevo Beneficio', desc: 'Descripción...' }]
    });
  };

  const updateBenefit = (index: number, field: 'title' | 'desc' | 'icon', value: string) => {
    const newBenefits = [...editedContent.ritualsBenefits];
    newBenefits[index] = { ...newBenefits[index], [field]: value };
    setEditedContent({ ...editedContent, ritualsBenefits: newBenefits });
  };

  const removeBenefit = (index: number) => {
    const newBenefits = editedContent.ritualsBenefits.filter((_, i) => i !== index);
    setEditedContent({ ...editedContent, ritualsBenefits: newBenefits });
  };

  const removeSocialLink = (index: number) => {
    const newLinks = editedContent.socialLinks.filter((_, i) => i !== index);
    setEditedContent({ ...editedContent, socialLinks: newLinks });
  };

  const removeCustomButton = (index: number) => {
    const newButtons = editedContent.customButtons.filter((_, i) => i !== index);
    setEditedContent({ ...editedContent, customButtons: newButtons });
  };

  return (
    <div className="pt-40 pb-20 px-12 max-w-7xl mx-auto text-paper">
      <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <span className="text-[10px] uppercase tracking-[0.5em] text-gold font-bold mb-4 block">Panel de Control</span>
          <h1 className="text-6xl font-display italic tracking-tight">Gestión del Universo</h1>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2 mr-4">
            <AnimatePresence mode="wait">
              {saveStatus === 'saving' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-paper/40 text-[10px] uppercase tracking-widest"
                >
                  <Loader2 size={12} className="animate-spin" /> Guardando...
                </motion.div>
              )}
              {saveStatus === 'saved' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-gold text-[10px] uppercase tracking-widest"
                >
                  <Check size={12} /> Cambios Seguros
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button 
            onClick={logout}
            className="border border-red-500/30 text-red-400 px-6 py-4 rounded-full text-[10px] uppercase tracking-[0.3em] font-bold flex items-center gap-2 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={14} /> Salir
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-8 mb-12 border-b border-paper/10">
        <button 
          onClick={() => setActiveTab('inventory')}
          className={`pb-4 text-[10px] uppercase tracking-[0.3em] font-bold transition-all border-b-2 ${activeTab === 'inventory' ? 'border-gold text-gold' : 'border-transparent opacity-40 hover:opacity-100'}`}
        >
          <div className="flex items-center gap-2">
            <Package size={14} /> Inventario
          </div>
        </button>
        <button 
          onClick={() => setActiveTab('content')}
          className={`pb-4 text-[10px] uppercase tracking-[0.3em] font-bold transition-all border-b-2 ${activeTab === 'content' ? 'border-gold text-gold' : 'border-transparent opacity-40 hover:opacity-100'}`}
        >
          <div className="flex items-center gap-2">
            <Layout size={14} /> Estética y Mensaje
          </div>
        </button>
        <button 
          onClick={() => setActiveTab('links')}
          className={`pb-4 text-[10px] uppercase tracking-[0.3em] font-bold transition-all border-b-2 ${activeTab === 'links' ? 'border-gold text-gold' : 'border-transparent opacity-40 hover:opacity-100'}`}
        >
          <div className="flex items-center gap-2">
            <Plus size={14} /> Puentes de Conexión
          </div>
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`pb-4 text-[10px] uppercase tracking-[0.3em] font-bold transition-all border-b-2 ${activeTab === 'settings' ? 'border-gold text-gold' : 'border-transparent opacity-40 hover:opacity-100'}`}
        >
          <div className="flex items-center gap-2">
            <RotateCcw size={14} /> Ajustes
          </div>
        </button>
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
      >
        {activeTab === 'inventory' ? (
          <div>
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-6">
                <h2 className="text-3xl font-display italic">Servicios y Ritualismo</h2>
                <AnimatePresence>
                  {showAddSuccess && (
                    <motion.span 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-[9px] uppercase tracking-widest text-gold font-bold bg-gold/10 px-4 py-2 rounded-full"
                    >
                      Nueva Invocación Creada
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <button 
                onClick={handleAddProduct}
                className="bg-paper text-ink px-8 py-4 rounded-full text-[10px] uppercase tracking-[0.3em] font-black flex items-center gap-3 hover:bg-gold hover:text-paper transition-all"
              >
                <Plus size={14} strokeWidth={3} /> Nueva Obra
              </button>
            </div>
            
            <div className="space-y-6">
              <AnimatePresence initial={false}>
                {products.map((product) => (
                  <motion.div 
                    key={product.id} 
                    layout
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-paper/[0.02] rounded-[2.5rem] border border-paper/10 p-8 shadow-2xl backdrop-blur-sm group"
                  >
                  <div className="grid lg:grid-cols-6 gap-10">
                    <div className="lg:col-span-1">
                      <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-ink grayscale border border-paper/10 group-hover:grayscale-0 transition-all duration-700 relative shadow-inner">
                        <img src={product.image} alt="" className={`w-full h-full object-cover ${uploadProgress[product.id] !== undefined ? 'opacity-30 blur-sm' : ''}`} />
                        
                        {/* Progress Overlay */}
                        <AnimatePresence>
                          {uploadProgress[product.id] !== undefined && (
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 flex flex-col items-center justify-center bg-brand-black/60 backdrop-blur-sm p-4"
                            >
                              <Loader2 className="animate-spin text-brand-gold mb-3" size={24} />
                              <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mb-2">
                                <motion.div 
                                  className="h-full bg-brand-gold"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${uploadProgress[product.id]}%` }}
                                />
                              </div>
                              <span className="text-[9px] font-black tracking-widest text-brand-gold">{uploadProgress[product.id]}%</span>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Error Overlay */}
                        <AnimatePresence>
                          {uploadError && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="absolute inset-x-2 bottom-2 bg-red-500 text-white p-3 rounded-xl flex items-center gap-2 shadow-xl z-20"
                            >
                              <AlertCircle size={14} />
                              <span className="text-[9px] font-bold leading-tight flex-grow">{uploadError}</span>
                              <button onClick={() => setUploadError(null)} className="p-1 hover:bg-white/20 rounded">
                                <X size={10} />
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <div className="absolute inset-x-0 bottom-0 p-3 bg-ink/90 backdrop-blur-xl opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 flex flex-col gap-2">
                           <div className="flex gap-1">
                             <input 
                                type="text" 
                                value={product.image}
                                onChange={(e) => updateProduct(product.id, { image: e.target.value })}
                                placeholder="https://..."
                                className="flex-grow bg-paper/5 border border-paper/20 rounded-lg px-2 py-1 text-[8px] font-mono outline-none focus:border-gold text-paper"
                              />
                              <label className="bg-paper/10 border border-paper/20 rounded-lg p-1 cursor-pointer hover:bg-gold hover:text-ink transition-colors" title="Subir Imagen">
                                <Upload size={10} />
                                <input 
                                  type="file" 
                                  className="hidden" 
                                  accept="image/*"
                                  onChange={(e) => handleImageUploadWithFeedback(e, product.id)} 
                                />
                              </label>
                           </div>
                           
                           {/* Gallery of Assets */}
                           <div className="flex justify-between gap-1">
                              {PRESET_ASSETS.map((asset, i) => (
                                <button 
                                  key={i}
                                  onClick={() => updateProduct(product.id, { image: asset })}
                                  className={`flex-grow h-4 rounded border ${product.image === asset ? 'border-gold' : 'border-paper/20 opacity-40 hover:opacity-100'}`}
                                  style={{ backgroundImage: `url('${asset}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                                />
                              ))}
                           </div>

                           <button 
                             onClick={() => regenerateWithAI('inventory', product.id)}
                             className="w-full bg-gold/20 border border-gold/40 text-gold text-[7px] uppercase tracking-widest py-1 rounded-lg flex items-center justify-center gap-1 hover:bg-gold hover:text-ink transition-all"
                           >
                             <Sparkles size={10} /> Regenerar con IA
                           </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="lg:col-span-5 space-y-6">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-grow space-y-4">
                          <div className="group/input relative">
                            <input 
                              value={product.name}
                              onChange={(e) => updateProduct(product.id, { name: e.target.value })}
                              placeholder="Nombre de la Obra"
                              className="bg-transparent border-b border-paper/10 text-3xl font-display italic text-gold outline-none focus:border-gold w-full transition-all"
                            />
                          </div>
                          <textarea 
                            value={product.description}
                            onChange={(e) => updateProduct(product.id, { description: e.target.value })}
                            placeholder="Descripción poética y técnica..."
                            className="bg-transparent border-none text-sm font-light text-paper/60 w-full outline-none focus:ring-0 resize-none leading-relaxed"
                            rows={2}
                          />
                        </div>
                        <button 
                          onClick={() => setProductToDelete(product.id)}
                          className="p-3 text-red-500/20 hover:text-red-500 transition-all hover:bg-red-500/5 rounded-full"
                          title="Eliminar Obra"
                        >
                          <Trash2 size={22} strokeWidth={1.5} />
                        </button>
                      </div>

                      {/* Options / Variants */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="text-[8px] uppercase tracking-[0.3em] font-bold opacity-30">Variantes y Opciones</label>
                          <button 
                            onClick={() => addOption(product.id)}
                            className="text-[8px] uppercase tracking-widest text-gold hover:underline flex items-center gap-1"
                          >
                            <Plus size={10} /> Añadir Categoría de Opción
                          </button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          {product.options?.map((opt, optIndex) => (
                            <div key={optIndex} className="bg-paper/[0.03] border border-paper/10 rounded-2xl p-4 space-y-3 relative group/opt">
                              <div className="flex gap-2">
                                <input 
                                  value={opt.name}
                                  onChange={(e) => updateOptionName(product.id, optIndex, e.target.value)}
                                  className="bg-transparent border-b border-paper/10 text-[10px] font-bold uppercase tracking-widest text-gold outline-none flex-grow"
                                />
                                <button 
                                  onClick={() => removeOption(product.id, optIndex)}
                                  className="text-red-400 opacity-0 group-hover/opt:opacity-100 transition-opacity"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {opt.values.map((val, valIndex) => (
                                  <div key={valIndex} className="flex items-center gap-1 bg-ink/50 border border-paper/10 px-2 py-1 rounded-lg text-[9px] group/val">
                                    <input 
                                      value={val}
                                      onChange={(e) => {
                                        const newValues = [...opt.values];
                                        newValues[valIndex] = e.target.value;
                                        const newOptions = [...product.options!];
                                        newOptions[optIndex] = { ...opt, values: newValues };
                                        updateProduct(product.id, { options: newOptions });
                                      }}
                                      className="bg-transparent outline-none w-16"
                                    />
                                    <button 
                                      onClick={() => removeOptionValue(product.id, optIndex, valIndex)}
                                      className="opacity-0 group-hover/val:opacity-100 text-red-400"
                                    >
                                      <X size={10} />
                                    </button>
                                  </div>
                                ))}
                                <button 
                                  onClick={() => addOptionValue(product.id, optIndex)}
                                  className="p-1 border border-dashed border-paper/20 rounded-lg hover:border-gold transition-colors"
                                >
                                  <Plus size={10} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-4 gap-6 pt-6 border-t border-paper/5">
                        <div className="space-y-2">
                          <label className="text-[8px] uppercase tracking-[0.3em] font-bold opacity-30">Precio (USD)</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/40 text-xs">$</span>
                            <input 
                              type="number"
                              value={product.price}
                              onChange={(e) => updateProduct(product.id, { price: parseFloat(e.target.value) || 0 })}
                              className="w-full bg-paper/[0.03] border border-paper/10 rounded-xl pl-8 pr-4 py-3 text-sm font-mono text-gold outline-none focus:border-gold/50"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[8px] uppercase tracking-[0.3em] font-bold opacity-30">Stock / Disponibilidad</label>
                          <input 
                            type="number"
                            value={product.stock}
                            onChange={(e) => updateProduct(product.id, { stock: parseInt(e.target.value) || 0 })}
                            className="w-full bg-paper/[0.03] border border-paper/10 rounded-xl px-4 py-3 text-sm font-mono outline-none focus:border-gold/50 text-paper"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[8px] uppercase tracking-[0.3em] font-bold opacity-30">Vínculo Extra (Docs/Info)</label>
                          <input 
                            type="text"
                            value={product.extra || ''}
                            onChange={(e) => updateProduct(product.id, { extra: e.target.value })}
                            placeholder="Enlace adicional..."
                            className="w-full bg-paper/[0.03] border border-paper/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-gold/50 text-paper"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[8px] uppercase tracking-[0.3em] font-bold opacity-30">Rastro Sonoro (MP3)</label>
                          <div className="flex gap-2">
                            <input 
                              type="text"
                              value={product.audioUrl || ''}
                              onChange={(e) => updateProduct(product.id, { audioUrl: e.target.value })}
                              placeholder="URL o subida..."
                              className="flex-grow bg-paper/[0.03] border border-paper/10 rounded-xl px-4 py-3 text-[10px] font-mono outline-none focus:border-gold/50 text-paper"
                            />
                            <label className="bg-gold/10 border border-gold/20 rounded-xl px-3 flex items-center justify-center cursor-pointer hover:bg-gold hover:text-ink transition-all relative overflow-hidden">
                              {uploadProgress[product.id + '_audio'] !== undefined ? (
                                <div className="absolute inset-0 bg-brand-gold/20 flex flex-col items-center justify-center">
                                  <div className="absolute inset-0 bg-brand-gold opacity-10 animate-pulse" />
                                  <span className="text-[7px] font-black z-10">{uploadProgress[product.id + '_audio']}%</span>
                                </div>
                              ) : (
                                <Upload size={14} />
                              )}
                              <input 
                                type="file" 
                                className="hidden" 
                                accept="audio/mpeg,audio/wav"
                                onChange={(e) => handleAudioUpload(e, product.id + '_audio', product.id)} 
                              />
                            </label>
                            {product.audioUrl && (
                              <button 
                                onClick={() => updateProduct(product.id, { audioUrl: '' })}
                                className="bg-red-500/10 border border-red-500/20 rounded-xl px-3 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                              >
                                <X size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[8px] uppercase tracking-[0.3em] font-bold opacity-30">Categoría</label>
                          <select 
                            value={product.category}
                            onChange={(e) => updateProduct(product.id, { category: e.target.value as any })}
                            className="w-full bg-paper/[0.03] border border-paper/10 rounded-xl px-4 py-3 text-[10px] uppercase tracking-widest outline-none appearance-none focus:border-gold/50 cursor-pointer"
                          >
                            <option value="music">Música (Frecuencia)</option>
                            <option value="lyrics">Letras (Escritura)</option>
                            <option value="ritual">Ritual (Concentración/Técnica)</option>
                            <option value="merch">Objeto (Físico)</option>
                            <option value="art">Arte (Digital)</option>
                          </select>
                        </div>
                      </div>

                      {/* Variants Management */}
                      <div className="pt-8 border-t border-paper/10 mt-8">
                         <div className="flex justify-between items-center mb-8">
                            <div className="space-y-1">
                               <h4 className="text-[10px] uppercase tracking-[0.4em] font-black opacity-30">Variantes Espectrales</h4>
                               <p className="text-[8px] opacity-20">Define precios y existencias únicas para cada combinación.</p>
                            </div>
                            <button 
                              onClick={() => addVariant(product.id)}
                              className="text-[9px] uppercase tracking-[0.3em] font-black bg-gold/10 text-gold px-6 py-2.5 rounded-full hover:bg-gold hover:text-ink transition-all flex items-center gap-2 border border-gold/20"
                            >
                              <PlusCircle size={14} /> Añadir Combinación
                            </button>
                         </div>

                         <div className="space-y-3">
                            <AnimatePresence>
                              {product.variants?.map((variant) => (
                                <motion.div 
                                  key={variant.id}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: 10 }}
                                  className="grid grid-cols-12 gap-4 items-end bg-paper/[0.02] border border-paper/5 p-5 rounded-[2rem] group/variant hover:border-gold/20 transition-all hover:bg-paper/[0.04]"
                                >
                                  <div className="col-span-12 lg:col-span-5 space-y-3">
                                    <label className="text-[8px] uppercase tracking-[0.3em] font-bold opacity-30 px-2">Configuración Combinada</label>
                                    <div className="flex flex-wrap gap-2">
                                      {product.options?.map((opt) => (
                                        <div key={opt.name} className="space-y-1 flex-grow">
                                          <span className="text-[7px] uppercase tracking-widest opacity-20 block px-1">{opt.name}</span>
                                          <select
                                            value={variant.combination[opt.name]}
                                            onChange={(e) => updateVariant(product.id, variant.id, { 
                                              combination: { ...variant.combination, [opt.name]: e.target.value } 
                                            })}
                                            className="w-full bg-ink/40 border border-paper/10 rounded-xl px-3 py-2 text-[10px] outline-none focus:border-gold/50 cursor-pointer text-paper/80"
                                          >
                                            {opt.values.map(v => <option key={v} value={v}>{v}</option>)}
                                          </select>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="col-span-6 lg:col-span-3 space-y-3">
                                    <label className="text-[8px] uppercase tracking-[0.3em] font-bold opacity-30 px-2">Precio de Escena</label>
                                    <div className="relative">
                                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/30 text-xs">$</span>
                                      <input 
                                        type="number"
                                        value={variant.price}
                                        onChange={(e) => updateVariant(product.id, variant.id, { price: parseFloat(e.target.value) || 0 })}
                                        className="w-full bg-ink/40 border border-paper/10 rounded-xl pl-8 pr-4 py-2 text-xs outline-none focus:border-gold/50 text-gold font-mono"
                                      />
                                    </div>
                                  </div>
                                  <div className="col-span-4 lg:col-span-3 space-y-3">
                                    <label className="text-[8px] uppercase tracking-[0.3em] font-bold opacity-30 px-2">Stock Disponible</label>
                                    <input 
                                      type="number"
                                      value={variant.stock}
                                      onChange={(e) => updateVariant(product.id, variant.id, { stock: parseInt(e.target.value) || 0 })}
                                      className="w-full bg-ink/40 border border-paper/10 rounded-xl px-4 py-2 text-xs outline-none focus:border-gold/50 text-paper font-mono"
                                    />
                                  </div>
                                  <div className="col-span-2 lg:col-span-1 pb-1 text-right">
                                    <button 
                                      onClick={() => removeVariant(product.id, variant.id)}
                                      className="p-3 text-red-500/20 hover:text-red-500 transition-all opacity-0 group-hover/variant:opacity-100 bg-red-500/5 rounded-full"
                                      title="Eliminar Variante"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                </motion.div>
                              ))}
                            </AnimatePresence>
                            {(!product.variants || product.variants.length === 0) && (
                              <div className="text-center py-12 border-2 border-dashed border-paper/5 rounded-[2.5rem]">
                                <Package className="mx-auto text-paper/10 mb-4" size={32} strokeWidth={1} />
                                <p className="text-[10px] uppercase tracking-[0.4em] text-paper/20">Sin variaciones específicas</p>
                              </div>
                            )}
                         </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
             ) : activeTab === 'content' ? (
          <div className="space-y-32">
            {/* Header / Global */}
            <section className="bg-paper/[0.02] border border-paper/10 rounded-[3rem] p-12 space-y-10">
               <h2 className="text-3xl font-display italic text-gold">Identidad Global</h2>
               <div className="grid lg:grid-cols-2 gap-10">
                 <div>
                    <label className="text-[9px] uppercase tracking-[0.3em] font-bold opacity-40 block mb-3">Nombre del Sitio / Marca</label>
                    <input 
                      value={editedContent.siteName}
                      onChange={(e) => setEditedContent({...editedContent, siteName: e.target.value})}
                      className="w-full bg-paper/[0.03] border border-paper/10 rounded-2xl p-6 text-2xl font-display italic outline-none focus:border-gold transition-all text-paper"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase tracking-[0.3em] font-bold opacity-40 block mb-3">Opacidad Fondo Global ({Math.round(editedContent.globalBgOpacity * 100)}%)</label>
                    <input 
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={editedContent.globalBgOpacity}
                      onChange={(e) => setEditedContent({...editedContent, globalBgOpacity: parseFloat(e.target.value)})}
                      className="w-full accent-gold h-12 bg-transparent cursor-pointer"
                    />
                  </div>
               </div>
               <div>
                  <label className="text-[9px] uppercase tracking-[0.3em] font-bold opacity-40 block mb-3">Imagen de Fondo Global (URL / Subida)</label>
                  <div className="flex gap-6 items-center">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden border border-paper/10 bg-ink relative block">
                      <img src={editedContent.globalBgImage} className="w-full h-full object-cover grayscale" />
                      <label className="absolute inset-0 bg-ink/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                        <Upload size={14} />
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUploadWithFeedback(e, 'globalBgImage', true)} />
                      </label>
                    </div>
                    <input 
                      value={editedContent.globalBgImage}
                      onChange={(e) => setEditedContent({...editedContent, globalBgImage: e.target.value})}
                      className="flex-grow bg-paper/[0.03] border border-paper/10 rounded-2xl p-6 text-[10px] font-mono outline-none focus:border-gold transition-all text-paper"
                      placeholder="https://images..."
                    />
                  </div>
               </div>
            </section>

            <div className="grid lg:grid-cols-2 gap-20">
              <div className="space-y-12">
                <h2 className="text-3xl font-display italic mb-10">Página de Inicio</h2>
                
                <div className="space-y-8">
                   <div>
                    <label className="text-[9px] uppercase tracking-[0.3em] font-bold opacity-40 block mb-3">Imagen Hero (URL / Subida)</label>
                    <div className="flex gap-4">
                      <div className="group relative w-32 h-32 rounded-2xl overflow-hidden bg-ink flex-shrink-0 border border-paper/10 shadow-2xl">
                        <img src={editedContent.heroImage} alt="" className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-ink/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                           <label className="p-2 bg-paper/10 rounded-full hover:bg-gold hover:text-ink cursor-pointer transition-all">
                             <Upload size={14} />
                             <input 
                               type="file" 
                               className="hidden" 
                               accept="image/*"
                               onChange={(e) => handleImageUploadWithFeedback(e, 'heroImage', true)}
                             />
                           </label>
                           <button 
                             onClick={() => regenerateWithAI('heroImage')}
                             className="p-2 bg-gold/20 text-gold rounded-full hover:bg-gold hover:text-ink transition-all"
                             title="Regenerar con IA"
                           >
                             <RotateCcw size={14} />
                           </button>
                        </div>
                      </div>
                      <div className="flex-grow space-y-4">
                         <input 
                          value={editedContent.heroImage}
                          onChange={(e) => setEditedContent({...editedContent, heroImage: e.target.value})}
                          className="w-full bg-paper/[0.03] border border-paper/10 rounded-2xl px-6 py-4 text-[10px] font-mono outline-none focus:border-gold transition-all text-paper"
                          placeholder="https://images..."
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-[0.3em] font-bold opacity-40 block mb-3">Título Hero (Usa ',' para saltos de estilo)</label>
                    <input 
                      value={editedContent.heroTitle}
                      onChange={(e) => setEditedContent({...editedContent, heroTitle: e.target.value})}
                      className="w-full bg-paper/[0.03] border border-paper/10 rounded-2xl p-6 text-2xl font-display italic outline-none focus:border-gold transition-all text-paper"
                    />
                  </div>
                  
                  <div>
                    <label className="text-[9px] uppercase tracking-[0.3em] font-bold opacity-40 block mb-3">Subtítulo Hero</label>
                    <textarea 
                      value={editedContent.heroSubtitle}
                      onChange={(e) => setEditedContent({...editedContent, heroSubtitle: e.target.value})}
                      rows={3}
                      className="w-full bg-paper/[0.03] border border-paper/10 rounded-2xl p-6 text-sm font-light leading-relaxed outline-none focus:border-gold transition-all text-paper"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-[0.3em] font-bold opacity-40 block mb-3">Manifesto (Frase Impacto)</label>
                    <textarea 
                      value={editedContent.manifestoQuote}
                      onChange={(e) => setEditedContent({...editedContent, manifestoQuote: e.target.value})}
                      rows={2}
                      className="w-full bg-paper/[0.03] border border-paper/10 rounded-2xl p-6 text-xl font-display italic outline-none focus:border-gold transition-all text-paper"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-[0.3em] font-bold opacity-40 block mb-3">Frase de Cierre (Rituales)</label>
                    <textarea 
                      value={editedContent.closingQuote}
                      onChange={(e) => setEditedContent({...editedContent, closingQuote: e.target.value})}
                      rows={2}
                      className="w-full bg-paper/[0.03] border border-paper/10 rounded-2xl p-6 text-xl font-display italic outline-none focus:border-gold transition-all text-paper"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-12">
                <h2 className="text-3xl font-display italic mb-10">Rituales (Landing)</h2>
                
                <div className="space-y-8">
                   <div>
                    <label className="text-[9px] uppercase tracking-[0.3em] font-bold opacity-40 block mb-3">Título de Rituales</label>
                    <input 
                      value={editedContent.ritualsTitle}
                      onChange={(e) => setEditedContent({...editedContent, ritualsTitle: e.target.value})}
                      className="w-full bg-paper/[0.03] border border-paper/10 rounded-2xl p-6 text-2xl font-display italic outline-none focus:border-gold transition-all text-paper"
                    />
                  </div>
                  
                  <div>
                    <label className="text-[9px] uppercase tracking-[0.3em] font-bold opacity-40 block mb-3">Descripción / Introducción</label>
                    <textarea 
                      value={editedContent.ritualsSubtitle}
                      onChange={(e) => setEditedContent({...editedContent, ritualsSubtitle: e.target.value})}
                      rows={3}
                      className="w-full bg-paper/[0.03] border border-paper/10 rounded-2xl p-6 text-sm font-light outline-none focus:border-gold transition-all text-paper"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <label className="text-[9px] uppercase tracking-[0.3em] font-bold opacity-40">Beneficios (Grid)</label>
                      <button onClick={addBenefit} className="text-gold"><Plus size={16} /></button>
                    </div>
                    <div className="space-y-4">
                      {editedContent.ritualsBenefits?.map((benefit, i) => (
                        <div key={i} className="bg-paper/[0.03] border border-paper/10 rounded-2xl p-6 space-y-4 relative group">
                           <button onClick={() => removeBenefit(i)} className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><X size={14}/></button>
                           <div className="grid grid-cols-2 gap-4">
                             <input 
                               value={benefit.title}
                               onChange={(e) => updateBenefit(i, 'title', e.target.value)}
                               placeholder="Título"
                               className="bg-transparent border-b border-paper/10 text-xs font-bold uppercase tracking-widest outline-none text-gold"
                             />
                             <select
                               value={benefit.icon}
                               onChange={(e) => updateBenefit(i, 'icon', e.target.value)}
                               className="bg-transparent border-b border-paper/10 text-[10px] uppercase outline-none"
                             >
                               <option value="Brain">Cerebro / Mente</option>
                               <option value="Zap"> Energía / Foco</option>
                               <option value="Heart">Corazón / Emoción</option>
                               <option value="Sparkles">Magia / Creatividad</option>
                               <option value="Music">Música</option>
                             </select>
                           </div>
                           <textarea 
                              value={benefit.desc}
                              onChange={(e) => updateBenefit(i, 'desc', e.target.value)}
                              rows={2}
                              className="w-full bg-transparent text-[11px] font-light opacity-60 outline-none"
                              placeholder="Breve descripción..."
                           />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <section className="space-y-12 pt-12 border-t border-paper/5">
              <h2 className="text-3xl font-display italic mb-10">Sección de Filosofía</h2>
              <div className="grid lg:grid-cols-2 gap-12">
                 <div>
                    <label className="text-[9px] uppercase tracking-[0.3em] font-bold opacity-40 block mb-3">Imagen de Sección</label>
                    <div className="group relative aspect-[16/9] rounded-3xl overflow-hidden bg-ink border border-paper/10">
                        <img src={editedContent.philosophyImage || ''} alt="" className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-ink/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                           <label className="p-4 bg-paper/20 rounded-full hover:bg-gold hover:text-ink cursor-pointer transition-all">
                             <Upload size={20} />
                             <input 
                               type="file" 
                               className="hidden" 
                               accept="image/*"
                               onChange={(e) => handleImageUploadWithFeedback(e, 'philosophyImage', true)}
                             />
                           </label>
                        </div>
                    </div>
                    <input 
                      value={editedContent.philosophyImage || ''}
                      onChange={(e) => setEditedContent({...editedContent, philosophyImage: e.target.value})}
                      className="w-full mt-4 bg-paper/[0.03] border border-paper/10 rounded-xl px-4 py-3 text-[10px] font-mono outline-none"
                      placeholder="URL de Imagen..."
                    />
                 </div>
                 <div className="space-y-6">
                    <div>
                      <label className="text-[9px] uppercase tracking-[0.3em] font-bold opacity-40 block mb-3">Tesis Central</label>
                      <input 
                        value={editedContent.philosophyTitle}
                        onChange={(e) => setEditedContent({...editedContent, philosophyTitle: e.target.value})}
                        className="w-full bg-paper/[0.03] border border-paper/10 rounded-2xl p-6 text-2xl font-display italic outline-none focus:border-gold transition-all text-paper"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label className="text-[9px] uppercase tracking-[0.3em] font-bold opacity-40 block mb-3">Bloque de Narrativa</label>
                        <textarea 
                          value={editedContent.philosophyText1}
                          onChange={(e) => setEditedContent({...editedContent, philosophyText1: e.target.value})}
                          rows={4}
                          className="w-full bg-paper/[0.03] border border-paper/10 rounded-2xl p-6 text-sm font-light leading-relaxed outline-none focus:border-gold transition-all text-paper"
                          placeholder="Bloque 1 de texto..."
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-[0.3em] font-bold opacity-40 block mb-3">Misión Detallada (Bloque 2)</label>
                        <textarea 
                          value={editedContent.philosophyText2}
                          onChange={(e) => setEditedContent({...editedContent, philosophyText2: e.target.value})}
                          rows={4}
                          className="w-full bg-paper/[0.03] border border-paper/10 rounded-2xl p-6 text-sm font-light leading-relaxed outline-none focus:border-gold transition-all text-paper"
                          placeholder="Bloque 2 de texto..."
                        />
                      </div>
                    </div>
                 </div>
              </div>
            </section>
          </div>
           </div>
          </div>
        ) : activeTab === 'settings' ? (
          <div className="max-w-2xl mx-auto py-12">
            <div className="bg-paper/[0.03] border border-paper/10 rounded-[3rem] p-12 backdrop-blur-xl">
              <h2 className="text-4xl font-display italic text-gold mb-8 text-center">Seguridad del Ritual</h2>
              <p className="text-sm font-light text-paper/40 mb-10 text-center leading-relaxed">
                Protege tu portal creativo actualizando la llave de acceso. 
                Se recomienda una contraseña robusta para evitar intrusiones en tu universo artístico.
              </p>
              
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-30 block mb-4">Nueva Contraseña</label>
                  <div className="relative">
                     <input 
                      type="password"
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      placeholder="Mínimo 8 caracteres..."
                      className="w-full bg-ink/50 border border-paper/10 rounded-2xl p-6 text-sm outline-none focus:border-gold transition-all"
                    />
                    <AnimatePresence>
                      {passStatus === 'success' && (
                        <motion.div 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 text-green-400 text-[10px] uppercase font-bold tracking-widest"
                        >
                          <Check size={14} /> Actualizada
                        </motion.div>
                      )}
                      {passStatus === 'error' && (
                        <motion.div 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          className="absolute right-6 top-1/2 -translate-y-1/2 text-red-400 text-[10px] uppercase font-bold tracking-widest"
                        >
                          Demasiado Corta
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                
                <button 
                  onClick={handleUpdatePassword}
                  className="w-full bg-gold text-ink py-6 rounded-full text-[11px] uppercase tracking-[0.4em] font-black hover:bg-paper transition-all flex items-center justify-center gap-4 mt-8"
                >
                  <RotateCcw size={18} /> Actualizar Llave
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-20">
            <div>
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-display italic">Redes Sociales</h2>
                <button 
                  onClick={addSocialLink}
                  className="bg-paper/10 text-paper p-3 rounded-full hover:bg-gold hover:text-ink transition-all"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="space-y-4">
                {(editedContent.socialLinks || []).map((link, i) => (
                  <div key={i} className="flex gap-4 items-center bg-paper/[0.03] p-4 rounded-2xl border border-paper/10 group">
                    <input 
                      value={link.platform}
                      onChange={(e) => updateSocialLink(i, 'platform', e.target.value)}
                      placeholder="Plataforma"
                      className="bg-ink border border-paper/10 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:border-gold w-32"
                    />
                    <input 
                      value={link.url}
                      onChange={(e) => updateSocialLink(i, 'url', e.target.value)}
                      placeholder="URL (https://...)"
                      className="bg-ink border border-paper/10 rounded-xl px-4 py-2 text-xs flex-grow outline-none focus:border-gold"
                    />
                    <button onClick={() => removeSocialLink(i)} className="opacity-0 group-hover:opacity-100 text-red-400 p-2">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-display italic">Accesos y Recursos</h2>
                <button 
                  onClick={addCustomButton}
                  className="bg-paper/10 text-paper p-3 rounded-full hover:bg-gold hover:text-ink transition-all"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="space-y-4">
                {(editedContent.customButtons || []).map((btn, i) => (
                  <div key={i} className="flex gap-4 items-center bg-paper/[0.03] p-4 rounded-2xl border border-paper/10 group">
                    <input 
                      value={btn.label}
                      onChange={(e) => updateCustomButton(i, 'label', e.target.value)}
                      placeholder="Etiqueta"
                      className="bg-ink border border-paper/10 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:border-gold w-32"
                    />
                    <input 
                      value={btn.url}
                      onChange={(e) => updateCustomButton(i, 'url', e.target.value)}
                      placeholder="URL (https://...)"
                      className="bg-ink border border-paper/10 rounded-xl px-4 py-2 text-xs flex-grow outline-none focus:border-gold"
                    />
                    <button onClick={() => removeCustomButton(i)} className="opacity-0 group-hover:opacity-100 text-red-400 p-2">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="pt-12">
                <div className="p-8 border border-paper/10 rounded-[2rem] bg-paper/[0.02] flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                    <Check size={20} />
                  </div>
                  <p className="text-[10px] uppercase tracking-widest text-paper/40">
                    Auto-guardado activo. Los vínculos se consolidan automáticamente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Modals & Feedback */}
      <AnimatePresence>
        {uploadError && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] bg-red-500 text-white px-8 py-4 rounded-full flex items-center gap-4 shadow-2xl"
          >
            <AlertCircle size={20} />
            <span className="text-[10px] uppercase tracking-widest font-black">{uploadError}</span>
            <button onClick={() => setUploadError(null)} className="ml-4 hover:opacity-50">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {Object.entries(uploadProgress).map(([id, progress]) => (
          <motion.div 
            key={id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-12 right-12 z-[100] bg-gold text-ink p-8 rounded-3xl shadow-2xl flex items-center gap-6 min-w-[300px]"
          >
            <div className="relative w-12 h-12">
               <svg className="w-full h-full -rotate-90">
                 <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="4" className="opacity-20" />
                 <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray={125.6} strokeDashoffset={125.6 - (125.6 * (progress as number)) / 100} className="transition-all duration-300" />
               </svg>
               <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black">{progress}%</span>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] font-black leading-tight">Elevando Archivo</p>
              <p className="text-[9px] opacity-60">Procesando rastro en el éter...</p>
            </div>
            <Loader2 className="animate-spin ml-auto" size={16} />
          </motion.div>
        ))}
      </AnimatePresence>
      <AnimatePresence>
        {productToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-ink/90 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-paper text-ink p-12 rounded-[3.5rem] max-w-lg w-full text-center shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-2 bg-red-500"></div>
              <Trash2 className="mx-auto text-red-500 mb-8" size={48} strokeWidth={1} />
              <h3 className="text-4xl font-display italic tracking-tight mb-4">¿Eliminar Obra?</h3>
              <p className="text-sm font-light leading-relaxed mb-10 opacity-70">
                Esta acción es irreversible y borrará permanentemente la obra de tu inventario. 
                ¿Seguro que deseas continuar con la disolución?
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setProductToDelete(null)}
                  className="flex-grow py-5 border border-ink/10 rounded-full text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-ink/5 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-grow py-5 bg-red-500 text-white rounded-full text-[11px] uppercase tracking-[0.3em] font-black hover:bg-red-600 shadow-xl transition-all"
                >
                  Confirmar Eliminación
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="mt-16 p-10 bg-gold/5 rounded-[2.5rem] border border-gold/10 flex items-start gap-6 backdrop-blur-sm">
        <FileText className="text-gold mt-1" size={28} strokeWidth={1.5} />
        <div>
          <h4 className="font-display text-2xl italic mb-3 text-gold">Control Total Hechicero</h4>
          <p className="text-[15px] text-paper/60 leading-relaxed font-light max-w-2xl">
            Desde aquí controlas la narrativa completa de Barbara Higuera. Los cambios químicos que realices aquí 
            se reflejarán instantáneamente en la experiencia sensorial de tus visitantes. Las imágenes externas (URLs) 
            deben ser accesibles públicamente para que el ritual visual se complete.
          </p>
        </div>
      </div>
    </div>
  );
}
