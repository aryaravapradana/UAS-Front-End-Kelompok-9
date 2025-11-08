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
            <th>Judul Talk</th>
            <th>Pembicara</th>
            <th>Tanggal</th>
            <th>Lokasi</th>
            <th>Poster</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {talks.map((talk) => (
            <tr key={talk.id}>
              <td>{talk.judul}</td>
              <td>{talk.pembicara}</td>
              <td>{formatDate(talk.tanggal)}</td>
              <td>{talk.lokasi}</td>
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
