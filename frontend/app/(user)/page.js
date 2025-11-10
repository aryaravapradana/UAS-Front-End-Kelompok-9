'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from "./page.module.css";
import Header from "./components/Header";
import Link from 'next/link';
import Image from 'next/image';
import { useTransition } from './context/TransitionContext';
import FadeInOnScroll from './components/FadeInOnScroll';

export default function Home() {
  const [successMessage, setSuccessMessage] = useState('');
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const searchParams = useSearchParams();
  const { endTransition } = useTransition();

  useEffect(() => {
    endTransition();
    const message = searchParams.get('message');
    if (message === 'login-success') {
      setSuccessMessage('Login berhasil! Selamat datang di UCCD.');
      setIsMessageVisible(true);
      setTimeout(() => setIsMessageVisible(false), 3000);
    }

    // Check for token to determine login status
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [searchParams, endTransition]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <main className={styles.main}>
      {successMessage && (
        <div className={`${styles.successToast} ${isMessageVisible ? styles.fadeIn : styles.fadeOut}`}>
          <i className="fas fa-check-circle me-2"></i>
          {successMessage}
        </div>
      )}

      <Header />

      <section className={styles.heroSection}>
        <div className="container" style={{ position: 'relative', zIndex: 3 }}>
          <div className="row justify-content-center">
            <div className="col-12 col-xl-10">
              <div className="text-center">
                <FadeInOnScroll>
                  <h1 className={styles.heroTitle}>
                    Empowering FTI Students<br />
                    Through Technology & Innovation
                  </h1>
                </FadeInOnScroll>
                <FadeInOnScroll>
                  <p className={styles.heroSubtext}>
                    The official platform for sharing insights, learning and growing in the world of technology
                  </p>
                </FadeInOnScroll>
                <FadeInOnScroll>
                  <button className={styles.btnExplore}>
                    <span>Explore Now</span>
                  </button>
                </FadeInOnScroll>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.uccdSection}>
        <div className="container">
          <div className="row align-items-center">
            <div className={`col-lg-6 col-md-12 ${styles.textBlock}`}>
              <FadeInOnScroll>
                <h2 className={styles.sectionTitle}>
                  Untar Computer<br />Club Development
                </h2>
                <p className={styles.sectionText}>
                  UCCD is an organization under the Student Executive Board (BEM) of FTI UNTAR, established to develop
                  academic extracurricular activities, particularly in the field of information technology. Currently,
                  UCCD consists of four main programs: Talks, Bootcamp, Glory, and Info.
                </p>
              </FadeInOnScroll>
            </div>

            <div className={`col-lg-6 col-md-12 text-center ${styles.logoBlock}`}>
              <FadeInOnScroll>
                <div className={styles.logoTilt}>
                  <Image src="/pc-homepage.png" alt="UCCD Logo" width={520} height={520} className={styles.uccdLogo} style={{ objectFit: "contain" }} />
                </div>
              </FadeInOnScroll>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.featuresSection}>
        <div className="container text-center">
          <div className="mb-5">
            <FadeInOnScroll>
              <div className={styles.titleWrapper} style={{ '--line-left-offset': '-140px', '--line-left-length': '130px', '--line-right-offset': '-140px', '--line-right-length': '130px' }}>
                <span className={`${styles.dot} ${styles.dotLeft}`}></span>
                <h2 className={styles.featuresTitle}>Whats in it for you?</h2>
                <span className={`${styles.dot} ${styles.dotRight}`}></span>
              </div>
              <p className={styles.featuresSubtext}>Gain the information you need to level up your skills here</p>
            </FadeInOnScroll>
          </div>

          <div className="row gy-4 justify-content-center">
            <div className="col-lg-3 col-md-6">
              <FadeInOnScroll>
                <Link href="/bootcamp" className={`${styles.featureCard} ${styles.bootcampCard} shadow-sm h-100`}>
                  <Image src="/bootcamp.png" width={64} height={64} alt="Bootcamp" className={styles.featureImg} />
                  <h3>BOOTCAMP</h3>
                  <p>Intensive training programs designed to enhance technical skills and knowledge in various tech domains.</p>
                </Link>
              </FadeInOnScroll>
            </div>

            <div className="col-lg-3 col-md-6">
              <FadeInOnScroll>
                <Link href="/info" className={`${styles.featureCard} ${styles.infoCard} shadow-sm h-100`}>
                  <Image src="/info.png" width={64} height={64} alt="Info" className={styles.featureImg} />
                  <h3>INFO</h3>
                  <p>Updates on tech competitions and scholarships to support student growth.</p>
                </Link>
              </FadeInOnScroll>
            </div>

            <div className="col-lg-3 col-md-6">
              <FadeInOnScroll>
                <Link href="/talks" className={`${styles.featureCard} ${styles.talksCard} shadow-sm h-100`}>
                  <Image src="/talks.png" width={64} height={64} alt="Talks" className={styles.featureImg} />
                  <h3>TALKS</h3>
                  <p>Talkshows with tech professionals sharing industry insights and career experiences.</p>
                </Link>
              </FadeInOnScroll>
            </div>

            <div className="col-lg-3 col-md-6">
              <FadeInOnScroll>
                <Link href="/glory" className={`${styles.featureCard} ${styles.gloryCard} shadow-sm h-100`}>
                  <Image src="/glory.png" width={64} height={64} alt="Glory" className={styles.featureImg} />
                  <h3>GLORY</h3>
                  <p>Platform to recognize and appreciate outstanding achievements in tech excellence and innovation.</p>
                </Link>
              </FadeInOnScroll>
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
                  <Image src="/uccd-logo@2x.png" alt="UCCD" width={40} height={40} className={styles.footerLogoImg} />
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
                <li className="mb-2"><Link href="/" className={styles.footerLink}>Home</Link></li>
                <li className="mb-2"><Link href="/bootcamp" className={styles.footerLink}>Bootcamp</Link></li>
                
                <li className="mb-2"><Link href="/glory" className={styles.footerLink}>Glory</Link></li>
                <li className="mb-2"><Link href="/talk" className={styles.footerLink}>Talks</Link></li>
                <li className="mb-2"><Link href="/info" className={styles.footerLink}>Info</Link></li>
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
