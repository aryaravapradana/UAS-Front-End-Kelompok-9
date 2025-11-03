'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './login.module.css';

export default function LoginPage() {
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

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
        router.push('/');
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
        <img src="/uccd-logo.png" alt="UCCD" className={styles.logoIconImg} />
        <span>UCCD</span>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formHeader}>
          <div className={styles.formIcon}>
            <img src="/uccd-logo.png" alt="Code" className={styles.formIconImage} />
          </div>
          <h1 className={styles.title}>Sign In</h1>
          <p className={styles.subtitle}>Please enter your details to sign in</p>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.inputGroup}>
          <div className={styles.inputWrapper}>
            <i className="fas fa-envelope"></i>
            <input
              type="text"
              id="nim"
              value={nim}
              onChange={(e) => setNim(e.target.value)}
              placeholder="Enter your email address"
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