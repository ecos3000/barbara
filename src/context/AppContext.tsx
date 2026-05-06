import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query,
  getDocFromServer
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  updatePassword
} from 'firebase/auth';
import { db, auth } from '../lib/firebase';

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
  category: 'music' | 'merch' | 'art' | 'ritual' | 'lyrics';
  stock: number;
  extra?: string;
  audioUrl?: string;
  options?: { name: string; values: string[] }[];
  variants?: Variant[];
}

export interface Benefit {
  icon: string;
  title: string;
  desc: string;
}

export interface SiteContent {
  siteName: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  philosophyTitle: string;
  philosophyText1: string;
  philosophyText2: string;
  philosophyImage: string;
  globalBgImage: string;
  globalBgOpacity: number;
  manifestoQuote: string;
  closingQuote: string;
  ritualsTitle: string;
  ritualsSubtitle: string;
  ritualsBenefits: Benefit[];
  socialLinks: { platform: string; url: string }[];
  customButtons: { label: string; url: string }[];
}

// Error handling helper
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
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
  }
];

const DEFAULT_CONTENT: SiteContent = {
  siteName: "Barbara Higuera",
  heroTitle: "Las canciones no se escriben, se sienten.",
  heroSubtitle: "Barbara Higuera no escribe canciones, invoca emociones y las convierte en escenas. Transformo ideas en experiencias para artistas que buscan una identidad única.",
  heroImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=2000",
  philosophyTitle: "Si no se siente, no sirve.",
  philosophyText1: "Ayudamos a artistas a encontrar una identidad emocional y estética única a través de la música.",
  philosophyText2: "Desarrollamos canciones con alma, concepto y estética, diseñadas para que el artista no solo suene, sino que se sienta y se recuerde.",
  philosophyImage: "https://images.unsplash.com/photo-1541339907198-e08759dfc3f3?auto=format&fit=crop&q=80&w=800",
  globalBgImage: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=2000",
  globalBgOpacity: 0.15,
  manifestoQuote: "La música es la arquitectura invisible de lo que sentimos.",
  closingQuote: "Para crear el futuro, primero debes dominar el silencio de tu mente.",
  ritualsTitle: "Rituales de Concentración",
  ritualsSubtitle: "Técnicas ancestrales y modernas diseñadas para alcanzar estados de flujo profundo, liberar el ruido mental y expandir la capacidad creativa. No es solo música, es la arquitectura de tu enfoque.",
  ritualsBenefits: [
    { icon: "Brain", title: "Claridad Mental", desc: "Protocolos para silenciar el estrés y priorizar la visión genuina." },
    { icon: "Zap", title: "Foco Creativo", desc: "Frecuencias y ejercicios para entrar en estado de flujo en segundos." },
    { icon: "Heart", title: "Liberación", desc: "Catarsis sonora diseñada para disolver bloqueos emocionales." }
  ],
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

interface AppContextType {
  products: Product[];
  cart: { product: Product; variantId?: string; selectedOptions?: Record<string, string>; quantity: number }[];
  addToCart: (product: Product, selectedOptions?: Record<string, string>, variant?: Variant) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  removeProduct: (productId: string) => Promise<void>;
  changePassword: (newPassword: string) => Promise<boolean>;
  total: number;
  isAdmin: boolean;
  user: FirebaseUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  siteContent: SiteContent;
  updateSiteContent: (content: Partial<SiteContent>) => Promise<void>;
  loading: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<{ product: Product; variantId?: string; selectedOptions?: Record<string, string>; quantity: number }[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as 'light' | 'dark') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // Listen for Auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Sync Products from Firestore
  useEffect(() => {
    const q = query(collection(db, 'rituals'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ritualsData = snapshot.docs.map(doc => doc.data() as Product);
      if (ritualsData.length === 0 && !loading) {
        // If DB is empty, maybe we should seed it? 
        // For now just keep it empty or use INITIAL_PRODUCTS if first time
      } else {
        setProducts(ritualsData);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'rituals');
    });

    return () => unsubscribe();
  }, [loading]);

  // Sync Site Content from Firestore
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'siteConfig'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as SiteContent;
        setSiteContent({
          ...DEFAULT_CONTENT,
          ...data,
          socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks : DEFAULT_CONTENT.socialLinks,
          customButtons: Array.isArray(data.customButtons) ? data.customButtons : DEFAULT_CONTENT.customButtons,
          ritualsBenefits: Array.isArray(data.ritualsBenefits) ? data.ritualsBenefits : DEFAULT_CONTENT.ritualsBenefits
        });
      } else {
        // Seed if doesn't exist
        initSiteContent();
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'settings/siteConfig');
    });

    return unsub;
  }, []);

  const initSiteContent = async () => {
    try {
      await setDoc(doc(db, 'settings', 'siteConfig'), DEFAULT_CONTENT);
    } catch (e) {
      console.error('Error initializing site content', e);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      console.error('Login error', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error', error);
    }
  };

  const changePassword = async (newPassword: string) => {
    if (auth.currentUser) {
      try {
        await updatePassword(auth.currentUser, newPassword);
        return true;
      } catch (error) {
        console.error('Error updating password:', error);
        return false;
      }
    }
    return false;
  };

  const updateSiteContent = async (content: Partial<SiteContent>) => {
    const path = 'settings/siteConfig';
    try {
      await updateDoc(doc(db, path), content);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const addProduct = async (product: Product) => {
    const path = `rituals/${product.id}`;
    try {
      await setDoc(doc(db, 'rituals', product.id), product);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const removeProduct = async (productId: string) => {
    const path = `rituals/${productId}`;
    try {
      await deleteDoc(doc(db, 'rituals', productId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const updateProduct = async (productId: string, updates: Partial<Product>) => {
    const path = `rituals/${productId}`;
    try {
      await updateDoc(doc(db, 'rituals', productId), updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const addToCart = (product: Product, selectedOptions?: Record<string, string>, variant?: Variant) => {
    setCart(prev => {
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

  const total = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <AppContext.Provider value={{ 
      products: (products.length === 0 && !loading) ? INITIAL_PRODUCTS : products, 
      cart, addToCart, removeFromCart, updateProduct, addProduct, removeProduct,
      changePassword, total, isAdmin: !!user, user, login, logout, siteContent, updateSiteContent, loading,
      theme, toggleTheme
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

