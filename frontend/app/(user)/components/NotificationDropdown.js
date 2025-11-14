'use client';

import React, { useState, useEffect } from 'react';
import styles from './NotificationDropdown.module.css';
import NotificationDetailModal from './NotificationDetailModal'; // Import the new modal

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedNotification, setSelectedNotification] = useState(null); // State for the selected notification

  const fetchNotifications = async (page) => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token not found.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/api/notifications?page=${page}&limit=5`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch notifications.');
      }

      const data = await res.json();
      setNotifications(data.notifications);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(currentPage);
  }, [currentPage]);

  const handleMarkAsRead = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      // No need to show an error here, as it's a background action
      console.error('Authentication token not found for marking notification as read.');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        // Don't throw an error that would bubble up to the UI, just log it
        const errorData = await res.json();
        console.error('Failed to mark notification as read:', errorData.message);
        return;
      }

      // Update the notification in the state to reflect it's read
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  // --- New Handlers for Modal ---
  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    // Mark as read when opened
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
  };

  const handleCloseModal = () => {
    setSelectedNotification(null);
  };
  // -----------------------------

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <>
      <div className={styles.dropdown}>
        <h3 className={styles.title}>Notifications</h3>
        {loading && <p className={styles.message}>Loading notifications...</p>}
        {error && <p className={styles.error}>{error}</p>}
        {!loading && notifications.length === 0 && <p className={styles.message}>No new notifications.</p>}

        <div className={styles.notificationList}>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`${styles.notificationItem} ${notification.isRead ? styles.read : styles.unread}`}
              onClick={() => handleNotificationClick(notification)} // Updated onClick
              title="Klik untuk mengetahui detail"
            >
              <p className={styles.notificationTitle}>{notification.title}</p>
              {/* The 'isi' is now removed from the list view */}
              <span className={styles.notificationTime}>
                {new Date(notification.createdAt).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button onClick={handlePrevPage} disabled={currentPage === 1} className={styles.paginationButton}>
              &larr; Previous
            </button>
            <span className={styles.pageInfo}>
              Page {currentPage} of {totalPages}
            </span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages} className={styles.paginationButton}>
              Next &rarr;
            </button>
          </div>
        )}
      </div>

      {/* Render the modal outside the dropdown flow */}
      {selectedNotification && (
        <NotificationDetailModal
          notification={selectedNotification}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default NotificationDropdown;
