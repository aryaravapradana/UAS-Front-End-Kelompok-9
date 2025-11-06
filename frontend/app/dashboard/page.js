
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/Header'; 

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const fileInputRef = useRef(null);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const headers = { 'Authorization': `Bearer ${token}` };

    try {
      setLoading(true);
      const [profileRes, lombasRes, beasiswasRes, talksRes, bootcampsRes] = await Promise.all([
        fetch('http://localhost:3001/api/profile', { headers }),
        fetch('http://localhost:3001/api/profile/lombas', { headers }),
        fetch('http://localhost:3001/api/profile/beasiswas', { headers }),
        fetch('http://localhost:3001/api/profile/talks', { headers }),
        fetch('http://localhost:3001/api/profile/bootcamps', { headers })
      ]);

      if (profileRes.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }

      if (!profileRes.ok) throw new Error('Gagal mengambil data profil');
      
      const profileData = await profileRes.json();
      setUser(profileData);

      const eventPromises = [lombasRes, beasiswasRes, talksRes, bootcampsRes];
      const eventData = await Promise.all(eventPromises.map(res => res.ok ? res.json() : []));

      const [lombas, beasiswas, talks, bootcamps] = eventData;

      const combinedEvents = [
        ...(lombas || []).map(item => ({ ...(item.lomba || {}), type: 'Lomba', date: (item.lomba || {}).tanggal_deadline })),
        ...(beasiswas || []).map(item => ({ ...(item.beasiswa || {}), type: 'Beasiswa', date: (item.beasiswa || {}).tanggal_deadline })),
        ...(talks || []).map(item => ({ ...(item.talk || {}), type: 'Talk', date: (item.talk || {}).tanggal_pelaksanaan })),
        ...(bootcamps || []).map(item => ({ ...(item.bootcamp || {}), type: 'Bootcamp', date: (item.bootcamp || {}).tanggal_deadline }))
      ].filter(event => event.id);

      combinedEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
      setEvents(combinedEvents);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePicture', file);

    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:3001/api/profile/picture', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error('Gagal mengunggah gambar');

      // Refresh data to show the new picture
      fetchData();

    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  if (loading) {
    return (
        <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Loading Dashboard...</p>
        </div>
    );
  }

  if (error) {
    return <div className={styles.errorState}>Error: {error}</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.main}>
      <Header />
      <main className={styles.container}>
        <section className={styles.heroSection}>
            <div className={styles.profilePictureContainer} onClick={() => fileInputRef.current.click()}>
                <Image
                    src={user.profilePictureUrl || '/uccd-logo@2x.png'}
                    alt="Profile Picture"
                    width={120}
                    height={120}
                    className={styles.profilePicture}
                />
                <div className={styles.editIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </div>
            </div>
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                style={{ display: 'none' }} 
                accept="image/*"
            />
            <h1 className={styles.heroTitle}>Welcome, {user.nama_lengkap}</h1>
            <p className={styles.heroSubtitle}>Here is your personal dashboard.</p>
        </section>

        <div className={styles.contentGrid}>
            <section className={styles.contentCard}>
              <h2 className={styles.cardTitle}>My Profile</h2>
              <div className={styles.profileDetails}>
                <div className={styles.detailItem}><strong>Name:</strong> {user.nama_lengkap}</div>
                <div className={styles.detailItem}><strong>NIM:</strong> {user.nim}</div>
                <div className={styles.detailItem}><strong>Prodi:</strong> {user.prodi}</div>
                <div className={styles.detailItem}><strong>Angkatan:</strong> 20{user.angkatan}</div>
              </div>
            </section>

            <section className={`${styles.contentCard} ${styles.eventsCard}`}>
              <h2 className={styles.cardTitle}>My Events</h2>
              <div className={styles.eventList}>
                {events.length > 0 ? (
                  events.map(event => (
                    <div key={`${event.type}-${event.id}`} className={styles.eventItem}>
                      <div className={styles.eventDetails}>
                        <span className={`${styles.eventType} ${styles[event.type.toLowerCase()]}`}>{event.type}</span>
                        <h3 className={styles.eventTitle}>{event.nama_lomba || event.nama_beasiswa || event.nama_seminar || event.nama_bootcamp}</h3>
                      </div>
                      <div className={styles.eventDate}>{new Date(event.date).toLocaleDateString()}</div>
                    </div>
                  ))
                ) : (
                  <p className={styles.noEvents}>You have not registered for any events yet.</p>
                )}
              </div>
            </section>
        </div>

        <section className={styles.accountActions}>
            <button onClick={handleLogout} className={styles.logoutButton}>
                Logout
            </button>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
