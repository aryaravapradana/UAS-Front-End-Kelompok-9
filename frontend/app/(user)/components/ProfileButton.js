'use client';

import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './ProfileButton.module.css'; // Using a CSS module for styling
import API from '@/lib/api';

export default function ProfileButton() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(API.profile.get(), {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsDropdownOpen(false);
    router.push('/login');
  };

  if (isLoading) {
    return null; // Or a loading spinner
  }

  if (!user) {
    return null; // Don't render if no user is logged in
  }

  return (
    <div className={styles.profileContainer} ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={styles.profileButton}
      >
        <Image
          src={user.profilePictureUrl || '/default-profile.png'}
          alt="Profile"
          width={30}
          height={30}
          className={styles.profileImage}
        />
        <span>
          {user.nama_lengkap
            ? user.nama_lengkap
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
            : ''}
        </span>
        <i className={`fas fa-chevron-down ${styles.chevron} ${isDropdownOpen ? styles.chevronOpen : ''}`}></i>
      </button>

      {isDropdownOpen && (
        <div className={styles.dropdownMenu}>
          <button
            onClick={() => {
              router.push('/dashboard');
              setIsDropdownOpen(false);
            }}
            className={styles.dropdownItem}
          >
            <i className="fas fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => {
              router.push('/profile/edit');
              setIsDropdownOpen(false);
            }}
            className={styles.dropdownItem}
          >
            <i className="fas fa-envelope"></i> {/* Using an envelope icon for email */}
            <span>Verifikasi Email</span>
          </button>
          <button
            onClick={() => {
              router.push('/profile/edit');
              setIsDropdownOpen(false);
            }}
            className={styles.dropdownItem}
          >
            <i className="fas fa-user-edit"></i>
            <span>Ubah Data</span>
          </button>
          <div className={styles.dropdownDivider}></div>
          <button onClick={handleLogout} className={`${styles.dropdownItem} ${styles.logoutButton}`}>
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}

