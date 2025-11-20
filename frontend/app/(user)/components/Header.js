'use client';

import React, { useState, useEffect, useRef } from 'react';
import TransitionLink from './TransitionLink';
import Image from 'next/image';
import styles from './Header.module.css';
import LoginButton from './LoginButton';
import ProfileButton from './ProfileButton';
import NotificationDropdown from './NotificationDropdown'; // Import the new component
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { isLoggedIn, loading } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <header className={styles.navbar}>
      <div className="container d-flex justify-content-between align-items-center">
        <TransitionLink href="/" className="d-flex align-items-center text-decoration-none">
          <div className={styles.logoContainer}>
            <Image
              src="/uccd-logo@2x.png"
              alt="UCCD Logo"
              width={70}
              height={70}
              className={styles.logo3D}
            />
          </div>
          <span className={styles.logoText}>UCCD</span>
        </TransitionLink>
        <nav className="d-none d-lg-flex align-items-center gap-4">
          <TransitionLink href="/" className={styles.navLink}>Home</TransitionLink>
          <TransitionLink href="/bootcamp" className={styles.navLink}>Bootcamp</TransitionLink>
          <TransitionLink href="/info" className={styles.navLink}>Info</TransitionLink>
          <TransitionLink href="/talk" className={styles.navLink}>Talks</TransitionLink>
          <TransitionLink href="/glory" className={styles.navLink}>Glory</TransitionLink>
          <TransitionLink href="/dashboard" className={styles.navLink}>Dashboard</TransitionLink>
        </nav>
        <div className="d-flex align-items-center gap-3">
          {!loading && (
            <>
              {isLoggedIn && (
                <div className={styles.notificationWrapper} ref={dropdownRef}>
                  <button onClick={toggleDropdown} className={styles.notificationBell}>
                    <i className="fas fa-bell"></i>
                  </button>
                  {isDropdownOpen && <NotificationDropdown />}
                </div>
              )}
              {!isLoggedIn && <LoginButton />}
              {isLoggedIn && <ProfileButton />}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;