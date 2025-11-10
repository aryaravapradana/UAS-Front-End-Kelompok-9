'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from "./page.module.css";
import Header from "./components/Header";
import Link from 'next/link';
import Image from 'next/image';
import { useTransition } from './context/TransitionContext';
import FadeInOnScroll from './components/FadeInOnScroll';
import { useAuth } from './context/AuthContext';

export default function Home() {
  const [successMessage, setSuccessMessage] = useState('');
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const searchParams = useSearchParams();
  const { endTransition } = useTransition();
  const { logout } = useAuth();

  useEffect(() => {
    endTransition();
    const message = searchParams.get('message');
    if (message === 'login-success') {
      setSuccessMessage('Login berhasil! Selamat datang di UCCD.');
      setIsMessageVisible(true);
      setTimeout(() => setIsMessageVisible(false), 3000);
    }
  }, [searchParams, endTransition]);

  const handleLogout = () => {
    logout();
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

          <div className={`row gy-4 gx-5 justify-content-center ${styles.featureCardsContainer}`}>
            <div className="col-lg-3 col-md-6">
              <FadeInOnScroll>
                <Link href="/bootcamp" className={`${styles.featureCard} ${styles.bootcampCard} shadow-sm`}>
                  <Image src="/bootcamp.png" width={64} height={64} alt="Bootcamp" className={styles.featureImg} />
                  <h3>BOOTCAMP</h3>
                  <p>Intensive training programs designed to enhance technical skills and knowledge in various tech domains.</p>
                </Link>
              </FadeInOnScroll>
            </div>

            <div className="col-lg-3 col-md-6">
              <FadeInOnScroll>
                <Link href="/info" className={`${styles.featureCard} ${styles.infoCard} shadow-sm`}>
                  <Image src="/info.png" width={64} height={64} alt="Info" className={styles.featureImg} />
                  <h3>INFO</h3>
                  <p>Updates on tech competitions and scholarships to support student growth.</p>
                </Link>
              </FadeInOnScroll>
            </div>

            <div className="col-lg-3 col-md-6">
              <FadeInOnScroll>
                <Link href="/talks" className={`${styles.featureCard} ${styles.talksCard} shadow-sm`}>
                  <Image src="/talks.png" width={64} height={64} alt="Talks" className={styles.featureImg} />
                  <h3>TALKS</h3>
                  <p>Talkshows with tech professionals sharing industry insights and career experiences.</p>
                </Link>
              </FadeInOnScroll>
            </div>

            <div className="col-lg-3 col-md-6">
              <FadeInOnScroll>
                <Link href="/glory" className={`${styles.featureCard} ${styles.gloryCard} shadow-sm`}>
                  <Image src="/glory.png" width={64} height={64} alt="Glory" className={styles.featureImg} />
                  <h3>GLORY</h3>
                  <p>Platform to recognize and appreciate outstanding achievements in tech excellence and innovation.</p>
                </Link>
              </FadeInOnScroll>
            </div>
          </div>
        </div>
      </section>

      <AppFooter />
    </main>
  );
}

function AppFooter() {
  return (
    <footer className={styles.infoFooter}>
      <div className="container">
        <div className={styles.infoFooterContent}>
          <div className={styles.infoFooterLeft}>
            <div className={styles.infoFooterLogoWrapper}>
              <div className={styles.infoFooterLogo}>
                <Image src="/uccd-logo@2x.png" alt="UCCD" width={50} height={50} className={styles.infoFooterLogoImg} unoptimized />
              </div>
              <div>
                <div className={styles.infoFooterLogoText}>UCCD</div>
                <div className={styles.infoFooterLogoSubtext}>
                  UNTAR COMPUTER<br />
                  CLUB DEVELOPMENT
                </div>
              </div>
            </div>
            <p className={styles.infoFooterDescription}>
              UCCD is a student organization under BEM FTI UNTAR focused on developing IT-related academic and extracurricular programs.
            </p>
          </div>

          <div className={styles.infoFooterMiddle}>
            <h4 className={styles.infoFooterTitle}>Contact</h4>
            <a href="mailto:uccd@untar.ac.id" className={styles.infoFooterLink}>
              <i className="fas fa-envelope me-2"></i>
              uccd@untar.ac.id
            </a>
            <a
              href="https://www.instagram.com/uccdfti.untar?igsh=MW00ZjJtZmJpMTEwMQ=="
              className={`${styles.infoFooterLink} ${styles.infoInstagramLink}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className={`fab fa-instagram ${styles.infoInstagramIcon}`}></i>
              @uccdfti.untar
            </a>
          </div>
          
          <div className={styles.infoFooterRight}>
            <h4 className={styles.infoFooterTitle}>About</h4>
            <Link href="/" className={styles.infoFooterLink}>Home</Link>
            <Link href="/bootcamp" className={styles.infoFooterLink}>Bootcamp</Link>
            <Link href="/glory" className={styles.infoFooterLink}>Glory</Link>
            <Link href="/talk" className={styles.infoFooterLink}>Talks</Link>
            <Link href="/info" className={styles.infoFooterLink}>Info</Link>
          </div>
        </div>

        <p className={styles.infoFooterCopyright}>
          © 2025 UCCD - Untar Computer Club Development. All rights reserved.
        </p>
      </div>
    </footer>
  );
}