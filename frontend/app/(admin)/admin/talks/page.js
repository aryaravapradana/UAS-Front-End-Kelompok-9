'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import styles from '../AdminDashboard.module.css';
import TalkTable from '../components/TalkTable';
import TalkFormModal from '../components/TalkFormModal';
import PaginationControls from '../components/PaginationControls';
import API from '@/lib/api';

export default function TalksPage() {
  // States
  const [talks, setTalks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal states
  const [isTalkModalOpen, setIsTalkModalOpen] = useState(false);
  const [editingTalk, setEditingTalk] = useState(null);

  // Pagination and Search states
  const [talksPage, setTalksPage] = useState(1);
  const [talkSearch, setTalkSearch] = useState('');

  // Fetch function
  const fetchTalks = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(API.talks.list(), { headers: { 'Authorization': `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed to fetch talks.');
      const data = await res.json();
      setTalks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTalks();
  }, []);

  // Handlers
  const handleTalkEdit = (talk) => { setEditingTalk(talk); setIsTalkModalOpen(true); };
  const handleAddNewTalk = () => { setEditingTalk(null); setIsTalkModalOpen(true); };
  const handleCloseTalkModal = () => { setIsTalkModalOpen(false); setEditingTalk(null); };

  const handleTalkDelete = async (id) => {
    if (window.confirm('Delete this talk?')) {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(API.talks.detail(id), { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        if (!res.ok) throw new Error(await res.json().then(d => d.message));
        setTalks(talks.filter((t) => t.id !== id));
        toast.success('Talk deleted.');
      } catch (err) { toast.error(`Error: ${err.message}`); }
    }
  };

  const handleTalkFormSubmit = async (formData) => {
    const token = localStorage.getItem('token');
    const isEditMode = !!editingTalk;
    const url = isEditMode ? API.talks.detail(editingTalk.id) : API.talks.list();
    const method = isEditMode ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, { method, headers: { 'Authorization': `Bearer ${token}` }, body: formData });
      if (!res.ok) throw new Error(await res.json().then(d => d.message));
      toast.success(`Talk ${isEditMode ? 'updated' : 'created'}.`);
      handleCloseTalkModal();
      fetchTalks();
    } catch (err) { toast.error(`Error: ${err.message}`); }
  };

  // Search and Pagination Logic
  const ITEMS_PER_PAGE = 7;
  const filteredTalks = talks.filter(item =>
    Object.values(item).some(val =>
      String(val).toLowerCase().includes(talkSearch.toLowerCase())
    )
  );
  const totalTalkPages = Math.ceil(filteredTalks.length / ITEMS_PER_PAGE);
  const paginatedTalks = filteredTalks.slice(
    (talksPage - 1) * ITEMS_PER_PAGE,
    talksPage * ITEMS_PER_PAGE
  );

  if (loading) return <p>Loading talks...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;

  return (
    <>
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
        <TalkTable
          talks={paginatedTalks}
          onEdit={handleTalkEdit}
          onDelete={handleTalkDelete}
        />
        <PaginationControls
          currentPage={talksPage}
          totalPages={totalTalkPages}
          onPageChange={setTalksPage}
        />
      </div>

      <TalkFormModal
        isOpen={isTalkModalOpen}
        onClose={handleCloseTalkModal}
        onSubmit={handleTalkFormSubmit}
        initialData={editingTalk}
      />
    </>
  );
}
