'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch('http://localhost:3001/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem('token');
            router.push('/login');
          }
          throw new Error(`Error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        setUser(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!profilePicture) {
      setUploadMessage('Please select a file first.');
      return;
    }

    setUploading(true);
    setUploadMessage('');
    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('profilePicture', profilePicture);

    try {
      const res = await fetch('http://localhost:3001/api/profile/picture', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      setUploadMessage(data.message || 'Profile picture uploaded successfully!');
      setUser(prevUser => ({ ...prevUser, profilePictureUrl: data.profilePictureUrl }));
      setProfilePicture(null); // Clear selected file
    } catch (err) {
      setUploadMessage(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className={styles.container}>Loading profile...</div>;
  }

  if (error) {
    return <div className={styles.container}>Error: {error}</div>;
  }

  if (!user) {
    return <div className={styles.container}>No user data found.</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>User Dashboard</h1>
      <div className={styles.profileCard}>
        <div className={styles.profilePictureContainer}>
          <img
            src={user.profilePictureUrl || '/default-profile.png'} // Use a default image if none
            alt="Profile"
            className={styles.profilePicture}
          />
        </div>
        <div className={styles.profileInfo}>
          <p><strong>NIM:</strong> {user.nim}</p>
          <p><strong>Nama Lengkap:</strong> {user.nama_lengkap}</p>
          <p><strong>Prodi:</strong> {user.prodi}</p>
          <p><strong>Angkatan:</strong> {user.angkatan}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      </div>

      <div className={styles.uploadSection}>
        <h2>Change Profile Picture</h2>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload Profile Picture'}
        </button>
        {uploadMessage && <p className={styles.uploadMessage}>{uploadMessage}</p>}
      </div>
    </div>
  );
}
