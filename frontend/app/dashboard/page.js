
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/Header'; // Assuming Header is desired on this page too

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const headers = { 'Authorization': `Bearer ${token}` };

      try {
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

    fetchData();
  }, [router]);

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
        {/* Hero Section */}
        <section className={styles.heroSection}>
            <Image
                src={user.profilePictureUrl || '/uccd-logo@2x.png'}
                alt="Profile Picture"
                width={120}
                height={120}
                className={styles.profilePicture}
            />
            <h1 className={styles.heroTitle}>Welcome, {user.nama_lengkap}</h1>
            <p className={styles.heroSubtitle}>Here is your personal dashboard.</p>
        </section>

        {/* Content Grid */}
        <div className={styles.contentGrid}>
            {/* Profile Card */}
            <section className={styles.contentCard}>
              <h2 className={styles.cardTitle}>My Profile</h2>
              <div className={styles.profileDetails}>
                <div className={styles.detailItem}><strong>Name:</strong> {user.nama_lengkap}</div>
                <div className={styles.detailItem}><strong>NIM:</strong> {user.nim}</div>
                <div className={styles.detailItem}><strong>Prodi:</strong> {user.prodi}</div>
                <div className={styles.detailItem}><strong>Angkatan:</strong> 20{user.angkatan}</div>
                <button className={styles.editButton}>Edit Profile</button>
              </div>
            </section>

            {/* Events Card */}
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
      </main>
    </div>
  );
};

export default DashboardPage;
