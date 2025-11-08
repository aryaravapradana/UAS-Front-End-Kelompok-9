'use client';

import React from 'react';
import styles from './MembersTable.module.css'; // Reusing styles for consistency

const LombaTable = ({ lombas, onEdit, onDelete }) => {
  if (!lombas || lombas.length === 0) {
    return <p>No competitions found.</p>;
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
            <th>Nama Lomba</th>
            <th>Penyelenggara</th>
            <th>Deadline</th>
            <th>Biaya</th>
            <th>Poster</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {lombas.map((lomba) => (
            <tr key={lomba.id}>
              <td>{lomba.nama_lomba}</td>
              <td>{lomba.penyelenggara}</td>
              <td>{formatDate(lomba.tanggal_deadline)}</td>
              <td>{lomba.biaya_daftar ? `Rp ${lomba.biaya_daftar.toLocaleString('id-ID')}` : 'Gratis'}</td>
              <td>
                {lomba.posterUrl ? (
                  <a href={lomba.posterUrl} target="_blank" rel="noopener noreferrer">
                    View
                  </a>
                ) : (
                  'N/A'
                )}
              </td>
              <td className={styles.actions}>
                <button onClick={() => onEdit(lomba)} className={`${styles.button} ${styles.editButton}`}>
                  Edit
                </button>
                <button onClick={() => onDelete(lomba.id)} className={`${styles.button} ${styles.deleteButton}`}>
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

export default LombaTable;
