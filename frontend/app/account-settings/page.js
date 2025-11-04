'use client';

import { useState, useEffect } from 'react';
import styles from './AccountSettings.module.css';

export default function AccountSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [userAvatar, setUserAvatar] = useState(null); // To display current avatar

  // Fetch current user avatar on component mount
  useEffect(() => {
    const fetchUserAvatar = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await fetch('http://localhost:3001/api/profile', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (res.ok) {
            const userData = await res.json();
            if (userData.avatar) {
              setUserAvatar(`http://localhost:3001${userData.avatar}`);
            }
          }
        } catch (error) {
          console.error('Failed to fetch user avatar:', error);
        }
      }
    };
    fetchUserAvatar();
  }, []);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('Password baru dan konfirmasi tidak cocok.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password baru minimal harus 6 karakter.');
      return;
    }

    setIsPasswordLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setPasswordError('Anda tidak terautentikasi. Silakan login kembali.');
      setIsPasswordLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Gagal mengubah password');
      }

      setPasswordSuccess('Password berhasil diubah!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setUploadError('');
      setUploadSuccess('');
    } else {
      setSelectedFile(null);
      setAvatarPreview(null);
    }
  };

  const handleAvatarUpload = async () => {
    if (!selectedFile) {
      setUploadError('Pilih file gambar terlebih dahulu.');
      return;
    }

    setIsUploading(true);
    setUploadError('');
    setUploadSuccess('');

    const token = localStorage.getItem('token');
    if (!token) {
      setUploadError('Anda tidak terautentikasi. Silakan login kembali.');
      setIsUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append('avatar', selectedFile);

    try {
      const res = await fetch('http://localhost:3001/api/profile/avatar', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Gagal mengunggah foto profil');
      }

      setUploadSuccess('Foto profil berhasil diunggah!');
      setUserAvatar(`http://localhost:3001${data.avatar}`); // Update current avatar
      setSelectedFile(null);
      setAvatarPreview(null);

    } catch (err) {
      setUploadError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Pengaturan Akun</h1>
      
      <div className={styles.card}>
        <h2 className={styles.subtitle}>Ubah Password</h2>
        <form onSubmit={handlePasswordSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="currentPassword">Password Saat Ini</label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="newPassword">Password Baru</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Konfirmasi Password Baru</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {passwordError && <p className={styles.errorMessage}>{passwordError}</p>}
          {passwordSuccess && <p className={styles.successMessage}>{passwordSuccess}</p>}

          <button type="submit" className={styles.submitButton} disabled={isPasswordLoading}>
            {isPasswordLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
      </div>

      <div className={styles.card}>
        <h2 className={styles.subtitle}>Ubah Foto Profil</h2>
        <div className={styles.avatarUploadSection}>
          <div className={styles.avatarPreviewContainer}>
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar Preview" className={styles.avatarImage} />
            ) : userAvatar ? (
              <img src={userAvatar} alt="Current Avatar" className={styles.avatarImage} />
            ) : (
              <div className={styles.avatarPlaceholder}>Tidak ada foto</div>
            )}
          </div>
          <input
            type="file"
            id="avatarInput"
            accept="image/jpeg,image/png,image/gif"
            onChange={handleFileChange}
            className={styles.fileInput}
          />
          <label htmlFor="avatarInput" className={styles.fileInputLabel}>
            {selectedFile ? selectedFile.name : 'Pilih Foto'}
          </label>
          {uploadError && <p className={styles.errorMessage}>{uploadError}</p>}
          {uploadSuccess && <p className={styles.successMessage}>{uploadSuccess}</p>}
          <button onClick={handleAvatarUpload} className={styles.submitButton} disabled={isUploading || !selectedFile}>
            {isUploading ? 'Mengunggah...' : 'Unggah Foto Profil'}
          </button>
        </div>
      </div>
    </div>
  );
}
