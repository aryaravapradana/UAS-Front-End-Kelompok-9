'use client';

import React from 'react';
import styles from './MembersTable.module.css'; // Reusing styles for consistency

const TalkTable = ({ talks, onEdit, onDelete }) => {
  if (!talks || talks.length === 0) {
    return <p>No talks found.</p>;
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nama Seminar</th>
            <th>Penyelenggara</th>
            <th>Tanggal</th>
            <th>Biaya</th>
            <th>Poster</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {talks.map((talk) => (
            <tr key={talk.id}>
              <td>{talk.nama_seminar}</td>
              <td>{talk.penyelenggara}</td>
              <td>{formatDate(talk.tanggal_pelaksanaan)}</td>
              <td>{talk.biaya_daftar ? `Rp ${talk.biaya_daftar.toLocaleString()}` : 'Free'}</td>
              <td>
                {talk.posterUrl ? (
                  <a href={talk.posterUrl} target="_blank" rel="noopener noreferrer">
                    View
                  </a>
                ) : (
                  'N/A'
                )}
              </td>
              <td className={styles.actions}>
                <button onClick={() => onEdit(talk)} className={`${styles.button} ${styles.editButton}`}>
                  Edit
                </button>
                <button onClick={() => onDelete(talk.id)} className={`${styles.button} ${styles.deleteButton}`}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TalkTable;
