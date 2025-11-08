"use client";

import { createContext, useState, useContext, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const TransitionContext = createContext();

export const TransitionProvider = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  const startTransition = useCallback((url) => {
    setIsTransitioning(true);
    document.body.classList.add('page-transition-exit-active');
    setTimeout(() => {
      router.push(url);
    }, 500); // Duration should match the CSS transition duration
  }, [router]);

  const endTransition = useCallback(() => {
    setIsTransitioning(false);
    document.body.classList.remove('page-transition-exit-active');
    document.body.classList.add('page-transition-enter-active');
    setTimeout(() => {
      document.body.classList.remove('page-transition-enter-active');
    }, 500); // Duration should match the CSS transition duration
  }, []);

  return (
    <TransitionContext.Provider value={{ isTransitioning, startTransition, endTransition }}>
      {children}
    </TransitionContext.Provider>
  );
};

export const useTransition = () => useContext(TransitionContext);