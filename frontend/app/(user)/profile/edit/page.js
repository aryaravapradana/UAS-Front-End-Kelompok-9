'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './edit.module.css';
import Header from '../../components/Header';

export default function EditProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [namaLengkap, setNamaLengkap] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/profile', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setNamaLengkap(data.nama_lengkap);
        setEmail(data.email || '');
      } else {
        localStorage.removeItem('token');
        router.push('/login');
      }
    } catch (err) {
      setError('Failed to fetch profile data.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword && newPassword !== confirmNewPassword) {
      setError('New passwords do not match.');
      return;
    }

    const payload = {
      nama_lengkap: namaLengkap,
      email: email,
    };

    if (newPassword) {
      payload.currentPassword = currentPassword;
      payload.newPassword = newPassword;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json();

      if (res.ok) {
        setSuccess('Profile updated successfully! If you changed your email, a verification link has been sent.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        // Refetch user data to get the latest verification status
        fetchUserProfile();
      } else {
        setError(responseData.message || 'Failed to update profile.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    }
  };

  const handleResendVerification = async () => {
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const responseData = await res.json();
      if (res.ok) {
        setSuccess(responseData.message);
      } else {
        setError(responseData.message);
      }
    } catch (err) {
      setError('Failed to resend verification email.');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.formContainer}>
          <h1 className={styles.title}>Ubah Data Profil</h1>
          <p className={styles.subtitle}>Update your name, email, or change your password.</p>

          {error && <div className={styles.alertError}>{error}</div>}
          {success && <div className={styles.alertSuccess}>{success}</div>}

          <form onSubmit={handleSubmit}>
            <h2 className={styles.sectionTitle}>Informasi Akun</h2>
            <div className={styles.inputGroup}>
              <label htmlFor="namaLengkap">Nama Lengkap</label>
              <input
                type="text"
                id="namaLengkap"
                value={namaLengkap}
                onChange={(e) => setNamaLengkap(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email">Email</label>
              <div className={styles.emailGroup}>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  placeholder="user@example.com"
                />
                {user?.email && (
                  user.isEmailVerified 
                    ? <span className={`${styles.verificationStatus} ${styles.verified}`}>Verified</span>
                    : <span className={`${styles.verificationStatus} ${styles.unverified}`}>Not Verified</span>
                )}
              </div>
              {user?.email && !user.isEmailVerified && (
                <button type="button" onClick={handleResendVerification} className={styles.resendButton}>
                  Resend Verification Email
                </button>
              )}
            </div>

            <h2 className={styles.sectionTitle}>Ubah Password</h2>
            <p className={styles.sectionSubtitle}>Leave these fields blank to keep your current password.</p>

            <div className={styles.inputGroup}>
              <label htmlFor="currentPassword">Password Saat Ini</label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={styles.input}
                placeholder="Enter your current password"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="newPassword">Password Baru</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={styles.input}
                placeholder="Enter your new password"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="confirmNewPassword">Konfirmasi Password Baru</label>
              <input
                type="password"
                id="confirmNewPassword"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className={styles.input}
                placeholder="Confirm your new password"
              />
            </div>

            <button type="submit" className={styles.submitButton}>
              Update Profile
            </button>
          </form>
        </div>
      </main>
    </>
  );
}

