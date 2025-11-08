'use client';

import { useState, useEffect } from 'react';
import styles from './MemberFormModal.module.css'; // Reusing styles

export default function BootcampFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    nama_bootcamp: '',
    penyelenggara: '',
    tanggal_deadline: '',
    biaya_daftar: '0',
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
          nama_bootcamp: initialData.nama_bootcamp || '',
          penyelenggara: initialData.penyelenggara || '',
          tanggal_deadline: initialData.tanggal_deadline ? new Date(initialData.tanggal_deadline).toISOString().split('T')[0] : '',
          biaya_daftar: initialData.biaya_daftar || '0',
        });
      } else {
        setFormData({
          nama_bootcamp: '',
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

    if (!formData.nama_bootcamp || !formData.penyelenggara || !formData.tanggal_deadline) {
        setError('Nama Bootcamp, Penyelenggara, and Tanggal Deadline are required.');
        return;
    }

    const submissionData = new FormData();
    Object.keys(formData).forEach(key => {
      submissionData.append(key, formData[key]);
    });
    
    if (poster) {
      submissionData.append('poster', poster);
    }

    onSubmit(submissionData);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{isEditMode ? 'Edit Bootcamp' : 'Create New Bootcamp'}</h2>
          <button onClick={onClose} className={styles.closeButton}>&times;</button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.inputGroup}>
            <label htmlFor="nama_bootcamp">Nama Bootcamp</label>
            <input
              type="text"
              id="nama_bootcamp"
              name="nama_bootcamp"
              value={formData.nama_bootcamp}
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
              {isEditMode ? 'Update Bootcamp' : 'Create Bootcamp'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
