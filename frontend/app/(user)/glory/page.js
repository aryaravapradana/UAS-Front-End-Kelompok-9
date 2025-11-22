'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../components/Header';
import styles from './glory.module.css';
import { useTransition } from '../context/TransitionContext';
import FadeInOnScroll from '../components/FadeInOnScroll';
import API from '@/lib/api';

export default function GloryPage() {
  const { endTransition } = useTransition();

  useEffect(() => {
    endTransition();
  }, [endTransition]);

  return (
    <div className={styles.gloryPage}>
      <Header />
      <FadeInOnScroll>
        <HeroSection />
      </FadeInOnScroll>
      <FadeInOnScroll>
        <WhatIsSection />
      </FadeInOnScroll>
      <FadeInOnScroll>
        <HallOfAchievementSection />
      </FadeInOnScroll>
      <FadeInOnScroll>
        <NewBlackSection />
      </FadeInOnScroll>
      <FadeInOnScroll>
        <GloryKnowMoreSection />
      </FadeInOnScroll>
      <AppFooter />
    </div>
  );
}

function HeroSection() {
  return (
    <section className={styles.heroSection} style={{backgroundImage: "url('/glory/hero.png')"}}>
      <div className={styles.heroContent}>
        <div className={styles.heroText}>
          <h1>
            Celebrating Achievements
            <br />
            that Inspire
          </h1>
          <p>
            UCCD Glory honors the outstanding accomplishments of FTI UNTAR students in academic and technology competitions.
          </p>
        </div>
      </div>
    </section>
  );
}

function WhatIsSection() {
  return (
    <section className={styles.whatIsSection} style={{backgroundImage: "url('/glory/about.png')"}}>
      <div className={styles.container}>
        <div className={styles.whatIsContent}>
          <div className={styles.whatIsText}>
            <h2>What is<br />UCCD Glory?</h2>
            <p>
              UCCD Glory is a platform to <strong>recognize and appreciate</strong> the outstanding achievements of FTI UNTAR students in academic and technology competitions. It serves as a hall of fame to celebrate their success and inspire other students.
            </p>
          </div>
          <div className={styles.whatIsImage}>
            <Image
              src="/glory/hall.png"
              alt="Glory Hall of Achievement"
              width={550}
              height={400}
              className={styles.bootcampImg}
              quality={100}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function HallOfAchievementSection() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const res = await fetch(API.lombas.list());
        if (!res.ok) {
          throw new Error('Failed to fetch achievements');
        }
        const data = await res.json();
        // Filter for competitions that have a winner
        const winningLombas = data.filter(lomba => lomba.pemenang);
        setAchievements(winningLombas);
      } catch (error) {
        console.error("Error fetching achievements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  return (
    <section className={styles.hallOfAchievementSection}>
      <div className="container text-center">
        <div className={styles.titleWrapper} style={{ '--line-left-offset': '-140px', '--line-left-length': '140px', '--line-right-offset': '-140px', '--line-right-length': '140px' }}>
          <span className={`${styles.dot} ${styles.dotLeft}`}></span>
          <h2 className={styles.sectionTitle}>Hall of Achievement</h2>
          <span className={`${styles.dot} ${styles.dotRight}`}></span>
        </div>
        <p className={styles.sectionSubtitle}>Celebrating the champions who have demonstrated exceptional skill and dedication.</p>

        <div className={styles.achievementGrid}>
          {loading ? (
            <p>Loading achievements...</p>
          ) : achievements.length > 0 ? (
            achievements.map((lomba) => (
              <div key={lomba.id} className={styles.achievementCard}>
                <div className={styles.achievementImageWrapper}>
                  <Image
                    src={lomba.posterUrl || '/glory/champion1.png'}
                    alt={lomba.nama_lomba}
                    fill
                    className={styles.achievementImg}
                    style={{ objectFit: 'cover' }}
                  />
                   <div className={styles.championOverlay}>
                      <span className={styles.championBadge}>CHAMPION</span>
                    </div>
                </div>
                <div className={styles.achievementInfo}>
                  <h3 className={styles.achievementTitle}>{lomba.nama_lomba}</h3>
                  <div className={styles.winnerInfo}>
                    <Image 
                      src={lomba.pemenang.profilePictureUrl || '/default-profile.png'} 
                      alt={lomba.pemenang.nama_lengkap}
                      width={32}
                      height={32}
                      className={styles.winnerAvatar}
                    />
                    <div className={styles.winnerText}>
                      <span className={styles.winnerName}>{lomba.pemenang.nama_lengkap}</span>
                      <span className={styles.winnerNim}>{lomba.pemenang.nim}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No champions to display at the moment.</p>
          )}
        </div>
      </div>
    </section>
  );
}

function NewBlackSection() {
  return (
    <section className={styles.newBlackSection}>
      <div className="container">
        {/* This is the new black section. Content can be added here later. */}
      </div>
    </section>
  );
}

function GloryKnowMoreSection() {
  return (
    <section className={styles.gloryKnowMoreSection}>
      <div className="container text-center">
        <div className="mb-5">
          <div className={styles.bootcampTitleWrapper} style={{ '--line-left-offset': '-140px', '--line-left-length': '130px', '--line-right-offset': '-140px', '--line-right-length': '130px' }}>
            <span className={`${styles.bootcampDot} ${styles.bootcampDotLeft}`}></span>
            <h2 className={styles.bootcampFeaturesTitle}>Get To Know More</h2>
            <span className={`${styles.bootcampDot} ${styles.bootcampDotRight}`}></span>
          </div>
          <p className={styles.bootcampFeaturesSubtext}>Gain the information you need to level up your skills here</p>
        </div>

        <div className={`row gy-4 justify-content-center ${styles.featureCardsContainer}`}>
          <div className="col-lg-4 col-md-6">
            <Link href="/info" className={`${styles.featureCard} ${styles.infoCard} shadow-sm`}>
              <Image src="/info.png" width={64} height={64} alt="Info" className={styles.featureImg} />
              <h3>INFO</h3>
              <p>Updates on tech competitions and scholarships to support student growth.</p>
            </Link>
          </div>

          <div className="col-lg-4 col-md-6">
            <Link href="/talk" className={`${styles.featureCard} ${styles.talksCard} shadow-sm`}>
              <Image src="/talks.png" width={64} height={64} alt="Talks" className={styles.featureImg} />
              <h3>TALKS</h3>
              <p>Talkshows with tech professionals sharing industry insights and career experiences.</p>
            </Link>
          </div>

          <div className="col-lg-4 col-md-6">
            <Link href="/bootcamp" className={`${styles.featureCard} ${styles.bootcampCard} shadow-sm`}>
              <Image src="/bootcamp.png" width={64} height={64} alt="Bootcamp" className={styles.featureImg} />
              <h3>BOOTCAMP</h3>
              <p>Intensive training programs designed to enhance technical skills and knowledge in various tech domains.</p>
            </Link>
          </div>
        </div>
      </div>
    </section>
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