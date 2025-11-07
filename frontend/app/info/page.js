'use client';

import styles from '../page.module.css';

export default function InfoPage() {
  return (
    <main className={styles.main}>
      <div className="container py-5 mt-5">
        <h1 className="text-center text-white">Info</h1>
        <p className="text-center text-white">This is the Info page.</p>
      </div>
    </main>
  );
}