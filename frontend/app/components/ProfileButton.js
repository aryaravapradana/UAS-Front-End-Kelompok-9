'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function ProfileButton() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('http://localhost:3001/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          // Token might be expired or invalid
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

  const handleProfileClick = () => {
    router.push('/dashboard');
  };

  if (isLoading) {
    return null; // Or a loading spinner
  }

  if (!user) {
    return null; // Don't render if no user is logged in
  }

  return (
    <button
      onClick={handleProfileClick}
      className="btn btn-info rounded-pill px-3 px-md-4 py-2 fw-semibold shadow-sm d-flex align-items-center gap-2"
      style={{
        background: 'linear-gradient(135deg, #bebebeff 0%, #2a3134ff 100%)',
        border: 'none',
        transition: 'all 0.3s ease',
        fontSize: '0.9rem',
        color: 'white',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(128, 128, 128, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
      }}
    >
      <Image
        src={user.profilePictureUrl || '/default-profile.png'} // Use a default image if none
        alt="Profile"
        width={30}
        height={30}
        style={{
          borderRadius: '50%',
          objectFit: 'cover',
          marginRight: '8px',
        }}
      />
      <span>{user.nama_lengkap}</span>
    </button>
  );
}
