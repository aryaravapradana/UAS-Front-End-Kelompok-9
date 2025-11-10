'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './AdminDashboard.module.css';
import MembersTable from './components/MembersTable';
import MemberFormModal from './components/MemberFormModal';
import LombaTable from './components/LombaTable';
import LombaFormModal from './components/LombaFormModal';
import BeasiswaTable from './components/BeasiswaTable';
import BeasiswaFormModal from './components/BeasiswaFormModal';
import BootcampTable from './components/BootcampTable';
import BootcampFormModal from './components/BootcampFormModal';
import TalkTable from './components/TalkTable';
import TalkFormModal from './components/TalkFormModal';
import NotificationTable from './components/NotificationTable'; // Import NotificationTable

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [members, setMembers] = useState([]);
  const [lombas, setLombas] = useState([]);
  const [beasiswas, setBeasiswas] = useState([]);
  const [bootcamps, setBootcamps] = useState([]);
  const [talks, setTalks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  // Modal states
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [isLombaModalOpen, setIsLombaModalOpen] = useState(false);
  const [editingLomba, setEditingLomba] = useState(null);
  const [isBeasiswaModalOpen, setIsBeasiswaModalOpen] = useState(false);
  const [editingBeasiswa, setEditingBeasiswa] = useState(null);
  const [isBootcampModalOpen, setIsBootcampModalOpen] = useState(false);
  const [editingBootcamp, setEditingBootcamp] = useState(null);
  const [isTalkModalOpen, setIsTalkModalOpen] = useState(false);
  const [editingTalk, setEditingTalk] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState(''); // New state for notification message
  const [adminNotifications, setAdminNotifications] = useState([]); // New state for admin notifications

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'admin') {
        router.push('/');
        return;
      }
      setUser(parsedUser);
    } else {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        fetchMembers(token),
        fetchLombas(token),
        fetchBeasiswas(token),
        fetchBootcamps(token),
        fetchTalks(token),
        fetchAdminNotifications(token), // Fetch notifications for admin
      ]);
      setLoading(false);
    };

    fetchData();
  }, [router]);

  // Fetch functions
  const fetchMembers = async (token) => {
    try {
      const res = await fetch('http://localhost:3001/api/users', { headers: { 'Authorization': `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed to fetch members.');
      const data = await res.json();
      setMembers(data);
    } catch (err) { setError(err.message); }
  };

  const fetchLombas = async (token) => {
    try {
      const res = await fetch('http://localhost:3001/api/lombas', { headers: { 'Authorization': `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed to fetch lombas.');
      const data = await res.json();
      setLombas(data);
    } catch (err) { setError(err.message); }
  };

  const fetchBeasiswas = async (token) => {
    try {
      const res = await fetch('http://localhost:3001/api/beasiswas', { headers: { 'Authorization': `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed to fetch beasiswas.');
      const data = await res.json();
      setBeasiswas(data);
    } catch (err) { setError(err.message); }
  };

  const fetchBootcamps = async (token) => {
    try {
      const res = await fetch('http://localhost:3001/api/bootcamps', { headers: { 'Authorization': `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed to fetch bootcamps.');
      const data = await res.json();
      setBootcamps(data);
    } catch (err) { setError(err.message); }
  };

  const fetchTalks = async (token) => {
    try {
      const res = await fetch('http://localhost:3001/api/talks', { headers: { 'Authorization': `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed to fetch talks.');
      const data = await res.json();
      setTalks(data);
    } catch (err) { setError(err.message); }
  };

  const fetchAdminNotifications = async (token) => {
    try {
      // Fetch all notifications for admin view, without pagination for simplicity
      const res = await fetch('http://localhost:3001/api/notifications?limit=1000', { // Fetch a large number to act as 'all'
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch admin notifications.');
      const data = await res.json();
      setAdminNotifications(data.notifications);
    } catch (err) { setError(err.message); }
  };

  // Notification Handler
  const handleSendNotification = async () => {
    if (!notificationMessage.trim()) {
      alert('Notification message cannot be empty.');
      return;
    }
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:3001/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ message: notificationMessage }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to send notification.');
      }
      alert('Notification sent successfully!');
      setNotificationMessage(''); // Clear the message input
      fetchAdminNotifications(token); // Refresh the list of notifications
    } catch (err) {
      alert(`Error sending notification: ${err.message}`);
    }
  };

  const handleDeleteNotification = async (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`http://localhost:3001/api/notifications/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to delete notification.');
        }
        alert('Notification deleted successfully.');
        fetchAdminNotifications(token); // Refresh the list
      } catch (err) {
        alert(`Error deleting notification: ${err.message}`);
      }
    }
  };

  // Member Handlers
  const handleMemberEdit = (member) => { setEditingMember(member); setIsMemberModalOpen(true); };
  const handleAddNewMember = () => { setEditingMember(null); setIsMemberModalOpen(true); };
  const handleCloseMemberModal = () => { setIsMemberModalOpen(false); setEditingMember(null); };
  const handleMemberDelete = async (nim) => {
    if (window.confirm(`Delete member NIM ${nim}?`)) {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`http://localhost:3001/api/users/${nim}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        if (!res.ok) throw new Error(await res.json().then(d => d.message));
        setMembers(members.filter((m) => m.nim !== nim));
        alert('Member deleted.');
      } catch (err) { alert(`Error: ${err.message}`); }
    }
  };
  const handleMemberFormSubmit = async (formData) => {
    const token = localStorage.getItem('token');
    const isEditMode = !!editingMember;
    const url = isEditMode ? `http://localhost:3001/api/users/${editingMember.nim}` : 'http://localhost:3001/api/auth/register';
    const method = isEditMode ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, { method, headers: { 'Authorization': `Bearer ${token}` }, body: formData });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to process member.');
      }
      alert(`Member ${isEditMode ? 'updated' : 'created'}.`);
      handleCloseMemberModal();
      fetchMembers(token);
    } catch (err) { alert(`Error: ${err.message}`); }
  };

  const handleDeleteMemberEmail = async (nim) => {
    if (window.confirm(`Are you sure you want to delete the email for NIM ${nim}?`)) {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`http://localhost:3001/api/users/${nim}/email`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to delete email.');
        }
        alert('Member email deleted successfully.');
        fetchMembers(token); // Refresh the member list
        // Optionally, update the editingMember state if the modal is still open
        if (editingMember && editingMember.nim === nim) {
          setEditingMember(prev => ({ ...prev, email: null }));
        }
      } catch (err) {
        alert(`Error: ${err.message}`);
      }
    }
  };

  // Lomba Handlers
  const handleLombaEdit = (lomba) => { setEditingLomba(lomba); setIsLombaModalOpen(true); };
  const handleAddNewLomba = () => { setEditingLomba(null); setIsLombaModalOpen(true); };
  const handleCloseLombaModal = () => { setIsLombaModalOpen(false); setEditingLomba(null); };
  const handleLombaDelete = async (id) => {
    if (window.confirm('Delete this lomba?')) {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`http://localhost:3001/api/lombas/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        if (!res.ok) throw new Error(await res.json().then(d => d.message));
        setLombas(lombas.filter((l) => l.id !== id));
        alert('Lomba deleted.');
      } catch (err) { alert(`Error: ${err.message}`); }
    }
  };
  const handleLombaFormSubmit = async (formData) => {
    const token = localStorage.getItem('token');
    const isEditMode = !!editingLomba;
    const url = isEditMode ? `http://localhost:3001/api/lombas/${editingLomba.id}` : 'http://localhost:3001/api/lombas';
    const method = isEditMode ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, { method, headers: { 'Authorization': `Bearer ${token}` }, body: formData });
      if (!res.ok) throw new Error(await res.json().then(d => d.message));
      alert(`Lomba ${isEditMode ? 'updated' : 'created'}.`);
      handleCloseLombaModal();
      fetchLombas(token);
    } catch (err) { alert(`Error: ${err.message}`); }
  };

  // Beasiswa Handlers
  const handleBeasiswaEdit = (beasiswa) => { setEditingBeasiswa(beasiswa); setIsBeasiswaModalOpen(true); };
  const handleAddNewBeasiswa = () => { setEditingBeasiswa(null); setIsBeasiswaModalOpen(true); };
  const handleCloseBeasiswaModal = () => { setIsBeasiswaModalOpen(false); setEditingBeasiswa(null); };
  const handleBeasiswaDelete = async (id) => {
    if (window.confirm('Delete this beasiswa?')) {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`http://localhost:3001/api/beasiswas/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        if (!res.ok) throw new Error(await res.json().then(d => d.message));
        setBeasiswas(beasiswas.filter((b) => b.id !== id));
        alert('Beasiswa deleted.');
      } catch (err) { alert(`Error: ${err.message}`); }
    }
  };
  const handleBeasiswaFormSubmit = async (formData) => {
    const token = localStorage.getItem('token');
    const isEditMode = !!editingBeasiswa;
    const url = isEditMode ? `http://localhost:3001/api/beasiswas/${editingBeasiswa.id}` : 'http://localhost:3001/api/beasiswas';
    const method = isEditMode ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, { method, headers: { 'Authorization': `Bearer ${token}` }, body: formData });
      if (!res.ok) throw new Error(await res.json().then(d => d.message));
      alert(`Beasiswa ${isEditMode ? 'updated' : 'created'}.`);
      handleCloseBeasiswaModal();
      fetchBeasiswas(token);
    } catch (err) { alert(`Error: ${err.message}`); }
  };

  // Bootcamp Handlers
  const handleBootcampEdit = (bootcamp) => { setEditingBootcamp(bootcamp); setIsBootcampModalOpen(true); };
  const handleAddNewBootcamp = () => { setEditingBootcamp(null); setIsBootcampModalOpen(true); };
  const handleCloseBootcampModal = () => { setIsBootcampModalOpen(false); setEditingBootcamp(null); };
  const handleBootcampDelete = async (id) => {
    if (window.confirm('Delete this bootcamp?')) {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`http://localhost:3001/api/bootcamps/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        if (!res.ok) throw new Error(await res.json().then(d => d.message));
        setBootcamps(bootcamps.filter((b) => b.id !== id));
        alert('Bootcamp deleted.');
      } catch (err) { alert(`Error: ${err.message}`); }
    }
  };
  const handleBootcampFormSubmit = async (formData) => {
    const token = localStorage.getItem('token');
    const isEditMode = !!editingBootcamp;
    const url = isEditMode ? `http://localhost:3001/api/bootcamps/${editingBootcamp.id}` : 'http://localhost:3001/api/bootcamps';
    const method = isEditMode ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, { method, headers: { 'Authorization': `Bearer ${token}` }, body: formData });
      if (!res.ok) throw new Error(await res.json().then(d => d.message));
      alert(`Bootcamp ${isEditMode ? 'updated' : 'created'}.`);
      handleCloseBootcampModal();
      fetchBootcamps(token);
    } catch (err) { alert(`Error: ${err.message}`); }
  };

  // Talk Handlers
  const handleTalkEdit = (talk) => { setEditingTalk(talk); setIsTalkModalOpen(true); };
  const handleAddNewTalk = () => { setEditingTalk(null); setIsTalkModalOpen(true); };
  const handleCloseTalkModal = () => { setIsTalkModalOpen(false); setEditingTalk(null); };
  const handleTalkDelete = async (id) => {
    if (window.confirm('Delete this talk?')) {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`http://localhost:3001/api/talk/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        if (!res.ok) throw new Error(await res.json().then(d => d.message));
        setTalks(talks.filter((t) => t.id !== id));
        alert('Talk deleted.');
      } catch (err) { alert(`Error: ${err.message}`); }
    }
  };
  const handleTalkFormSubmit = async (formData) => {
    const token = localStorage.getItem('token');
    const isEditMode = !!editingTalk;
    const url = isEditMode ? `http://localhost:3001/api/talks/${editingTalk.id}` : 'http://localhost:3001/api/talks';
    const method = isEditMode ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, { method, headers: { 'Authorization': `Bearer ${token}` }, body: formData });
      if (!res.ok) throw new Error(await res.json().then(d => d.message));
      alert(`Talk ${isEditMode ? 'updated' : 'created'}.`);
      handleCloseTalkModal();
      fetchTalks(token);
    } catch (err) { alert(`Error: ${err.message}`); }
  };

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;
  if (!user) return <p>Redirecting to login...</p>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user.nama_lengkap} ({user.nim})</p>
      </header>
      <main className={styles.main}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Members Management</h2>
            <button onClick={handleAddNewMember} className={styles.addButton}>Add New Member</button>
          </div>
          <MembersTable members={members} onEdit={handleMemberEdit} onDelete={handleMemberDelete} />
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Lomba Management</h2>
            <button onClick={handleAddNewLomba} className={styles.addButton}>Add New Lomba</button>
          </div>
          <LombaTable lombas={lombas} onEdit={handleLombaEdit} onDelete={handleLombaDelete} />
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Beasiswa Management</h2>
            <button onClick={handleAddNewBeasiswa} className={styles.addButton}>Add New Beasiswa</button>
          </div>
          <BeasiswaTable beasiswas={beasiswas} onEdit={handleBeasiswaEdit} onDelete={handleBeasiswaDelete} />
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Bootcamp Management</h2>
            <button onClick={handleAddNewBootcamp} className={styles.addButton}>Add New Bootcamp</button>
          </div>
          <BootcampTable bootcamps={bootcamps} onEdit={handleBootcampEdit} onDelete={handleBootcampDelete} />
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Talk Management</h2>
            <button onClick={handleAddNewTalk} className={styles.addButton}>Add New Talk</button>
          </div>
          <TalkTable talks={talks} onEdit={handleTalkEdit} onDelete={handleTalkDelete} />
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Notification Management</h2>
          </div>
          <div className={styles.notificationForm}>
            <textarea
              className={styles.notificationTextarea}
              placeholder="Type your notification message here..."
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
              rows="4"
            ></textarea>
            <button onClick={handleSendNotification} className={styles.sendNotificationButton}>
              Send Notification
            </button>
          </div>
          <NotificationTable notifications={adminNotifications} onDelete={handleDeleteNotification} />
        </div>
      </main>

      <MemberFormModal
        isOpen={isMemberModalOpen}
        onClose={handleCloseMemberModal}
        onSubmit={handleMemberFormSubmit}
        onDeleteEmail={handleDeleteMemberEmail} // Pass the new handler
        initialData={editingMember}
      />
      <LombaFormModal isOpen={isLombaModalOpen} onClose={handleCloseLombaModal} onSubmit={handleLombaFormSubmit} initialData={editingLomba} />
      <BeasiswaFormModal isOpen={isBeasiswaModalOpen} onClose={handleCloseBeasiswaModal} onSubmit={handleBeasiswaFormSubmit} initialData={editingBeasiswa} />
      <BootcampFormModal isOpen={isBootcampModalOpen} onClose={handleCloseBootcampModal} onSubmit={handleBootcampFormSubmit} initialData={editingBootcamp} />
      <TalkFormModal isOpen={isTalkModalOpen} onClose={handleCloseTalkModal} onSubmit={handleTalkFormSubmit} initialData={editingTalk} />
    </div>
  );
}