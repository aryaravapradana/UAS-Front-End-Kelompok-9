'use client';

import React from 'react';
import styles from './MembersTable.module.css';

const MembersTable = ({ members, onView, onEdit, onDelete }) => {
  if (!members || members.length === 0) {
    return <p>No members found.</p>;
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>NIM</th>
            <th>Nama Lengkap</th>
            <th>Prodi</th>
            <th>Angkatan</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              <td>{member.nim}</td>
              <td>{member.nama_lengkap}</td>
              <td>{member.prodi}</td>
              <td>{member.angkatan}</td>
              <td>{member.email || 'N/A'}</td>
              <td>{member.role}</td>
              <td className={styles.actions}>
                <button onClick={() => onView(member.nim)} className={`${styles.button} ${styles.viewButton}`}>
                  View
                </button>
                <button onClick={() => onEdit(member)} className={`${styles.button} ${styles.editButton}`}>
                  Edit
                </button>
                <button onClick={() => onDelete(member.nim)} className={`${styles.button} ${styles.deleteButton}`}>
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

export default MembersTable;
