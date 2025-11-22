'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import styles from '../AdminDashboard.module.css';
import MembersTable from '../components/MembersTable';
import MemberFormModal from '../components/MemberFormModal';
import MemberDetailModal from '../components/MemberDetailModal';
import PaginationControls from '../components/PaginationControls';
import API from '@/lib/api';

export default function MembersPage() {
  // States
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal states
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [viewingMemberNIM, setViewingMemberNIM] = useState(null);

  // Pagination and Search states
  const [membersPage, setMembersPage] = useState(1);
  const [memberSearch, setMemberSearch] = useState('');

  // Fetch function
  const fetchMembers = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(API.users.list(), { headers: { 'Authorization': `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed to fetch members.');
      const data = await res.json();
      setMembers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Member Handlers
  const handleViewMemberDetails = (nim) => setViewingMemberNIM(nim);
  const handleCloseMemberDetailModal = () => setViewingMemberNIM(null);
  const handleMemberEdit = (member) => { setEditingMember(member); setIsMemberModalOpen(true); };
  const handleAddNewMember = () => { setEditingMember(null); setIsMemberModalOpen(true); };
  const handleCloseMemberModal = () => { setIsMemberModalOpen(false); setEditingMember(null); };

  const handleMemberDelete = async (nim) => {
    if (window.confirm(`Delete member NIM ${nim}?`)) {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(API.users.detail(nim), { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        if (!res.ok) throw new Error(await res.json().then(d => d.message));
        setMembers(members.filter((m) => m.nim !== nim));
        toast.success('Member deleted.');
      } catch (err) { toast.error(`Error: ${err.message}`); }
    }
  };

  const handleMemberFormSubmit = async (formData) => {
    const token = localStorage.getItem('token');
    const isEditMode = !!editingMember;
    const url = isEditMode ? API.users.update(editingMember.nim) : API.auth.register();
    const method = isEditMode ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, { method, headers: { 'Authorization': `Bearer ${token}` }, body: formData });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to process member.');
      }
      toast.success(`Member ${isEditMode ? 'updated' : 'created'}.`);
      handleCloseMemberModal();
      fetchMembers();
    } catch (err) { toast.error(`Error: ${err.message}`); }
  };

  const handleDeleteMemberEmail = async (nim) => {
    if (window.confirm(`Are you sure you want to delete the email for NIM ${nim}?`)) {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(API.users.email(nim), {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to delete email.');
        }
        toast.success('Member email deleted successfully.');
        fetchMembers();
        if (editingMember && editingMember.nim === nim) {
          setEditingMember(prev => ({ ...prev, email: null }));
        }
      } catch (err) {
        toast.error(`Error: ${err.message}`);
      }
    }
  };

  // Search and Pagination Logic
  const ITEMS_PER_PAGE = 7;
  const filteredMembers = members.filter(item =>
    Object.values(item).some(val =>
      String(val).toLowerCase().includes(memberSearch.toLowerCase())
    )
  );
  const totalMemberPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE);
  const paginatedMembers = filteredMembers.slice(
    (membersPage - 1) * ITEMS_PER_PAGE,
    membersPage * ITEMS_PER_PAGE
  );

  if (loading) return <p>Loading members...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;

  return (
    <>
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
        <MembersTable
          members={paginatedMembers}
          onView={handleViewMemberDetails}
          onEdit={handleMemberEdit}
          onDelete={handleMemberDelete}
        />
        <PaginationControls
          currentPage={membersPage}
          totalPages={totalMemberPages}
          onPageChange={setMembersPage}
        />
      </div>

      {viewingMemberNIM && (
        <MemberDetailModal nim={viewingMemberNIM} onClose={handleCloseMemberDetailModal} />
      )}
      <MemberFormModal
        isOpen={isMemberModalOpen}
        onClose={handleCloseMemberModal}
        onSubmit={handleMemberFormSubmit}
        onDeleteEmail={handleDeleteMemberEmail}
        initialData={editingMember}
      />
    </>
  );
}
