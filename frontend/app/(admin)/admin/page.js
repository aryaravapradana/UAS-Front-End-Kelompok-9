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
import PaginationControls from './components/PaginationControls';

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

  // Pagination states
  const [membersPage, setMembersPage] = useState(1);
  const [lombasPage, setLombasPage] = useState(1);
  const [beasiswasPage, setBeasiswasPage] = useState(1);
  const [bootcampsPage, setBootcampsPage] = useState(1);
  const [talksPage, setTalksPage] = useState(1);
  const [notificationsPage, setNotificationsPage] = useState(1);

  // Search states
  const [memberSearch, setMemberSearch] = useState('');
  const [lombaSearch, setLombaSearch] = useState('');
  const [beasiswaSearch, setBeasiswaSearch] = useState('');
  const [bootcampSearch, setBootcampSearch] = useState('');
  const [talkSearch, setTalkSearch] = useState('');
  const [notificationSearch, setNotificationSearch] = useState('');

  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationIsi, setNotificationIsi] = useState('');
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
    if (!notificationTitle.trim() || !notificationIsi.trim()) {
      alert('Notification title and content cannot be empty.');
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
        body: JSON.stringify({ title: notificationTitle, isi: notificationIsi }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to send notification.');
      }
      alert('Notification sent successfully!');
      setNotificationTitle(''); // Clear the title input
      setNotificationIsi(''); // Clear the content input
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

  // --- Search and Pagination Logic ---
  const ITEMS_PER_PAGE = 7;

  const searchFilter = (data, query) => {
    if (!query) return data;
    const lowerCaseQuery = query.toLowerCase();
    return data.filter(item =>
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(lowerCaseQuery)
      )
    );
  };

  // Members
  const filteredMembers = searchFilter(members, memberSearch);
  const totalMemberPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE);
  const paginatedMembers = filteredMembers.slice(
    (membersPage - 1) * ITEMS_PER_PAGE,
    membersPage * ITEMS_PER_PAGE
  );

  // Lombas
  const filteredLombas = searchFilter(lombas, lombaSearch);
  const totalLombaPages = Math.ceil(filteredLombas.length / ITEMS_PER_PAGE);
  const paginatedLombas = filteredLombas.slice(
    (lombasPage - 1) * ITEMS_PER_PAGE,
    lombasPage * ITEMS_PER_PAGE
  );

  // Beasiswas
  const filteredBeasiswas = searchFilter(beasiswas, beasiswaSearch);
  const totalBeasiswaPages = Math.ceil(filteredBeasiswas.length / ITEMS_PER_PAGE);
  const paginatedBeasiswas = filteredBeasiswas.slice(
    (beasiswasPage - 1) * ITEMS_PER_PAGE,
    beasiswasPage * ITEMS_PER_PAGE
  );

  // Bootcamps
  const filteredBootcamps = searchFilter(bootcamps, bootcampSearch);
  const totalBootcampPages = Math.ceil(filteredBootcamps.length / ITEMS_PER_PAGE);
  const paginatedBootcamps = filteredBootcamps.slice(
    (bootcampsPage - 1) * ITEMS_PER_PAGE,
    bootcampsPage * ITEMS_PER_PAGE
  );

  // Talks
  const filteredTalks = searchFilter(talks, talkSearch);
  const totalTalkPages = Math.ceil(filteredTalks.length / ITEMS_PER_PAGE);
  const paginatedTalks = filteredTalks.slice(
    (talksPage - 1) * ITEMS_PER_PAGE,
    talksPage * ITEMS_PER_PAGE
  );

  // Notifications
  const filteredNotifications = searchFilter(adminNotifications, notificationSearch);
  const totalNotificationPages = Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE);
  const paginatedNotifications = filteredNotifications.slice(
    (notificationsPage - 1) * ITEMS_PER_PAGE,
    notificationsPage * ITEMS_PER_PAGE
  );
  // --- End Logic ---

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
            <div className={styles.headerActions}>
              <input
                type="text"
                placeholder="Search Members..."
                className={styles.searchInput}
                value={memberSearch}
                onChange={(e) => { setMemberSearch(e.target.value); setMembersPage(1); }}
              />
              <button onClick={handleAddNewMember} className={styles.addButton}>Add New Member</button>
            </div>
          </div>
          <MembersTable members={paginatedMembers} onEdit={handleMemberEdit} onDelete={handleMemberDelete} />
          <PaginationControls
            currentPage={membersPage}
            totalPages={totalMemberPages}
            onPageChange={setMembersPage}
          />
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Lomba Management</h2>
            <div className={styles.headerActions}>
              <input
                type="text"
                placeholder="Search Lombas..."
                className={styles.searchInput}
                value={lombaSearch}
                onChange={(e) => { setLombaSearch(e.target.value); setLombasPage(1); }}
              />
              <button onClick={handleAddNewLomba} className={styles.addButton}>Add New Lomba</button>
            </div>
          </div>
          <LombaTable lombas={paginatedLombas} onEdit={handleLombaEdit} onDelete={handleLombaDelete} />
          <PaginationControls
            currentPage={lombasPage}
            totalPages={totalLombaPages}
            onPageChange={setLombasPage}
          />
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Beasiswa Management</h2>
            <div className={styles.headerActions}>
              <input
                type="text"
                placeholder="Search Beasiswas..."
                className={styles.searchInput}
                value={beasiswaSearch}
                onChange={(e) => { setBeasiswaSearch(e.target.value); setBeasiswasPage(1); }}
              />
              <button onClick={handleAddNewBeasiswa} className={styles.addButton}>Add New Beasiswa</button>
            </div>
          </div>
          <BeasiswaTable beasiswas={paginatedBeasiswas} onEdit={handleBeasiswaEdit} onDelete={handleBeasiswaDelete} />
          <PaginationControls
            currentPage={beasiswasPage}
            totalPages={totalBeasiswaPages}
            onPageChange={setBeasiswasPage}
          />
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Bootcamp Management</h2>
            <div className={styles.headerActions}>
              <input
                type="text"
                placeholder="Search Bootcamps..."
                className={styles.searchInput}
                value={bootcampSearch}
                onChange={(e) => { setBootcampSearch(e.target.value); setBootcampsPage(1); }}
              />
              <button onClick={handleAddNewBootcamp} className={styles.addButton}>Add New Bootcamp</button>
            </div>
          </div>
          <BootcampTable bootcamps={paginatedBootcamps} onEdit={handleBootcampEdit} onDelete={handleBootcampDelete} />
          <PaginationControls
            currentPage={bootcampsPage}
            totalPages={totalBootcampPages}
            onPageChange={setBootcampsPage}
          />
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Talk Management</h2>
            <div className={styles.headerActions}>
              <input
                type="text"
                placeholder="Search Talks..."
                className={styles.searchInput}
                value={talkSearch}
                onChange={(e) => { setTalkSearch(e.target.value); setTalksPage(1); }}
              />
              <button onClick={handleAddNewTalk} className={styles.addButton}>Add New Talk</button>
            </div>
          </div>
          <TalkTable talks={paginatedTalks} onEdit={handleTalkEdit} onDelete={handleTalkDelete} />
          <PaginationControls
            currentPage={talksPage}
            totalPages={totalTalkPages}
            onPageChange={setTalksPage}
          />
        </div>

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
          <NotificationTable notifications={paginatedNotifications} onDelete={handleDeleteNotification} />
          <PaginationControls
            currentPage={notificationsPage}
            totalPages={totalNotificationPages}
            onPageChange={setNotificationsPage}
          />
        </div>
      </main>

      <MemberFormModal
        isOpen={isMemberModalOpen}
        onClose={handleCloseMemberModal}
        onSubmit={handleMemberFormSubmit}
        onDeleteEmail={handleDeleteMemberEmail}
        initialData={editingMember}
      />
      <LombaFormModal isOpen={isLombaModalOpen} onClose={handleCloseLombaModal} onSubmit={handleLombaFormSubmit} initialData={editingLomba} />
      <BeasiswaFormModal isOpen={isBeasiswaModalOpen} onClose={handleCloseBeasiswaModal} onSubmit={handleBeasiswaFormSubmit} initialData={editingBeasiswa} />
      <BootcampFormModal isOpen={isBootcampModalOpen} onClose={handleCloseBootcampModal} onSubmit={handleBootcampFormSubmit} initialData={editingBootcamp} />
      <TalkFormModal isOpen={isTalkModalOpen} onClose={handleCloseTalkModal} onSubmit={handleTalkFormSubmit} initialData={editingTalk} />
    </div>
  );
}