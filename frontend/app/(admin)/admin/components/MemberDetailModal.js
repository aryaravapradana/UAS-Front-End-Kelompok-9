'use client';

import { useEffect, useState } from 'react';
import styles from './MemberDetailModal.module.css';
import API from '@/lib/api';

const MemberDetailModal = ({ nim, onClose }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!nim) return;

    const fetchDetails = async () => {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');

      try {
        const res = await fetch(API.users.details(nim), {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || 'Failed to fetch member details.');
        }
        const data = await res.json();
        setDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [nim]);

  const renderActivityTable = (title, data, columns) => {
    return (
      <div className={styles.activitySection}>
        <h4 className={styles.activityTitle}>{title} ({data.length})</h4>
        {data.length > 0 ? (
          <table className={styles.activityTable}>
            <thead>
              <tr>
                {columns.map(col => <th key={col.key}>{col.header}</th>)}
              </tr>
            </thead>
            <tbody>
              {data.map(item => (
                <tr key={item.id}>
                  {columns.map(col => <td key={col.key}>{col.render(item)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className={styles.noActivity}>No activity recorded.</p>
        )}
      </div>
    );
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        {loading && <p>Loading details...</p>}
        {error && <p className={styles.error}>{error}</p>}
        {details && (
          <>
            <div className={styles.profileHeader}>
              <img src={details.profilePictureUrl || '/default-avatar.png'} alt="Profile" className={styles.profilePicture} />
              <div>
                <h2 className={styles.modalTitle}>{details.nama_lengkap}</h2>
                <p className={styles.profileInfo}><strong>NIM:</strong> {details.nim}</p>
                <p className={styles.profileInfo}><strong>Prodi:</strong> {details.prodi}</p>
                <p className={styles.profileInfo}><strong>Angkatan:</strong> 20{details.angkatan}</p>
                <p className={styles.profileInfo}><strong>Email:</strong> {details.email || 'N/A'}</p>
              </div>
            </div>

            <div className={styles.activitiesContainer}>
              {renderActivityTable('Lomba', details.lombas, [
                { key: 'nama', header: 'Nama Lomba', render: item => item.lomba.nama_lomba },
                { key: 'status', header: 'Status', render: item => <span className={`${styles.status} ${styles[item.status_hasil]}`}>{item.status_hasil}</span> },
                { key: 'tgl', header: 'Tgl. Daftar', render: item => new Date(item.createdAt).toLocaleDateString() },
              ])}
              {renderActivityTable('Beasiswa', details.beasiswas, [
                { key: 'nama', header: 'Nama Beasiswa', render: item => item.nama_beasiswa },
                { key: 'status', header: 'Status', render: item => <span className={`${styles.status} ${styles[item.status_hasil]}`}>{item.status_hasil}</span> },
                { key: 'tgl', header: 'Tgl. Daftar', render: item => new Date(item.createdAt).toLocaleDateString() },
              ])}
              {renderActivityTable('Talks/Seminars', details.talks, [
                { key: 'nama', header: 'Nama Seminar', render: item => item.talk.nama_seminar },
                { key: 'penyelenggara', header: 'Penyelenggara', render: item => item.talk.penyelenggara },
                { key: 'tgl', header: 'Tgl. Daftar', render: item => new Date(item.createdAt).toLocaleDateString() },
              ])}
              {renderActivityTable('Bootcamps', details.bootcamps, [
                { key: 'nama', header: 'Nama Bootcamp', render: item => item.bootcamp.nama_bootcamp },
                { key: 'status', header: 'Status', render: item => <span className={`${styles.status} ${styles[item.status_hasil]}`}>{item.status_hasil}</span> },
                { key: 'tgl', header: 'Tgl. Daftar', render: item => new Date(item.createdAt).toLocaleDateString() },
              ])}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MemberDetailModal;
