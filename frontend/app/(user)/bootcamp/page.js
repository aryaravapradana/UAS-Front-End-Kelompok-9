'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import Image from 'next/image';
import styles from './bootcamp.module.css';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import { useTransition } from '../context/TransitionContext';

export default function BootcampPage() {
  const [activeTrack, setActiveTrack] = useState('complete');
  const { endTransition } = useTransition();

  useEffect(() => {
    endTransition();
  }, [endTransition]);

  return (
    <div className={styles.bootcampPage}>
      <Header />
      <HeroSection />
      <WhatIsSection />
      <ChooseTrackSection activeTrack={activeTrack} setActiveTrack={setActiveTrack} />
      <WhyJoinSection />
      <KnowMoreSection />
      <NewFooter />
    </div>
  );
}

function HeroSection() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroContent}>
        <div className={styles.heroText}>
          <h1>
            A Learning Experience That<br />
            Transforms Potential into Skill
          </h1>
          <p>
            An intensive learning program designed by UCCD to help FTI students gain real-world experience in UI Design, Web Development, and Data Science guided by mentors and industry experts.
          </p>
        </div>
      </div>
    </section>
  );
}

function WhatIsSection() {
  return (
    <section className={styles.whatIsSection}>
      <div className={styles.container}>
        <div className={styles.whatIsContent}>
          <div className={styles.whatIsText}>
            <h2>What is<br />UCCD Bootcamp?</h2>
            <p>
              UCCD Bootcamp is a structured <strong>training program</strong> focusing on hands-on projects and mentorship. Participants are guided through real cases in the tech industry to help them develop both technical and problem-solving skills.
            </p>
          </div>
          <div className={styles.whatIsImage}>
            <Image
              src="/bootcamp/get_to_know_more.png"
              alt="Bootcamp Event"
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

function ChooseTrackSection({ activeTrack, setActiveTrack }) {
  const [bootcamps, setBootcamps] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchBootcamps = async () => {
      try {
        const res = await fetch('/api/bootcamps');
        if (!res.ok) {
          throw new Error('Failed to fetch bootcamps');
        }
        const data = await res.json();
        setBootcamps(data);
      } catch (error) {
        console.error("Error fetching bootcamps:", error);
      }
    };

    fetchBootcamps();
  }, []);

  const handleRegister = async (bootcampId) => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/api/bootcamps/${bootcampId}/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        alert('Successfully registered for the bootcamp!');
        router.push('/dashboard'); // Redirect to dashboard or a relevant page
      } else {
        alert(data.message || 'Registration failed.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('An error occurred during registration.');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <section className={styles.chooseTrackSection}>
      <div className="container text-center">
        <div className={styles.titleWrapper} style={{ '--line-left-offset': '-140px', '--line-left-length': '140px', '--line-right-offset': '-140px', '--line-right-length': '140px' }}>
          <span className={`${styles.dot} ${styles.dotLeft}`}></span>
          <h2 className={styles.sectionTitle}>Choose Your Track</h2>
          <span className={`${styles.dot} ${styles.dotRight}`}></span>
        </div>
        <p className={styles.sectionSubtitle}>Choose the path that matches your passion and start mastering the digital skills of tomorrow.</p>

        <div className={styles.trackFilter}>
        <button
          className={activeTrack === 'upcoming' ? styles.active : ''}
          onClick={() => setActiveTrack('upcoming')}
        >
          Coming Soon
        </button>
        <button
          className={activeTrack === 'complete' ? styles.active : ''}
          onClick={() => setActiveTrack('complete')}
        >
          Completed
        </button>
      </div>

        <div className={styles.trackCards}>
          {bootcamps.map((bootcamp) => (
            <div key={bootcamp.id} className={styles.trackCard}>
              <div className={styles.trackImage}>
                <Image
                  src={bootcamp.posterUrl || '/bootcamp/bootcamp.png'}
                  alt={bootcamp.nama_bootcamp}
                  fill
                  className={styles.trackImg}
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className={styles.trackInfo}>
                <div className={styles.trackTitleRow}>
                  <h3>{bootcamp.nama_bootcamp}</h3>
                  <span className={styles.trackBadge}>See Details</span>
                </div>
                <ul className={styles.trackDetails}>
                  <li>
                    <Image src="/bootcamp/material-symbols_date-range.png" alt="" width={14} height={14} />
                    <span>Deadline: {formatDate(bootcamp.tanggal_deadline)}</span>
                  </li>
                  <li>
                    <Image src="/bootcamp/person_icon.png" alt="" width={14} height={14} />
                    <span>By: {bootcamp.penyelenggara}</span>
                  </li>
                  <li>
                    <Image src="/bootcamp/si_pin-fill.png" alt="" width={14} height={14} />
                    <span>Fee: {bootcamp.biaya_daftar ? `Rp ${bootcamp.biaya_daftar.toLocaleString()}` : 'Free'}</span>
                  </li>
                </ul>
                <button className={styles.btnApply} onClick={() => handleRegister(bootcamp.id)}>
                  Register Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyJoinSection() {
    const reasons = [
      {
        number: '01',
        icon: '/bootcamp/learning_by_doing_icon.png',
        title: 'Learn by Doing',
        description: 'Gain real experience through hands-on projects guided by mentors.'
      },
      {
        number: '02',
        icon: '/bootcamp/mentor_support_icon.png',
        title: 'Mentor Support',
        description: 'Receive personal guidance to help you learn, build, and achieve your goals.'
      },
      {
        number: '03',
        icon: '/bootcamp/career_ready_icon.png',
        title: 'Career Ready',
        description: 'Develop essential digital skills aligned with today\'s industry demands.'
      },
      {
        number: '04',
        icon: '/bootcamp/strong_porto_icon.png',
        title: 'Strong Portfolio',
        description: 'Build impactful projects that demonstrate your skills and creativity.'
      }
    ];
  
    return (
      <section className={styles.whyJoinSection}>
        <div className="container">
          <div className={styles.whyJoinContent}>
            <div className={styles.whyJoinLeft}>
              <h2 className={styles.mainTitle}>
                Why You Should<br />
                <span className={styles.gradientText}>Join the Bootcamp</span>
              </h2>
              <div className={styles.whyJoinImage}>
                <Image 
                  src="/bootcamp/bootcamp.png" 
                  alt="Students Celebrating" 
                  width={400}
                  height={300}
                  className={styles.whyImg}
                />
              </div>
            </div>
            
            <div className={styles.whyJoinRight}>
              <div className="row g-3">
                {reasons.map((reason, index) => (
                  <div key={index} className="col-md-6">
                    <div className={styles.reasonCard}>
                      <div className={styles.reasonNumber}>{reason.number}</div>
                      <div className={styles.reasonContent}>
                        <div className={styles.reasonIconWrapper}>
                          <Image 
                            src={reason.icon} 
                            alt={reason.title}
                            width={80}
                            height={80}
                          />
                        </div>
                        <p className={styles.reasonDescription}>{reason.description}</p>
                        <h3>{reason.title}</h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  function KnowMoreSection() {
      const router = useRouter();
    return (
      <section className={styles.knowMoreSection}>
          <div className="container text-center">
            <div className="mb-5">
              <div className={styles.titleWrapper} style={{ '--line-left-offset': '-140px', '--line-left-length': '130px', '--line-right-offset': '-140px', '--line-right-length': '130px' }}>
                <span className={`${styles.dot} ${styles.dotLeft}`}></span>
                <h2 className={styles.newSectionTitle}>Get To Know More</h2>
                <span className={`${styles.dot} ${styles.dotRight}`}></span>
              </div>
              <p className={styles.featuresSubtext}>Gain the information you need to level up your skills here</p>
            </div>
  
            <div className="row justify-content-center">
              <div className="col-lg-4 col-md-6 mb-4">
                <div className={`${styles.featureCard} ${styles.infoCard} shadow-sm h-100`} onClick={() => router.push('/info')}>
                  <Image src="/info.png" width={64} height={64} alt="Info" className={styles.featureImg} />
                  <h3>INFO</h3>
                  <p>Updates on tech competitions and scholarships to support student growth.</p>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 mb-4">
                <div className={`${styles.featureCard} ${styles.talksCard} shadow-sm h-100`} onClick={() => router.push('/talks')}>
                  <Image src="/talks.png" width={64} height={64} alt="Talks" className={styles.featureImg} />
                  <h3>TALKS</h3>
                  <p>Talkshows with tech professionals sharing industry insights and career experiences.</p>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 mb-4">
                <div className={`${styles.featureCard} ${styles.gloryCard} shadow-sm h-100`} onClick={() => router.push('/glory')}>
                  <Image src="/glory.png" width={64} height={64} alt="Glory" className={styles.featureImg} />
                  <h3>GLORY</h3>
                  <p>Platform to recognize and appreciate outstanding achievements in tech excellence and innovation.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
    );
  }
  
  function NewFooter() {
    return (
      <footer className={styles.newFooter}>
          <div className="container text-center">
            <div className="row g-5 justify-content-center">
              <div className="col-lg-4 col-md-6 text-center text-lg-start">
                <div className="d-flex align-items-center justify-content-center justify-content-lg-start gap-3 mb-3">
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
  
              <div className="col-lg-auto col-md-3 text-center text-lg-start">
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
              
              <div className="col-lg-auto col-md-3 text-center text-lg-start">
                <h4 className={styles.footerTitle}>About</h4>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <Link href="/home" className={styles.footerLink}>Home</Link>
                  </li>
                  <li className="mb-2">
                    <Link href="/bootcamp" className={styles.footerLink}>Bootcamp</Link>
                  </li>
                  
                  <li className="mb-2">
                    <Link href="/glory" className={styles.footerLink}>Glory</Link>
                  </li>
                  <li className="mb-2">
                    <Link href="/talks" className={styles.footerLink}>Talks</Link>
                  </li>
                  <li className="mb-2">
                    <Link href="/info" className={styles.footerLink}>Info</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="text-center mt-4">
              <p className={styles.footerCopyright}>
                © 2025 UCCD - Untar Computer Club Development. All rights reserved.
              </p>
          </div>
        </footer>
    );
  }