
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';
import LoginButton from './LoginButton';
import ProfileButton from './ProfileButton';

const Header = () => {
  return (
    <header className={styles.navbar}>
      <div className="container d-flex justify-content-between align-items-center">
        <Link href="/" className="d-flex align-items-center text-decoration-none">
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
        </Link>
        <nav className="d-none d-lg-flex align-items-center gap-4">
          <Link href="/" className={styles.navLink}>Home</Link>
          <Link href="/beasiswa" className={styles.navLink}>Beasiswa</Link>
          <Link href="/lomba" className={styles.navLink}>Lomba</Link>
          <Link href="/bootcamp" className={styles.navLink}>Bootcamp</Link>
          <Link href="/talk" className={styles.navLink}>Talks</Link>
          <Link href="/dashboard" className={styles.navLink}>Dashboard</Link>
        </nav>
        <div className="d-flex align-items-center gap-3">
          <LoginButton />
          <ProfileButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
