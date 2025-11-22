'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import styles from '../AdminDashboard.module.css';
import BeasiswaTable from '../components/BeasiswaTable';
import BeasiswaFormModal from '../components/BeasiswaFormModal';
import PaginationControls from '../components/PaginationControls';
import API from '@/lib/api';

export default function BeasiswasPage() {
  // States
  const [beasiswas, setBeasiswas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal states
  const [isBeasiswaModalOpen, setIsBeasiswaModalOpen] = useState(false);
  const [editingBeasiswa, setEditingBeasiswa] = useState(null);

  // Pagination and Search states
  const [beasiswasPage, setBeasiswasPage] = useState(1);
  const [beasiswaSearch, setBeasiswaSearch] = useState('');

  // Fetch function
  const fetchBeasiswas = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(API.beasiswas.list(), { headers: { 'Authorization': `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed to fetch beasiswas.');
      const data = await res.json();
      setBeasiswas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBeasiswas();
  }, []);

  // Handlers
  const handleBeasiswaEdit = (beasiswa) => { setEditingBeasiswa(beasiswa); setIsBeasiswaModalOpen(true); };
  const handleAddNewBeasiswa = () => { setEditingBeasiswa(null); setIsBeasiswaModalOpen(true); };
  const handleCloseBeasiswaModal = () => { setIsBeasiswaModalOpen(false); setEditingBeasiswa(null); };

  const handleBeasiswaDelete = async (id) => {
    if (window.confirm('Delete this beasiswa?')) {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(API.beasiswas.detail(id), { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        if (!res.ok) throw new Error(await res.json().then(d => d.message));
        setBeasiswas(beasiswas.filter((b) => b.id !== id));
        toast.success('Beasiswa deleted.');
      } catch (err) { toast.error(`Error: ${err.message}`); }
    }
  };

  const handleBeasiswaFormSubmit = async (submission) => {
    const { formData, poster } = submission;
    const token = localStorage.getItem('token');
    const isEditMode = !!editingBeasiswa;

    // Step 1: Create/Update Text Data
    let beasiswaResponse;
    try {
      const url = isEditMode ? API.beasiswas.detail(editingBeasiswa.id) : API.beasiswas.list();
      const method = isEditMode ? 'PUT' : 'POST';

      // Make sure to parse biaya_daftar to float
      const dataToSend = {
        ...formData,
        biaya_daftar: parseFloat(formData.biaya_daftar) || 0,
      };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to process beasiswa data.');
      }
      beasiswaResponse = await res.json();
      toast.success(`Beasiswa data ${isEditMode ? 'updated' : 'created'}.`);

    } catch (err) {
      toast.error(`Error: ${err.message}`);
      return; // Stop if step 1 fails
    }

    // Step 2: Upload Poster if it exists
    if (poster) {
      try {
        const beasiswaId = beasiswaResponse.id;
        const posterFormData = new FormData();
        posterFormData.append('poster', poster);

        const posterRes = await fetch(API.beasiswas.poster(beasiswaId), {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: posterFormData
        });

        if (!posterRes.ok) {
          const errorData = await posterRes.json();
          throw new Error(errorData.message || 'Failed to upload poster.');
        }
        toast.success('Poster uploaded successfully.');

      } catch (err) {
        toast.error(`Poster Upload Error: ${err.message}`);
      }
    }

    // Final Step: Close modal and refresh list
    handleCloseBeasiswaModal();
    fetchBeasiswas();
  };

  // Search and Pagination Logic
  const ITEMS_PER_PAGE = 7;
  const filteredBeasiswas = beasiswas.filter(item =>
    Object.values(item).some(val =>
      String(val).toLowerCase().includes(beasiswaSearch.toLowerCase())
    )
  );
  const totalBeasiswaPages = Math.ceil(filteredBeasiswas.length / ITEMS_PER_PAGE);
  const paginatedBeasiswas = filteredBeasiswas.slice(
    (beasiswasPage - 1) * ITEMS_PER_PAGE,
    beasiswasPage * ITEMS_PER_PAGE
  );

  if (loading) return <p>Loading beasiswas...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;

  return (
    <>
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
        <BeasiswaTable
          beasiswas={paginatedBeasiswas}
          onEdit={handleBeasiswaEdit}
          onDelete={handleBeasiswaDelete}
        />
        <PaginationControls
          currentPage={beasiswasPage}
          totalPages={totalBeasiswaPages}
          onPageChange={setBeasiswasPage}
        />
      </div>

      <BeasiswaFormModal
        isOpen={isBeasiswaModalOpen}
        onClose={handleCloseBeasiswaModal}
        onSubmit={handleBeasiswaFormSubmit}
        initialData={editingBeasiswa}
      />
    </>
  );
}
