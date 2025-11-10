'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './register.module.css';
import FadeInOnScroll from '../components/FadeInOnScroll';

const getProdi = (nim) => {
  if (nim.length < 3) return '';
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
        router.push('/login?status=registered');
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
      <FadeInOnScroll>
        <div className={styles.logo}>
          <Image src="/uccd-logo@2x.png" alt="UCCD" width={40} height={40} className={styles.logoIconImg} />
          <span>UCCD</span>
        </div>
      </FadeInOnScroll>

      <FadeInOnScroll>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formHeader}>
            <div className={styles.formIcon}>
              <Image src="/uccd-logo@2x.png" alt="Code" width={40} height={40} className={styles.formIconImage} />
            </div>
            <h1 className={styles.title}>Create an account</h1>
            <p className={styles.subtitle}>Please enter your details to register</p>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.inputGroup}>
            <label htmlFor="namaLengkap">Name</label>
            <div className={styles.inputWrapper}>
              <i className="fas fa-user"></i>
              <input
                type="text"
                id="namaLengkap"
                value={namaLengkap}
                onChange={(e) => setNamaLengkap(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="nim">Student ID</label>
            <div className={styles.inputWrapper}>
              <i className="fas fa-id-card"></i>
              <input
                type="text"
                id="nim"
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                placeholder="Enter your student id"
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Prodi</label>
            <div className={styles.inputWrapper}>
              <input type="text" value={prodi} disabled />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Angkatan</label>
            <div className={styles.inputWrapper}>
              <input type="text" value={angkatan} disabled />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <div className={styles.inputWrapper}>
              <i className="fas fa-key"></i>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className={styles.inputWrapper}>
              <i className="fas fa-key"></i>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
              />
            </div>
          </div>

          <button type="submit" className={styles.button}>
            Get Started
          </button>

          <div className={styles.signinLink}>
            Already have an account? <Link href="/login">Sign in</Link>
          </div>
        </form>
      </FadeInOnScroll>
    </div>
  );
}
