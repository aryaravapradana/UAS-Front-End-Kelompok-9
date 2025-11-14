'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import styles from '../AdminDashboard.module.css';
import BootcampTable from '../components/BootcampTable';
import BootcampFormModal from '../components/BootcampFormModal';
import PaginationControls from '../components/PaginationControls';

export default function BootcampsPage() {
  // States
  const [bootcamps, setBootcamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal states
  const [isBootcampModalOpen, setIsBootcampModalOpen] = useState(false);
  const [editingBootcamp, setEditingBootcamp] = useState(null);

  // Pagination and Search states
  const [bootcampsPage, setBootcampsPage] = useState(1);
  const [bootcampSearch, setBootcampSearch] = useState('');

  // Fetch function
  const fetchBootcamps = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:3001/api/bootcamps', { headers: { 'Authorization': `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed to fetch bootcamps.');
      const data = await res.json();
      setBootcamps(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBootcamps();
  }, []);

  // Handlers
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
        toast.success('Bootcamp deleted.');
      } catch (err) { toast.error(`Error: ${err.message}`); }
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
      toast.success(`Bootcamp ${isEditMode ? 'updated' : 'created'}.`);
      handleCloseBootcampModal();
      fetchBootcamps();
    } catch (err) { toast.error(`Error: ${err.message}`); }
  };

  // Search and Pagination Logic
  const ITEMS_PER_PAGE = 7;
  const filteredBootcamps = bootcamps.filter(item =>
    Object.values(item).some(val =>
      String(val).toLowerCase().includes(bootcampSearch.toLowerCase())
    )
  );
  const totalBootcampPages = Math.ceil(filteredBootcamps.length / ITEMS_PER_PAGE);
  const paginatedBootcamps = filteredBootcamps.slice(
    (bootcampsPage - 1) * ITEMS_PER_PAGE,
    bootcampsPage * ITEMS_PER_PAGE
  );

  if (loading) return <p>Loading bootcamps...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;

  return (
    <>
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
        <BootcampTable
          bootcamps={paginatedBootcamps}
          onEdit={handleBootcampEdit}
          onDelete={handleBootcampDelete}
        />
        <PaginationControls
          currentPage={bootcampsPage}
          totalPages={totalBootcampPages}
          onPageChange={setBootcampsPage}
        />
      </div>

      <BootcampFormModal
        isOpen={isBootcampModalOpen}
        onClose={handleCloseBootcampModal}
        onSubmit={handleBootcampFormSubmit}
        initialData={editingBootcamp}
      />
    </>
  );
}
