'use client';

import React from 'react';
import styles from './MembersTable.module.css'; // Reusing styles for consistency

const BootcampTable = ({ bootcamps, onEdit, onDelete }) => {
  if (!bootcamps || bootcamps.length === 0) {
    return <p>No bootcamps found.</p>;
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
            <th>Nama Bootcamp</th>
            <th>Penyelenggara</th>
            <th>Deadline</th>
            <th>Biaya</th>
            <th>Poster</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bootcamps.map((bootcamp) => (
            <tr key={bootcamp.id}>
              <td>{bootcamp.nama_bootcamp}</td>
              <td>{bootcamp.penyelenggara}</td>
              <td>{formatDate(bootcamp.tanggal_deadline)}</td>
              <td>{bootcamp.biaya_daftar ? `Rp ${bootcamp.biaya_daftar.toLocaleString()}` : 'Free'}</td>
              <td>
                {bootcamp.posterUrl ? (
                  <a href={bootcamp.posterUrl} target="_blank" rel="noopener noreferrer">
                    View
                  </a>
                ) : (
                  'N/A'
                )}
              </td>
              <td className={styles.actions}>
                <button onClick={() => onEdit(bootcamp)} className={`${styles.button} ${styles.editButton}`}>
                  Edit
                </button>
                <button onClick={() => onDelete(bootcamp.id)} className={`${styles.button} ${styles.deleteButton}`}>
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

export default BootcampTable;
