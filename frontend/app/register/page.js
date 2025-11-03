
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './register.module.css';

const getProdi = (nim) => {
  const prodiCode = nim.substring(0, 3);
  const prodiMap = {
    '535': 'Teknik Informatika',
    '825': 'Sistem Informasi',
  };
  return prodiMap[prodiCode] || '';
};

const getAngkatan = (nim) => {
  if (nim.length >= 5) {
    return '20' + nim.substring(3, 5);
  }
  return '';
};

export default function RegisterPage() {
  const [namaLengkap, setNamaLengkap] = useState('');
  const [nim, setNim] = useState('');
  const [prodi, setProdi] = useState('');
  const [angkatan, setAngkatan] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    setProdi(getProdi(nim));
    setAngkatan(getAngkatan(nim));
  }, [nim]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nama_lengkap: namaLengkap, nim, password }),
      });

      if (res.ok) {
        router.push('/login');
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'Registration failed');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Registration error:', error);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Register</h1>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.inputGroup}>
          <label htmlFor="namaLengkap">Nama Lengkap</label>
          <input
            type="text"
            id="namaLengkap"
            value={namaLengkap}
            onChange={(e) => setNamaLengkap(e.target.value)}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="nim">NIM</label>
          <input
            type="text"
            id="nim"
            value={nim}
            onChange={(e) => setNim(e.target.value)}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="prodi">Program Studi</label>
          <input
            type="text"
            id="prodi"
            value={prodi}
            disabled
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="angkatan">Angkatan</label>
          <input
            type="text"
            id="angkatan"
            value={angkatan}
            disabled
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.button}>Register</button>
      </form>
    </div>
  );
}
