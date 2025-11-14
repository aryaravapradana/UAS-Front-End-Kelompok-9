'use client';

import React from 'react';
import styles from './NotificationDetailModal.module.css';

const NotificationDetailModal = ({ notification, onClose }) => {
  if (!notification) {
    return null;
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2 className={styles.modalTitle}>{notification.title}</h2>
        <p className={styles.modalIsi}>{notification.isi}</p>
        <div className={styles.modalFooter}>
          <span className={styles.modalTime}>
            {new Date(notification.createdAt).toLocaleString('id-ID', {
              dateStyle: 'full',
              timeStyle: 'short',
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetailModal;
