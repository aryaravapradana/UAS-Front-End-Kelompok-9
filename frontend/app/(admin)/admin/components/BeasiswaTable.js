'use client';

import React from 'react';
import styles from './MembersTable.module.css'; // Reusing styles for consistency

const BeasiswaTable = ({ beasiswas, onEdit, onDelete }) => {
  if (!beasiswas || beasiswas.length === 0) {
    return <p>No scholarships found.</p>;
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
            <th>Nama Beasiswa</th>
            <th>Penyelenggara</th>
            <th>Deadline</th>
            <th>Link</th>
            <th>Poster</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {beasiswas.map((beasiswa) => (
            <tr key={beasiswa.id}>
              <td>{beasiswa.nama_beasiswa}</td>
              <td>{beasiswa.penyelenggara}</td>
              <td>{formatDate(beasiswa.tanggal_deadline)}</td>
              <td>
                <a href={beasiswa.link} target="_blank" rel="noopener noreferrer">
                  Link
                </a>
              </td>
              <td>
                {beasiswa.posterUrl ? (
                  <a href={beasiswa.posterUrl} target="_blank" rel="noopener noreferrer">
                    View
                  </a>
                ) : (
                  'N/A'
                )}
              </td>
              <td className={styles.actions}>
                <button onClick={() => onEdit(beasiswa)} className={`${styles.button} ${styles.editButton}`}>
                  Edit
                </button>
                <button onClick={() => onDelete(beasiswa.id)} className={`${styles.button} ${styles.deleteButton}`}>
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

export default BeasiswaTable;
