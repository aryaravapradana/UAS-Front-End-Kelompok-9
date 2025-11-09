'use client';

import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useTransition } from '../context/TransitionContext';
import Link from 'next/link';
import Image from 'next/image';
import styles from './talk.module.css';

async function getTalk() {
  const res = await fetch('http://127.0.0.1:3001/api/talks', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch data from backend');
  }
  return res.json();
}

export default function TalkPage() {
  const [data, setData] = useState(null);
  const { endTransition } = useTransition();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const talkData = await getTalk();
        setData(talkData);
      } catch (error) {
        console.error(error);
      } finally {
        endTransition();
      }
    };
    fetchData();
  }, [endTransition]);

  return (
    <div className={styles.talksPage}>
      <Header />
      <TalksHeroSection />
      <TalksAboutSection />
      <TalksWhyJoinSection />
      <TalksCollaborationSection data={data} />
      <WhatsInItForYouSection />
      <AppFooter />
    </div>
  );
}

function TalksHeroSection() {
  return (
    <section className={styles.talksHeroSection}>
      <div className="container">
        <div className="row align-items-center min-vh-100">
          <div className="col-lg-12">
            <div className={styles.talksHeroContent}>
              <h1 className={styles.talksHeroTitle}>
                Where Ideas<br />
                Meet Inspiration
              </h1>
              <p className={styles.talksHeroDescription}>
                A series of interactive talkshows featuring professionals and experts
                from the tech industry sharing insights, experiences, and real-world
                perspectives to inspire the next generation of innovators.
              </p>
              <div className={styles.talksHeroButtons}>
                <button className={styles.talksBtnRegister}>Register Now</button>
                <button className={styles.talksBtnExplore}>Explore Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TalksAboutSection() {
  return (
    <section className={styles.talksAboutSection}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className={styles.talksAboutImagesContainer}>
              <div className={styles.talksMainImageFrame}>
                <Image 
                  src="/glory.png" 
                  alt="Speaker presenting at UCCD Talks"
                  width={760}
                  height={760}
                  style={{ objectFit: 'cover' }}
                />
              </div>
              
              <div className={styles.talksOverlayImage}>
                <Image 
                  src="/talks.png" 
                  alt="Audience at UCCD Talks"
                  width={340}
                  height={320}
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className={styles.talksAboutContent}>
              <h2 className={styles.talksAboutTitle}>
                What's UCCD Talks<br />
                All About?
              </h2>
              <p className={styles.talksAboutText}>
                UCCD Talks is a <strong>mini-seminar</strong> and <strong>talkshow</strong> series
                designed to connect students with professionals from
                various fields of technology. Through these sessions,
                participants gain valuable knowledge about current trends,
                career paths, and the realities of working in the tech industry.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TalksWhyJoinSection() {
  return (
    <section className={styles.talksWhyJoinSection}>
      <div className="container">
        <div className="text-center">
          <h2 className={styles.talksWhyTitle}>Here's Why You Should Join</h2>
          <p className={styles.talksWhySubtitle}>
            UCCD Talks gives you the opportunity to learn directly from industry professionals who share not just
            theories, but real stories and experiences.
          </p>
        </div>
        
        <div className={styles.talksWhyContent}>
          <div className={styles.talksWhyCardsContainer}>
            <div className={styles.talksWhyCardsLeft}>
              <div className={styles.talksFeatureBox}>
                <h4>Direct insights from tech professionals and innovators</h4>
              </div>
              <div className={styles.talksFeatureBox}>
                <h4>Networking with speakers and fellow students</h4>
              </div>
            </div>
            
            <div className={styles.talksWhyCardsRight}>
              <div className={styles.talksFeatureBox}>
                <h4>Updated knowledge about the latest technology trends</h4>
              </div>
              <div className={styles.talksFeatureBox}>
                <h4>Free access to all sessions for FTI UNTAR students</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TalksCollaborationSection({ data }) {
  return (
    <section className={styles.talksCollaborationSection}>
      <div className="container">
        <div className="text-center mb-5">
          <h2 className={styles.talksCollabTitle}>
            Where Collaboration<br />
            Meets <span className={styles.talksItalic}>Inspiration</span>
          </h2>
          <p className={styles.talksCollabSubtitle}>
            At UCCD Talks, we believe that growth begins with connection.
          </p>
          
          <div className={styles.talksCollabTabs}>
            <button className={styles.talksTabBtn}>Completed</button>
            <button className={`${styles.talksTabBtn} ${styles.talksTabActive}`}>Coming Soon</button>
          </div>
        </div>

        <div className="row g-4">
          {data && data.slice(0, 3).map((talk) => (
            <div key={`talk-${talk.id}`} className="col-lg-4 col-md-6">
              <div className={styles.talkCard}>
                <div className={styles.talkCardImage}>
                  <Image 
                    src={talk.posterUrl || '/talk/about.png'} 
                    alt={talk.nama_seminar || 'UCCD Talk'}
                    width={400}
                    height={300}
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className={styles.talkCardContent}>
                  <h3 className={styles.talkCardTitle}>{talk.nama_seminar}</h3>
                  <p className={styles.talkCardDesc}>{talk.deskripsi || 'Breaking Into Action: Transforming Work, Business Models, and Customer Journeys'}</p>
                  
                  <div className={styles.talkCardInfo}>
                    <div className={styles.talkCardInfoItem}>
                      <i className="far fa-clock"></i>
                      <span>{new Date(talk.tanggal_pelaksanaan).toLocaleTimeString('id-ID', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: false 
                      })}</span>
                    </div>
                    <div className={styles.talkCardInfoItem}>
                      <i className="far fa-calendar"></i>
                      <span>{new Date(talk.tanggal_pelaksanaan).toLocaleDateString('id-ID', { 
                        day: 'numeric', 
                        month: 'long',
                        year: 'numeric'
                      }).replace(' ', ' ')}, {new Date(talk.tanggal_pelaksanaan).toLocaleDateString('en-US', { weekday: 'long' })}</span>
                    </div>
                    <div className={styles.talkCardInfoItem}>
                      <i className="fas fa-map-marker-alt"></i>
                      <span>{talk.lokasi || 'Ruang Seminar Lt. 11, Gedung R - Universitas Tarumanagara'}</span>
                    </div>
                  </div>
                  
                  <button className={styles.talkCardBtn}>See Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhatsInItForYouSection() {
  return (
    <section className={styles.featuresSection}>
      <div className="container text-center">
        <div className="mb-5">
          <div className={styles.titleWrapper} style={{ '--line-left-offset': '-140px', '--line-left-length': '130px', '--line-right-offset': '-140px', '--line-right-length': '130px' }}>
            <span className={`${styles.dot} ${styles.dotLeft}`}></span>
            <h2 className={styles.featuresTitle}>Get To Know More</h2>
            <span className={`${styles.dot} ${styles.dotRight}`}></span>
          </div>
          <p className={styles.featuresSubtext}>Gain the information you need to level up your skills here</p>
        </div>

        <div className="row gy-4 justify-content-center">
          <div className="col-lg-3 col-md-6" key="bootcamp-col">
            <Link href="/bootcamp" className={`${styles.featureCard} ${styles.bootcampCard} shadow-sm h-100`}>
              <Image src="/bootcamp.png" width={64} height={64} alt="Bootcamp" className={styles.featureImg} />
              <h3>BOOTCAMP</h3>
              <p>Intensive training programs designed to enhance technical skills and knowledge in various tech domains.</p>
            </Link>
          </div>

          <div className="col-lg-3 col-md-6" key="info-col">
            <Link href="/info" className={`${styles.featureCard} ${styles.infoCard} shadow-sm h-100`}>
              <Image src="/info.png" width={64} height={64} alt="Info" className={styles.featureImg} />
              <h3>INFO</h3>
              <p>Updates on tech competitions and scholarships to support student growth.</p>
            </Link>
          </div>

          <div className="col-lg-3 col-md-6" key="glory-col">
            <Link href="/glory" className={`${styles.featureCard} ${styles.gloryCard} shadow-sm h-100`}>
              <Image src="/glory.png" width={64} height={64} alt="Glory" className={styles.featureImg} />
              <h3>GLORY</h3>
              <p>Platform to recognize and appreciate outstanding achievements in tech excellence and innovation.</p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function AppFooter() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerContent}>
          {/* Left Column - UCCD Description */}
          <div className={styles.footerLeft}>
            <div className={styles.footerLogoWrapper}>
              <div className={styles.footerLogo}>
                <Image src="/uccd-logo@2x.png" alt="UCCD" width={50} height={50} className={styles.footerLogoImg} unoptimized />
              </div>
              <div>
                <div className={styles.footerLogoText}>UCCD</div>
                <div className={styles.footerLogoSubtext}>
                  UNTAR COMPUTER<br />
                  CLUB DEVELOPMENT
                </div>
              </div>
            </div>
            <p className={styles.footerDescription}>
              UCCD is a student organization under BEM FTI UNTAR focused on developing IT-related academic and extracurricular programs.
            </p>
          </div>

          {/* Middle Column - Contact */}
          <div className={styles.footerMiddle}>
            <h4 className={styles.footerTitle}>Contact</h4>
            <a href="mailto:uccd@untar.ac.id" className={styles.footerLink}>
              <i className="fas fa-envelope me-2"></i>
              uccd@untar.ac.id
            </a>
            <a
              href="https://www.instagram.com/uccdfti.untar?igsh=MW00ZjJtZmJpMTEwMQ=="
              className={`${styles.footerLink} ${styles.instagramLink}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className={`fab fa-instagram ${styles.instagramIcon}`}></i>
              @uccdfti.untar
            </a>
          </div>
          
          {/* Right Column - About */}
          <div className={styles.footerRight}>
            <h4 className={styles.footerTitle}>About</h4>
            <Link href="/" className={styles.footerLink}>Home</Link>
            <Link href="/bootcamp" className={styles.footerLink}>Bootcamp</Link>
            <Link href="/glory" className={styles.footerLink}>Glory</Link>
            <Link href="/talks" className={styles.footerLink}>Talks</Link>
            <Link href="/info" className={styles.footerLink}>Info</Link>
          </div>
        </div>

        {/* Copyright */}
        <p className={styles.footerCopyright}>
          © 2025 UCCD - Untar Computer Club Development. All rights reserved.
        </p>
      </div>
    </footer>
  );
}