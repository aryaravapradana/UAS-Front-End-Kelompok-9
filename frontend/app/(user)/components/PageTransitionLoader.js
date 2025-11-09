'use client';

import { useEffect } from 'react';
import { useTransition } from '../context/TransitionContext';

export default function PageTransitionLoader() {
  const { endTransition } = useTransition();

  useEffect(() => {
    endTransition();
  }, [endTransition]);

  return null; // This component renders nothing
}
