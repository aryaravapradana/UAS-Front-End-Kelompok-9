
'use client';

import React, { useEffect, useState } from 'react';
import TransitionLink from './TransitionLink';
import Image from 'next/image';
import styles from './Header.module.css';
import LoginButton from './LoginButton';
import ProfileButton from './ProfileButton';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

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
          {!isLoggedIn && <LoginButton />}
          {isLoggedIn && <ProfileButton />}
        </div>
      </div>
    </header>
  );
};

export default Header;
