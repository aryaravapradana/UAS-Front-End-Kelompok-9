'use client';

import { useState, useEffect } from 'react';
import styles from './MemberFormModal.module.css'; // Reusing styles

export default function TalkFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    nama_seminar: '',
    penyelenggara: '',
    tanggal_pelaksanaan: '',
    biaya_daftar: '0',
    feedback_member: '',
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
          nama_seminar: initialData.nama_seminar || '',
          penyelenggara: initialData.penyelenggara || '',
          tanggal_pelaksanaan: initialData.tanggal_pelaksanaan ? new Date(initialData.tanggal_pelaksanaan).toISOString().split('T')[0] : '',
          biaya_daftar: initialData.biaya_daftar || '0',
          feedback_member: initialData.feedback_member || '',
        });
      } else {
        setFormData({
          nama_seminar: '',
          penyelenggara: '',
          tanggal_pelaksanaan: '',
          biaya_daftar: '0',
          feedback_member: '',
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

    if (!formData.nama_seminar || !formData.penyelenggara || !formData.tanggal_pelaksanaan) {
        setError('Nama Seminar, Penyelenggara, and Tanggal Pelaksanaan are required.');
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
          <h2>{isEditMode ? 'Edit Talk' : 'Create New Talk'}</h2>
          <button onClick={onClose} className={styles.closeButton}>&times;</button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.inputGroup}>
            <label htmlFor="nama_seminar">Nama Seminar</label>
            <input
              type="text"
              id="nama_seminar"
              name="nama_seminar"
              value={formData.nama_seminar}
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
            <label htmlFor="tanggal_pelaksanaan">Tanggal Pelaksanaan</label>
            <input
              type="date"
              id="tanggal_pelaksanaan"
              name="tanggal_pelaksanaan"
              value={formData.tanggal_pelaksanaan}
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
            <label htmlFor="feedback_member">Feedback</label>
            <textarea
              id="feedback_member"
              name="feedback_member"
              value={formData.feedback_member}
              onChange={handleChange}
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
              {isEditMode ? 'Update Talk' : 'Create Talk'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
