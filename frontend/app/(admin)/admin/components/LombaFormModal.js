'use client';

import { useState, useEffect } from 'react';
import styles from './MemberFormModal.module.css'; // Reusing styles

export default function LombaFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    nama_lomba: '',
    penyelenggara: '',
    tanggal_deadline: '',
    biaya_daftar: '',
    // posterUrl will be handled via file input
  });
  const [poster, setPoster] = useState(null);
  const [error, setError] = useState('');

  const isEditMode = Boolean(initialData);

  useEffect(() => {
    if (isOpen) {
      setError('');
      setPoster(null);
      if (isEditMode && initialData) {
        setFormData({
          nama_lomba: initialData.nama_lomba || '',
          penyelenggara: initialData.penyelenggara || '',
          tanggal_deadline: initialData.tanggal_deadline ? new Date(initialData.tanggal_deadline).toISOString().split('T')[0] : '',
          biaya_daftar: initialData.biaya_daftar || '0',
        });
      } else {
        setFormData({
          nama_lomba: '',
          penyelenggara: '',
          tanggal_deadline: '',
          biaya_daftar: '0',
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
    setPoster(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.nama_lomba || !formData.penyelenggara || !formData.tanggal_deadline) {
        setError('Nama Lomba, Penyelenggara, and Tanggal Deadline are required.');
        return;
    }

    const submissionData = new FormData();
    submissionData.append('nama_lomba', formData.nama_lomba);
    submissionData.append('penyelenggara', formData.penyelenggara);
    submissionData.append('tanggal_deadline', formData.tanggal_deadline);
    submissionData.append('biaya_daftar', formData.biaya_daftar);
    
    if (poster) {
      submissionData.append('poster', poster);
    }

    onSubmit(submissionData);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{isEditMode ? 'Edit Lomba' : 'Create New Lomba'}</h2>
          <button onClick={onClose} className={styles.closeButton}>&times;</button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.inputGroup}>
            <label htmlFor="nama_lomba">Nama Lomba</label>
            <input
              type="text"
              id="nama_lomba"
              name="nama_lomba"
              value={formData.nama_lomba}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="penyelenggara">Penyelenggara</label>
            <input
              type="text"
              id="penyelenggara"
              name="penyelenggara"
              value={formData.penyelenggara}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="tanggal_deadline">Tanggal Deadline</label>
            <input
              type="date"
              id="tanggal_deadline"
              name="tanggal_deadline"
              value={formData.tanggal_deadline}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="biaya_daftar">Biaya Daftar (Rp)</label>
            <input
              type="number"
              id="biaya_daftar"
              name="biaya_daftar"
              value={formData.biaya_daftar}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="poster">Poster</label>
            <input
              type="file"
              id="poster"
              name="poster"
              onChange={handleFileChange}
              className={styles.input}
            />
             {isEditMode && <small>Leave blank to keep the current poster.</small>}
          </div>
          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={`${styles.button} ${styles.cancelButton}`}>
              Cancel
            </button>
            <button type="submit" className={`${styles.button} ${styles.submitButton}`}>
              {isEditMode ? 'Update Lomba' : 'Create Lomba'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
