import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const InstallBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Show the banner
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    // Show the prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-4 right-4 md:left-auto md:right-8 md:w-96 z-[9999]"
        >
          <div className="bg-primary p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-background rounded-xl flex items-center justify-center text-2xl shadow-inner">
                ⚽
              </div>
              <div>
                <h4 className="text-background font-black text-sm leading-tight">Instala MundialPulse</h4>
                <p className="text-background/70 text-[10px] font-bold uppercase tracking-tighter">Acceso rápido y notificaciones</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowBanner(false)}
                className="p-2 text-background/50 hover:text-background transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
              <button 
                onClick={handleInstall}
                className="px-4 py-2 bg-background text-primary font-black text-xs rounded-lg shadow-lg hover:scale-105 transition-all active:scale-95"
              >
                INSTALAR
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
