"use client";

import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { observeAuthState } from "./utils/firebase";
import Header from "./components/Header";
import AuthForm from "./components/AuthForm";
import DownloadForm from "./components/DownloadForm";
import DownloadHistory from "./components/DownloadHistory";
import { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const unsubscribe = observeAuthState((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDownloadComplete = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleAuthSuccess = () => {
    // El estado del usuario se actualizará automáticamente por observeAuthState
  };

  if (loading) {
    return (
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center"
      >
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <div className="inline-block w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Cargando...</p>
        </motion.div>
      </motion.main>
    );
  }

  if (!user) {
    return (
      <>
        <Toaster position="top-right" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.4 }}
        >
          <AuthForm onAuthSuccess={handleAuthSuccess} />
        </motion.div>
      </>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <AnimatePresence mode="wait">
        <motion.main 
          key="authenticated-app"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="min-h-screen p-8"
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Header />
          </motion.div>
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="space-y-12"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <DownloadForm user={user} onDownloadComplete={handleDownloadComplete} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.4 }}
            >
              <DownloadHistory user={user} refreshTrigger={refreshTrigger} />
            </motion.div>
          </motion.section>
        </motion.main>
      </AnimatePresence>
    </>
  );
}