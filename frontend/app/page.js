'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from "./page.module.css";
import LoginButton from "./components/LoginButton";

export default function Home() {
  const [successMessage, setSuccessMessage] = useState('');
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const message = searchParams.get('message');
    if (message === 'login-success') {
      setSuccessMessage('Login berhasil! Selamat datang di UCCD.');
      setIsMessageVisible(true);
      setTimeout(() => setIsMessageVisible(false), 3000);
    }

    const fetchUser = async () => {
      try {
        const response = await fetch('http://192.168.1.14:3000/auth/user', {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [searchParams]);

  const handleLogout = async () => {
    try {
      await fetch('http://192.168.1.14:3000/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <main className={styles.main}>
      {successMessage && (
        <div className={`${styles.successToast} ${isMessageVisible ? styles.fadeIn : styles.fadeOut}`}>
          <i className="fas fa-check-circle me-2"></i>
          {successMessage}
        </div>
      )}

      <nav className={styles.navbar}>
        <div className="container-fluid px-4 px-lg-5">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3" style={{ cursor: 'pointer' }} onClick={() => router.push('/')}>
              <div className={styles.logoContainer}>
                <img src="/uccd-logo@2x.png" alt="UCCD" className={styles.logo3D} />
              </div>
              <span className={styles.logoText}>UCCD</span>
            </div>

            <div className="d-none d-lg-flex gap-4 align-items-center">
              <a href="/home" className={styles.navLink}>Home</a>
              <a href="/bootcamp" className={styles.navLink}>Bootcamp</a>
              <a href="/insight" className={styles.navLink}>Insight</a>
              <a href="/glory" className={styles.navLink}>Glory</a>
              <a href="/talks" className={styles.navLink}>Talks</a>
              <a href="/info" className={styles.navLink}>Info</a>
            </div>

            <div className="d-flex align-items-center gap-3">
              {user ? (
                <>
                  <span className="text-white d-none d-md-inline" style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.95rem', fontWeight: '400' }}>
                    Halo, {user.nama_lengkap}
                  </span>
                  <button onClick={handleLogout} className={styles.btnPrimary}>Logout</button>
                </>
              ) : (
                <>
                  <button className={`${styles.btnOutline} d-none d-md-block`}>Get Started</button>
                  <LoginButton />
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <section className={styles.heroSection}>
        <div className="container" style={{ position: 'relative', zIndex: 3 }}>
          <div className="row justify-content-center">
            <div className="col-12 col-xl-10">
              <div className="text-center">
                <h1 className={styles.heroTitle}>
                  Empowering FTI Students<br />
                  Through Technology & Innovation
                </h1>
                <p className={styles.heroSubtext}>
                  The official platform for sharing insights, learning and growing in the world of technology
                </p>
                <button className={styles.btnExplore}>
                  <span>Explore Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.uccdSection}>
        <div className="container">
          <div className="row align-items-center">
            <div className={`col-lg-6 col-md-12 ${styles.textBlock}`}>
              <h2 className={styles.sectionTitle}>
                Untar Computer<br />Club Development
              </h2>
              <p className={styles.sectionText}>
                UCCD is an organization under the Student Executive Board (BEM) of FTI UNTAR, established to develop
                academic extracurricular activities, particularly in the field of information technology. Currently,
                UCCD consists of five main programs: Insight, Talks, Bootcamp, Glory, and Info.
              </p>
            </div>

            <div className={`col-lg-6 col-md-12 text-center ${styles.logoBlock}`}>
              <div className={styles.logoTilt}>
                <img src="/pc-homepage.png" alt="UCCD Logo" className={styles.uccdLogo} width={520} height={520} style={{ objectFit: "contain" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.featuresSection}>
        <div className="container text-center">
          <div className="mb-5">
            <div className={styles.titleWrapper} style={{ '--line-left-offset': '-140px', '--line-left-length': '130px', '--line-right-offset': '-140px', '--line-right-length': '130px' }}>
              <span className={`${styles.dot} ${styles.dotLeft}`}></span>
              <h2 className={styles.featuresTitle}>Whats in it for you?</h2>
              <span className={`${styles.dot} ${styles.dotRight}`}></span>
            </div>
            <p className={styles.featuresSubtext}>Gain the information you need to level up your skills here</p>
          </div>

          <div className="row gy-4 justify-content-center" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="col-lg-4 col-md-6">
              <div className={`${styles.featureCard} shadow-sm`} onClick={() => router.push('/bootcamp')}>
                <img src="/bootcamp.png" width={64} height={64} alt="Bootcamp" className={styles.featureImg} />
                <h3>BOOTCAMP</h3>
                <p>Intensive training programs designed to enhance technical skills and knowledge in various tech domains.</p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className={`${styles.featureCard} shadow-sm`} onClick={() => router.push('/insight')}>
                <img src="/insight.png" width={64} height={64} alt="Insight" className={styles.featureImg} />
                <h3>INSIGHT</h3>
                <p>Articles and discussions on current issues in technology and digital developments.</p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className={`${styles.featureCard} shadow-sm`} onClick={() => router.push('/glory')}>
                <img src="/glory.png" width={64} height={64} alt="Glory" className={styles.featureImg} />
                <h3>GLORY</h3>
                <p>Platform to recognize and appreciate outstanding achievements in tech excellence and innovation.</p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className={`${styles.featureCard} shadow-sm`} onClick={() => router.push('/info')}>
                <img src="/info.png" width={64} height={64} alt="Info" className={styles.featureImg} />
                <h3>INFO</h3>
                <p>Updates on tech competitions and scholarships to support student growth.</p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className={`${styles.featureCard} shadow-sm`} onClick={() => router.push('/talks')}>
                <img src="/talks.png" width={64} height={64} alt="Talks" className={styles.featureImg} />
                <h3>TALKS</h3>
                <p>Talkshows with tech professionals sharing industry insights and career experiences.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-4 col-md-6">
              <div className="d-flex align-items-start gap-3 mb-3">
                <div className={styles.footerLogo}>
                  <img src="/uccd-logo@2x.png" alt="UCCD" className={styles.footerLogoImg} />
                </div>
                <div>
                  <span className={styles.footerLogoText}>UCCD</span>
                  <p className="mb-0" style={{ fontSize: '0.80rem', color: '#000000ff', marginTop: '0.25rem', lineHeight: '1' }}>
                    Untar Computer<br />Club Development
                  </p>
                </div>
              </div>
              <p className={styles.footerText}>
                UCCD is a student organization under BEM FTI UNTAR focused on developing IT-related academic and extracurricular programs.
              </p>
            </div>

            <div className="col-lg-4 col-md-3">
              <h4 className={styles.footerTitle}>Contact</h4>
              <ul className="list-unstyled">
              <li className="mb-3">
                <a href="mailto:uccd@untar.ac.id" className={styles.footerLink}>
                  <i className="fas fa-envelope me-2"></i>
                  uccd@untar.ac.id
                </a>
              </li>
              <li className="mb-3">
                <a
                  href="https://www.instagram.com/uccdfti.untar?igsh=MW00ZjJtZmJpMTEwMQ=="
                  className={`${styles.footerLink} ${styles.instagramLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className={`fab fa-instagram ${styles.instagramIcon} me-2`}></i>
                  @uccdfti.untar
                </a>
              </li>
            </ul>
            </div>
            
            <div className="col-lg-4 col-md-3">
              <h4 className={styles.footerTitle}>About</h4>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="/home" className={styles.footerLink}>Home</a></li>
                <li className="mb-2"><a href="/bootcamp" className={styles.footerLink}>Bootcamp</a></li>
                <li className="mb-2"><a href="/insight" className={styles.footerLink}>Insight</a></li>
                <li className="mb-2"><a href="/glory" className={styles.footerLink}>Glory</a></li>
                <li className="mb-2"><a href="/talks" className={styles.footerLink}>Talks</a></li>
                <li className="mb-2"><a href="/info" className={styles.footerLink}>Info</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="text-center">
            <p className={styles.footerCopyright}>
              © 2025 UCCD - Untar Computer Club Development. All rights reserved.
            </p>
        </div>
      </footer>
    </main>
  );
}