'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import styles from '../AdminDashboard.module.css';
import NotificationTable from '../components/NotificationTable';
import PaginationControls from '../components/PaginationControls';
import API from '@/lib/api';

export default function NotificationsPage() {
  // States
  const [adminNotifications, setAdminNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form states
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationIsi, setNotificationIsi] = useState('');

  // Pagination and Search states
  const [notificationsPage, setNotificationsPage] = useState(1);
  const [notificationSearch, setNotificationSearch] = useState('');

  // Fetch function
  const fetchAdminNotifications = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(API.notifications.list(1, 1000), { headers: { 'Authorization': `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed to fetch notifications.');
      const data = await res.json();
      setAdminNotifications(data.notifications);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminNotifications();
  }, []);

  // Handlers
  const handleSendNotification = async () => {
    if (!notificationTitle.trim() || !notificationIsi.trim()) {
      toast.error('Notification title and content cannot be empty.');
      return;
    }
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(API.notifications.create(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title: notificationTitle, isi: notificationIsi }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to send notification.');
      }
      toast.success('Notification sent successfully!');
      setNotificationTitle('');
      setNotificationIsi('');
      fetchAdminNotifications(); // Refresh the list
    } catch (err) {
      toast.error(`Error sending notification: ${err.message}`);
    }
  };

  const handleDeleteNotification = async (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(API.notifications.delete(id), {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to delete notification.');
        }
        toast.success('Notification deleted successfully.');
        fetchAdminNotifications(); // Refresh the list
      } catch (err) {
        toast.error(`Error deleting notification: ${err.message}`);
      }
    }
  };

  // Search and Pagination Logic
  const ITEMS_PER_PAGE = 7;
  const filteredNotifications = adminNotifications.filter(item =>
    Object.values(item).some(val =>
      String(val).toLowerCase().includes(notificationSearch.toLowerCase())
    )
  );
  const totalNotificationPages = Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE);
  const paginatedNotifications = filteredNotifications.slice(
    (notificationsPage - 1) * ITEMS_PER_PAGE,
    notificationsPage * ITEMS_PER_PAGE
  );

  if (loading) return <p>Loading notifications...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;

  return (
    <>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Notification Management</h2>
          <div className={styles.headerActions}>
            <input
              type="text"
              placeholder="Search Notifications..."
              className={styles.searchInput}
              value={notificationSearch}
              onChange={(e) => { setNotificationSearch(e.target.value); setNotificationsPage(1); }}
            />
          </div>
        </div>
        <div className={styles.notificationForm}>
          <input
            type="text"
            className={styles.notificationInput}
            placeholder="Notification Title"
            value={notificationTitle}
            onChange={(e) => setNotificationTitle(e.target.value)}
          />
          <textarea
            className={styles.notificationTextarea}
            placeholder="Type your notification content here..."
            value={notificationIsi}
            onChange={(e) => setNotificationIsi(e.target.value)}
            rows="4"
          ></textarea>
          <button onClick={handleSendNotification} className={styles.sendNotificationButton}>
            Send Notification
          </button>
        </div>
        <NotificationTable
          notifications={paginatedNotifications}
          onDelete={handleDeleteNotification}
        />
        <PaginationControls
          currentPage={notificationsPage}
          totalPages={totalNotificationPages}
          onPageChange={setNotificationsPage}
        />
      </div>
    </>
  );
}
