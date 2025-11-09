'use client';

import styles from '../page.module.css';
import Header from '../components/Header';
import PageTransitionLoader from '../components/PageTransitionLoader';

export default function InfoPage() {
  return (
    <main className={styles.main}>
      <PageTransitionLoader />
      <Header />
      <div className="container py-5 mt-5">
        <h1 className="text-center text-white">Info</h1>
        <p className="text-center text-white">This is the Info page.</p>
      </div>
    </main>
  );
}
