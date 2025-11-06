
"use client";

import { useTransition } from '../context/TransitionContext';
import styles from './PageTransition.module.css';

const PageTransition = () => {
  const { isTransitioning } = useTransition();

  return (
    <>
      <div className={`${styles.curtain} ${styles.left} ${isTransitioning ? styles.closed : ''}`} />
      <div className={`${styles.curtain} ${styles.right} ${isTransitioning ? styles.closed : ''}`} />
    </>
  );
};

export default PageTransition;
