'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import styles from '../AdminDashboard.module.css';
import LombaTable from '../components/LombaTable';
import LombaFormModal from '../components/LombaFormModal';
import PaginationControls from '../components/PaginationControls';
import API from '@/lib/api';

export default function LombasPage() {
  // States
  const [lombas, setLombas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal states
  const [isLombaModalOpen, setIsLombaModalOpen] = useState(false);
  const [editingLomba, setEditingLomba] = useState(null);

  // Pagination and Search states
  const [lombasPage, setLombasPage] = useState(1);
  const [lombaSearch, setLombaSearch] = useState('');

  // Fetch function
  const fetchLombas = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(API.lombas.list(), { headers: { 'Authorization': `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed to fetch lombas.');
      const data = await res.json();
      setLombas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLombas();
  }, []);

  // Handlers
  const handleLombaEdit = (lomba) => { setEditingLomba(lomba); setIsLombaModalOpen(true); };
  const handleAddNewLomba = () => { setEditingLomba(null); setIsLombaModalOpen(true); };
  const handleCloseLombaModal = () => { setIsLombaModalOpen(false); setEditingLomba(null); };

  const handleLombaDelete = async (id) => {
    if (window.confirm('Delete this lomba?')) {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(API.lombas.detail(id), { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        if (!res.ok) throw new Error(await res.json().then(d => d.message));
        setLombas(lombas.filter((l) => l.id !== id));
        toast.success('Lomba deleted.');
      } catch (err) { toast.error(`Error: ${err.message}`); }
    }
  };

  const handleLombaFormSubmit = async (formData) => {
    const token = localStorage.getItem('token');
    const isEditMode = !!editingLomba;
    const url = isEditMode ? API.lombas.detail(editingLomba.id) : API.lombas.list();
    const method = isEditMode ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, { method, headers: { 'Authorization': `Bearer ${token}` }, body: formData });
      if (!res.ok) throw new Error(await res.json().then(d => d.message));
      toast.success(`Lomba ${isEditMode ? 'updated' : 'created'}.`);
      handleCloseLombaModal();
      fetchLombas();
    } catch (err) { toast.error(`Error: ${err.message}`); }
  };

  // Search and Pagination Logic
  const ITEMS_PER_PAGE = 7;
  const filteredLombas = lombas.filter(item =>
    Object.values(item).some(val =>
      String(val).toLowerCase().includes(lombaSearch.toLowerCase())
    )
  );
  const totalLombaPages = Math.ceil(filteredLombas.length / ITEMS_PER_PAGE);
  const paginatedLombas = filteredLombas.slice(
    (lombasPage - 1) * ITEMS_PER_PAGE,
    lombasPage * ITEMS_PER_PAGE
  );

  if (loading) return <p>Loading lombas...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;

  return (
    <>
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
        <LombaTable
          lombas={paginatedLombas}
          onEdit={handleLombaEdit}
          onDelete={handleLombaDelete}
        />
        <PaginationControls
          currentPage={lombasPage}
          totalPages={totalLombaPages}
          onPageChange={setLombasPage}
        />
      </div>

      <LombaFormModal
        isOpen={isLombaModalOpen}
        onClose={handleCloseLombaModal}
        onSubmit={handleLombaFormSubmit}
        initialData={editingLomba}
      />
    </>
  );
}
