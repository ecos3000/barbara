/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import ScrollToHashElement from './components/ScrollToHashElement';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Rituals from './pages/Rituals';
import Admin from './pages/Admin';
import Cart from './pages/Cart';
import Login from './pages/Login';
import { motion, AnimatePresence } from 'motion/react';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/tienda" element={<PageTransition><Shop /></PageTransition>} />
          <Route path="/rituales" element={<PageTransition><Rituals /></PageTransition>} />
          <Route path="/admin" element={<PageTransition><Admin /></PageTransition>} />
          <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -15, filter: 'blur(10px)' }}
      transition={{ 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1],
        opacity: { duration: 0.6 }
      }}
    >
      {children}
    </motion.div>
  );
}

function GlobalBackground() {
  const { siteContent } = useApp();
  
  return (
    <>
      <div 
        className="fixed inset-0 pointer-events-none z-0 grayscale"
        style={{
          backgroundImage: `url("${siteContent.globalBgImage}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mixBlendMode: 'luminosity',
          opacity: siteContent.globalBgOpacity
        }}
      />
      <div className="noise-filter" />
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-[#050505] text-brand-paper selection:bg-brand-gold/30 relative overflow-x-hidden transition-colors duration-1000">
          <GlobalBackground />
          
          {/* Structural Lines */}
          <div className="fixed inset-0 pointer-events-none z-0">
             <div className="absolute top-0 left-[10%] w-[1px] h-full bg-white/[0.02]" />
             <div className="absolute top-0 right-[10%] w-[1px] h-full bg-white/[0.02]" />
             <div className="absolute top-[20%] left-0 w-full h-[1px] bg-white/[0.02]" />
             <div className="absolute top-[80%] left-0 w-full h-[1px] bg-white/[0.02]" />
          </div>

          <div className="relative z-10 flex flex-col min-h-screen">
            <ScrollToHashElement />
            <BackToTop />
            <Navbar />
            <main className="flex-grow">
              <AnimatedRoutes />
            </main>
            <Footer />
          </div>
        </div>
      </Router>
    </AppProvider>
  );
}

