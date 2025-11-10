'use client';

import React from 'react';
import styles from './MembersTable.module.css'; // Reusing MembersTable styles for now

const NotificationTable = ({ notifications, onDelete }) => {
  if (!notifications || notifications.length === 0) {
    return <p>No notifications found.</p>;
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Message</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map((notification) => (
            <tr key={notification.id}>
              <td>{notification.id}</td>
              <td>{notification.message}</td>
              <td>{new Date(notification.createdAt).toLocaleString()}</td>
              <td className={styles.actions}>
                <button onClick={() => onDelete(notification.id)} className={`${styles.button} ${styles.deleteButton}`}>
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

export default NotificationTable;
