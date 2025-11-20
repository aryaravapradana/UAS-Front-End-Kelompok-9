'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import Image from 'next/image';
import styles from './bootcamp.module.css';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import { useTransition } from '../context/TransitionContext';
import FadeInOnScroll from '../components/FadeInOnScroll';
import BootcampDetailModal from '../components/BootcampDetailModal'; // Import the new modal component

export default function BootcampPage() {
  const [activeTrack, setActiveTrack] = useState('complete');
  const { endTransition } = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [currentBootcamp, setCurrentBootcamp] = useState(null); // State for current bootcamp object

  useEffect(() => {
    endTransition();
  }, [endTransition]);

  // Function to open the modal
  const openDetailModal = (bootcamp) => {
    setCurrentBootcamp(bootcamp);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeDetailModal = () => {
    setIsModalOpen(false);
    setCurrentBootcamp(null);
  };

  return (
    <div className={styles.bootcampPage}>
      <Header />
      <FadeInOnScroll>
        <HeroSection />
      </FadeInOnScroll>
      <FadeInOnScroll>
        <WhatIsSection />
      </FadeInOnScroll>
      <FadeInOnScroll>
        <ChooseTrackSection activeTrack={activeTrack} setActiveTrack={setActiveTrack} openDetailModal={openDetailModal} />
      </FadeInOnScroll>
      <FadeInOnScroll>
        <WhyJoinSection />
      </FadeInOnScroll>
      <FadeInOnScroll>
        <BootcampKnowMoreSection />
      </FadeInOnScroll>
      <AppFooter />

      {/* Render the modal component */}
      <BootcampDetailModal
        isOpen={isModalOpen}
        onClose={closeDetailModal}
        bootcamp={currentBootcamp}
      />
    </div>
  );
}

function HeroSection() {
  return (
    <section className={styles.heroSection}>
      <Image
        src="/decorative-ellipse.svg"
        alt="Decorative Ellipse"
        width={894}
        height={824}
        className={styles.decorativeEllipse}
        unoptimized
      />
      <Image
        src="/decorative-ellipse.svg"
        alt="Decorative Ellipse Right"
        width={894}
        height={824}
        className={styles.decorativeEllipseRight}
        unoptimized
      />
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

function ChooseTrackSection({ activeTrack, setActiveTrack, openDetailModal }) {
  const [allBootcamps, setAllBootcamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBootcamps = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/bootcamps');
        if (!res.ok) {
          throw new Error('Failed to fetch bootcamps');
        }
        const data = await res.json();
        setAllBootcamps(data);
      } catch (error) {
        console.error("Error fetching bootcamps:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBootcamps();
  }, []);

  const filterBootcamps = (bootcamps, type) => {
    if (!bootcamps) return [];
    const now = new Date();
    return bootcamps.filter(bootcamp => {
      const deadline = new Date(bootcamp.tanggal_deadline);
      if (type === 'upcoming') {
        return deadline >= now;
      } else { // complete
        return deadline < now;
      }
    });
  };

  const bootcampsToDisplay = activeTrack === 'upcoming' ? filterBootcamps(allBootcamps, 'upcoming') : filterBootcamps(allBootcamps, 'complete');

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
          {loading ? (
            <p>Loading bootcamps...</p>
          ) : bootcampsToDisplay.length > 0 ? (
            bootcampsToDisplay.map((bootcamp) => (
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
                    {/* Make "See Details" clickable and remove "Register Now" */}
                    <button
                      className={styles.trackBadge} // Keep existing styling
                      onClick={() => openDetailModal(bootcamp)} // Open modal with full bootcamp object
                    >
                      See Details
                    </button>
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
                  {/* Removed the original Register Now button */}
                  {/* <button className={styles.btnApply} onClick={() => handleRegister(bootcamp.id)}>
                    Register Now
                  </button> */}
                </div>
              </div>
            ))
          ) : (
            <p>No {activeTrack === 'upcoming' ? 'upcoming' : 'completed'} bootcamps available.</p>
          )}
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
  
  function BootcampKnowMoreSection() {
  return (
    <section className={styles.bootcampFeaturesSection}>
      <div className="container text-center">
        <div className="mb-5">
          <div className={styles.bootcampTitleWrapper} style={{ '--line-left-offset': '-140px', '--line-left-length': '130px', '--line-right-offset': '-140px', '--line-right-length': '130px' }}>
            <span className={`${styles.bootcampDot} ${styles.bootcampDotLeft}`}></span>
            <h2 className={styles.bootcampFeaturesTitle}>Explore Our Programs</h2>
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
            <Link href="/glory" className={`${styles.featureCard} ${styles.gloryCard} shadow-sm`}>
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