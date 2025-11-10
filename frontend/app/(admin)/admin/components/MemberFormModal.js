'use client';

import { useState, useEffect } from 'react';
import styles from './MemberFormModal.module.css';

export default function MemberFormModal({ isOpen, onClose, onSubmit, onDeleteEmail, initialData }) {
  const [formData, setFormData] = useState({
    nim: '',
    nama_lengkap: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState('');

  const isEditMode = Boolean(initialData);

  useEffect(() => {
    if (isOpen) {
      setError(''); // Reset error on open
      setProfilePicture(null); // Reset file input
      if (isEditMode) {
        setFormData({
          nim: initialData.nim || '',
          nama_lengkap: initialData.nama_lengkap || '',
          email: initialData.email || '',
          password: '', // Password should not be pre-filled for security
          role: initialData.role || 'user',
        });
      } else {
        // Reset form for create mode
        setFormData({
          nim: '',
          nama_lengkap: '',
          email: '',
          password: '',
          role: 'user',
        });
      }
    }
  }, [isOpen, initialData, isEditMode]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleDeleteEmail = () => {
    // Immediately update the UI
    setFormData((prev) => ({ ...prev, email: '' }));
    
    // Call the passed-in onDeleteEmail function
    if (onDeleteEmail) {
      onDeleteEmail(initialData.nim);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!isEditMode && !formData.password) {
        setError('Password is required for new members.');
        return;
    }
    if (!formData.nim || !formData.nama_lengkap) {
        setError('NIM and Nama Lengkap are required.');
        return;
    }

    const submissionData = new FormData();
    submissionData.append('nim', formData.nim);
    submissionData.append('nama_lengkap', formData.nama_lengkap);
    submissionData.append('email', formData.email);
    submissionData.append('role', formData.role);
    
    if (formData.password) {
      submissionData.append('password', formData.password);
    }
    if (profilePicture) {
      submissionData.append('profilePicture', profilePicture);
    }

    onSubmit(submissionData);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{isEditMode ? 'Edit Member' : 'Create New Member'}</h2>
          <button onClick={onClose} className={styles.closeButton}>&times;</button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.inputGroup}>
            <label htmlFor="nim">NIM</label>
            <input
              type="text"
              id="nim"
              name="nim"
              value={formData.nim}
              onChange={handleChange}
              required
              disabled={isEditMode} // Disable NIM editing
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="nama_lengkap">Nama Lengkap</label>
            <input
              type="text"
              id="nama_lengkap"
              name="nama_lengkap"
              value={formData.nama_lengkap}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <div className={styles.emailContainer}>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
              />
              {isEditMode && (
                <button
                  type="button"
                  onClick={handleDeleteEmail}
                  className={`${styles.button} ${styles.deleteEmailButton}`}
                >
                  Delete Email
                </button>
              )}
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={isEditMode ? 'Leave blank to keep current password' : 'Enter new password'}
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={styles.input}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="profilePicture">Profile Picture</label>
            <input
              type="file"
              id="profilePicture"
              name="profilePicture"
              onChange={handleFileChange}
              className={styles.input}
            />
          </div>
          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={`${styles.button} ${styles.cancelButton}`}>
              Cancel
            </button>
            <button type="submit" className={`${styles.button} ${styles.submitButton}`}>
              {isEditMode ? 'Update Member' : 'Create Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
