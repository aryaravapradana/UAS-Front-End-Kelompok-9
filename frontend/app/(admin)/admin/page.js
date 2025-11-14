'use client';

import { useEffect, useState } from 'react';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // A simple effect to get user data for the welcome message
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'admin') {
        // This check might be redundant due to layout checks, but good for safety
        router.push('/'); 
      }
      setUser(parsedUser);
    }
  }, []);

  return (
    <div>
      <header className={styles.header}>
        <h1>Dashboard</h1>
        {user && <p>Welcome back, {user.nama_lengkap}!</p>}
      </header>
      <main className={styles.main}>
        <h2>Overview</h2>
        <p>Select a category from the sidebar to manage website data.</p>
        {/* Future analytics and summary cards can be added here */}
      </main>
    </div>
  );
}
