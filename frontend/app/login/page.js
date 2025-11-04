'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from './login.module.css';

export default function LoginPage() {
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const status = searchParams.get('status');
    if (status === 'registered') {
      setSuccessMessage('Registration successful! Please log in.');
      setIsMessageVisible(true);

      const fadeOutTimer = setTimeout(() => {
        setIsMessageVisible(false);
      }, 1300); // Start fading out after 1.3 seconds

      return () => {
        clearTimeout(fadeOutTimer);
      };
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!nim || !password) {
      setError('NIM and password are required');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nim, password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token);
        router.push('/?status=loggedin');
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'Login failed');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <img src="/uccd-logo@2x.png" alt="UCCD" className={styles.logoIconImg} />
        <span>UCCD</span>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formHeader}>
          <div className={styles.formIcon}>
            <img src="/uccd-logo@2x.png" alt="Code" className={styles.formIconImage} />
          </div>
          <h1 className={styles.title}>Sign In</h1>
          <p className={styles.subtitle}>Please enter your details to sign in</p>
        </div>

        {error && <p className={styles.error}>{error}</p>}
        {successMessage && (
          <p className={`${styles.success} ${isMessageVisible ? styles.visible : ''}`}>
            {successMessage}
          </p>
        )}

        <div className={styles.inputGroup}>
          <div className={styles.inputWrapper}>
            <i className="fas fa-id-card"></i>
            <input
              type="text"
              id="nim"
              value={nim}
              onChange={(e) => setNim(e.target.value)}
              placeholder="Enter your Student ID (NIM)"
              required
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
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

        <button type="submit" className={styles.button}>
          Sign in
        </button>

        <div className={styles.signupLink}>
          Dont have an account? <Link href="/register">Sign up</Link>
        </div>
      </form>
    </div>
  );
}