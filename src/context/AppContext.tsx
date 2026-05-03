import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Variant {
  id: string;
  title: string;
  price: number;
  stock: number;
  combination: Record<string, string>;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'music' | 'merch' | 'art';
  stock: number;
  extra?: string; // Para demostraciones, enlaces de audio o fragmentos de letras
  audioUrl?: string; // Rastro sonoro (MP3)
  options?: { name: string; values: string[] }[];
  variants?: Variant[];
}

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'comp1',
    name: 'Composición de Identidad',
    description: 'Creación de letra y melodía base diseñada específicamente para tu registro vocal y esencia artística.',
    price: 450,
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=800',
    category: 'music',
    stock: 2
  },
  {
    id: 'arr1',
    name: 'Arreglo Musical Ritual',
    description: 'Producción y arreglos instrumentales que elevan tu canción a una experiencia cinematográfica y emocional.',
    price: 600,
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800',
    category: 'music',
    stock: 1
  },
  {
    id: 'lyr1',
    name: 'Ghostwriting Poético',
    description: 'Escritura de letras con profundidad literaria y ganchos comerciales, adaptadas a tu historia personal.',
    price: 250,
    image: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?auto=format&fit=crop&q=80&w=800',
    category: 'music',
    stock: 5
  },
  {
    id: 'merch1',
    name: 'Manuscrito Original',
    description: 'Letra de una de mis canciones escrita a mano en papel de algodón, numerada y firmada.',
    price: 85,
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=800',
    category: 'merch',
    stock: 10
  },
  {
    id: 'frec1',
    name: 'Frecuencia Delta',
    description: 'Sesión grabada de frecuencias binaurales y paisajes sonoros diseñados para inducir estados de sueño profundo.',
    price: 45,
    image: 'https://images.unsplash.com/photo-1514826786317-59744fe2a548?auto=format&fit=crop&q=80&w=800',
    category: 'music',
    stock: 100,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    id: 'amu1',
    name: 'Amuleto de Obsidiana',
    description: 'Piedra volcánica tallada a mano y cargada con frecuencias específicas de protección y claridad.',
    price: 120,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
    category: 'merch',
    stock: 15
  },
  {
    id: 'vis1',
    name: 'Visión Estelar',
    description: 'Obra de arte digital generativa influenciada por tu frecuencia vocal única. Una pieza irrepetible.',
    price: 320,
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800',
    category: 'art',
    stock: 3
  },
  {
    id: 'frec2',
    name: 'Sinfonía del Éter',
    description: 'Composición multicanal diseñada para la expansión de la conciencia. Incluye guía de escucha.',
    price: 55,
    image: 'https://images.unsplash.com/photo-1459749411177-042180ce673c?auto=format&fit=crop&q=80&w=800',
    category: 'music',
    stock: 50,
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    id: 'rit2',
    name: 'Diario de Sombras',
    description: 'Cuaderno de cuero cosido a mano con papel de algodón. Para el registro de lo inefable.',
    price: 85,
    image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&q=80&w=800',
    category: 'merch',
    stock: 20
  },
  {
    id: 'vis2',
    name: 'Espejo Ciego',
    description: 'Grabado sobre metal pulido que refleja solo la intención. Una herramienta de introspección radical.',
    price: 450,
    image: 'https://images.unsplash.com/photo-1515405299443-fbd3bb755f9a?auto=format&fit=crop&q=80&w=800',
    category: 'art',
    stock: 2
  }
];

interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  philosophyTitle: string;
  philosophyText1: string;
  philosophyText2: string;
  philosophyImage: string;
  socialLinks: { platform: string; url: string }[];
  customButtons: { label: string; url: string }[];
}

interface AppContextType {
  products: Product[];
  cart: { product: Product; variantId?: string; selectedOptions?: Record<string, string>; quantity: number }[];
  addToCart: (product: Product, selectedOptions?: Record<string, string>, variant?: Variant) => void;
  removeFromCart: (productId: string) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  changePassword: (newPassword: string) => void;
  total: number;
  // Admin & Content
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  siteContent: SiteContent;
  updateSiteContent: (content: Partial<SiteContent>) => void;
}

const DEFAULT_CONTENT: SiteContent = {
  heroTitle: "Las canciones no se escriben, se sienten.",
  heroSubtitle: "Barbara Higuera no escribe canciones, invoca emociones y las convierte en escenas. Transformo ideas en experiencias para artistas que buscan una identidad única.",
  heroImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=2000",
  philosophyTitle: "Si no se siente, no sirve.",
  philosophyText1: "Ayudamos a artistas a encontrar una identidad emocional y estética única a través de la música.",
  philosophyText2: "Desarrollamos canciones con alma, concepto y estética, diseñadas para que el artista no solo suene, sino que se sienta y se recuerde.",
  philosophyImage: "https://images.unsplash.com/photo-1541339907198-e08759dfc3f3?auto=format&fit=crop&q=80&w=800",
  socialLinks: [
    { platform: 'Instagram', url: '#' },
    { platform: 'Spotify', url: '#' },
    { platform: 'Contact', url: '#' }
  ],
  customButtons: [
    { label: 'Booking', url: '#' },
    { label: 'Press Kit', url: '#' }
  ]
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('bh_inventory');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [adminPassword, setAdminPassword] = useState(() => {
    return localStorage.getItem('bh_admin_password') || '';
  });

  const [siteContent, setSiteContent] = useState<SiteContent>(() => {
    const saved = localStorage.getItem('bh_site_content');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure arrays exist and are arrays
        return {
          ...DEFAULT_CONTENT,
          ...parsed,
          socialLinks: Array.isArray(parsed.socialLinks) ? parsed.socialLinks : DEFAULT_CONTENT.socialLinks,
          customButtons: Array.isArray(parsed.customButtons) ? parsed.customButtons : DEFAULT_CONTENT.customButtons
        };
      } catch (e) {
        console.error('Error parsing site content', e);
        return DEFAULT_CONTENT;
      }
    }
    return DEFAULT_CONTENT;
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem('bh_admin_session') === 'active';
  });

  const [cart, setCart] = useState<{ product: Product; variantId?: string; selectedOptions?: Record<string, string>; quantity: number }[]>([]);

  useEffect(() => {
    localStorage.setItem('bh_inventory', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('bh_site_content', JSON.stringify(siteContent));
  }, [siteContent]);

  const login = (password: string) => {
    // @ts-ignore - Vite env variables
    const defaultPass = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
    const currentPass = adminPassword || defaultPass;
    
    if (password === currentPass) {
      setIsAdmin(true);
      sessionStorage.setItem('bh_admin_session', 'active');
      return true;
    }
    return false;
  };

  const changePassword = (newPassword: string) => {
    setAdminPassword(newPassword);
    localStorage.setItem('bh_admin_password', newPassword);
  };

  const logout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('bh_admin_session');
  };

  const updateSiteContent = (content: Partial<SiteContent>) => {
    setSiteContent(prev => ({ ...prev, ...content }));
  };

  const addProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
  };

  const removeProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const addToCart = (product: Product, selectedOptions?: Record<string, string>, variant?: Variant) => {
    setCart(prev => {
      const cartKey = variant ? variant.id : product.id;
      const existing = prev.find(item => 
        (variant ? item.variantId === variant.id : item.product.id === product.id) &&
        JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
      );

      if (existing) {
        return prev.map(item => 
          ((variant ? item.variantId === variant.id : item.product.id === product.id) &&
           JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions))
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }

      // Final price for this cart entry
      const finalPrice = variant ? variant.price : product.price;
      const productWithCorrectPrice = { ...product, price: finalPrice };

      return [...prev, { 
        product: productWithCorrectPrice, 
        variantId: variant?.id, 
        selectedOptions, 
        quantity: 1 
      }];
    });
  };

  const removeFromCart = (productId: string, variantId?: string) => {
    setCart(prev => prev.filter(item => 
      !(item.product.id === productId && (!variantId || item.variantId === variantId))
    ));
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, ...updates } : p));
  };

  const total = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <AppContext.Provider value={{ 
      products, cart, addToCart, removeFromCart, updateProduct, addProduct, removeProduct,
      changePassword, total, isAdmin, login, logout, siteContent, updateSiteContent 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
