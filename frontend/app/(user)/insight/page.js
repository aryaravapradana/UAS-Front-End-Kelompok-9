'use client';

import styles from '../page.module.css';
import Header from '../components/Header';
import PageTransitionLoader from '../components/PageTransitionLoader';
import FadeInOnScroll from '../components/FadeInOnScroll';

export default function InsightPage() {
  return (
    <main className={styles.main}>
      <PageTransitionLoader />
      <Header />
      <FadeInOnScroll>
        <div className="container py-5 mt-5">
          <h1 className="text-center text-white">Insight</h1>
          <p className="text-center text-white">This is the Insight page.</p>
        </div>
      </FadeInOnScroll>
    </main>
  );
}