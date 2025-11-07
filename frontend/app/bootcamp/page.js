'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './bootcamp.module.css';

export default function BootcampPage() {
  const [activeTrack, setActiveTrack] = useState('complete');

  return (
    <div className={styles.bootcampPage}>
      <Navbar />
      <HeroSection />
      <WhatIsSection />
      <ChooseTrackSection activeTrack={activeTrack} setActiveTrack={setActiveTrack} />
      <WhyJoinSection />
      <KnowMoreSection />
      <Footer />
    </div>
  );
}

// ==================== NAVBAR ====================
function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <div className={styles.navLogo}>
          <Image 
            src="/uccd-logo@2x.png" 
            alt="UCCD" 
            width={24} 
            height={24}
          />
          <span>UCCD</span>
        </div>
        
        <div className={`${styles.navLinks} ${isOpen ? styles.active : ''}`}>
          <a href="#home" onClick={() => setIsOpen(false)}>Home</a>
          <a href="#bootcamp" onClick={() => setIsOpen(false)}>Bootcamp</a>
          <a href="#insight" onClick={() => setIsOpen(false)}>Insight</a>
          <a href="#glory" onClick={() => setIsOpen(false)}>Glory</a>
          <a href="#talks" onClick={() => setIsOpen(false)}>Talks</a>
          <a href="#info" onClick={() => setIsOpen(false)}>Info</a>
        </div>
        
        <div className={styles.navButtons}>
          <button className={styles.btnLogin}>Log In</button>
          <button className={styles.btnStarted}>Get Started</button>
        </div>
        
        <div 
          className={`${styles.hamburger} ${isOpen ? styles.active : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
}

// ==================== HERO ====================
function HeroSection() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroContent}>
        <div className={styles.heroText}>
          <h1>A Learning Experience That<br />Transforms Potential into Skill</h1>
          <p>An intensive learning program designed by UCCD to help FTI students gain real-world experience in UI Design,<br />Web Development, and Data Science guided by mentors and industry experts.</p>
          <div className={styles.heroButtons}>
            <button className={styles.btnApply}>Apply Now</button>
            <button className={styles.btnExplore}>Explore Now</button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==================== WHAT IS ====================
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

// ==================== CHOOSE TRACK ====================
function ChooseTrackSection({ activeTrack, setActiveTrack }) {
  const tracks = [
    {
      name: 'UI/UX Design',
      badge: 'See Details',
      date: '16 Dec 2024 - 16 Jan 2025',
      participants: '40 Participants',
      location: 'Hybrid: Offline/Online',
      image: '/bootcamp/bootcamp.png'
    },
    {
      name: 'Web Development',
      badge: 'See Details',
      date: '16 Dec 2024 - 16 Jan 2025',
      participants: '40 Participants',
      location: 'Hybrid: Offline/Online',
      image: '/bootcamp/bootcamp.png'
    },
    {
      name: 'Game Development',
      badge: 'See Details',
      date: '16 Dec 2024 - 16 Jan 2025',
      participants: '40 Participants',
      location: 'Hybrid: Offline/Online',
      image: '/bootcamp/bootcamp.png'
    }
  ];

  return (
    <section className={styles.chooseTrackSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>→ Choose Your Track ←</h2>
        <p className={styles.sectionSubtitle}>Choose the path that matches your passion and start mastering the digital skills of tomorrow.</p>
        
        <div className={styles.trackFilter}>
          <button 
            className={activeTrack === 'complete' ? styles.active : ''} 
            onClick={() => setActiveTrack('complete')}
          >
            Completed
          </button>
          <button 
            className={activeTrack === 'upcoming' ? styles.active : ''} 
            onClick={() => setActiveTrack('upcoming')}
          >
            Coming Soon
          </button>
        </div>

        <div className={styles.trackCards}>
          {tracks.map((track, index) => (
            <div key={index} className={styles.trackCard}>
              <div className={styles.trackImage}>
                <Image 
                  src={track.image}
                  alt={track.name}
                  fill
                  className={styles.trackImg}
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className={styles.trackInfo}>
                <div className={styles.trackTitleRow}>
                  <h3>{track.name}</h3>
                  <span className={styles.trackBadge}>{track.badge}</span>
                </div>
                <ul className={styles.trackDetails}>
                  <li>
                    <Image src="/bootcamp/material-symbols_date-range.png" alt="" width={14} height={14} />
                    <span>{track.date}</span>
                  </li>
                  <li>
                    <Image src="/bootcamp/person_icon.png" alt="" width={14} height={14} />
                    <span>{track.participants}</span>
                  </li>
                  <li>
                    <Image src="/bootcamp/si_pin-fill.png" alt="" width={14} height={14} />
                    <span>{track.location}</span>
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==================== WHY JOIN ====================
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
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-lg-5">
            <div className={styles.leftContent}>
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
                  className={`${styles.whyImg} img-fluid`}
                />
              </div>
            </div>
          </div>
          
          <div className="col-lg-7">
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

// ==================== KNOW MORE ====================
function KnowMoreSection() {
  const infoCards = [
    { 
      icon: 'bootcamp', 
      title: 'BOOTCAMP', 
      description: 'Explore all the details about the bootcamp and prepare yourself for success!' 
    },
    { 
      icon: 'insight', 
      title: 'INSIGHT', 
      description: 'Explore all the details about the bootcamp and prepare yourself for success!' 
    },
    { 
      icon: 'glory', 
      title: 'GLORY', 
      description: 'Explore all the details about the bootcamp and prepare yourself for success!' 
    },
    { 
      icon: 'info', 
      title: 'INFO', 
      description: 'Explore all the details about the bootcamp and prepare yourself for success!' 
    },
    { 
      icon: 'talks', 
      title: 'TALKS', 
      description: 'Explore all the details about the bootcamp and prepare yourself for success!' 
    }
  ];

  const getIcon = (type) => {
    const icons = {
      bootcamp: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
          <rect x="5" y="4" width="14" height="17" rx="2" stroke="white" strokeWidth="1.5" fill="none"/>
          <rect x="8" y="2" width="8" height="4" rx="1" fill="white"/>
        </svg>
      ),
      insight: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
          <circle cx="12" cy="8" r="3" fill="white"/>
          <path d="M12 14C8 14 4 16 4 19V21H20V19C20 16 16 14 12 14Z" fill="white"/>
        </svg>
      ),
      glory: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
          <path d="M20 7H17L15 4H9L7 7H4C2.9 7 2 7.9 2 9V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V9C22 7.9 21.1 7 20 7ZM12 18C9.24 18 7 15.76 7 13C7 10.24 9.24 8 12 8C14.76 8 17 10.24 17 13C17 15.76 14.76 18 12 18Z" fill="white"/>
        </svg>
      ),
      info: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
          <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" fill="none"/>
          <path d="M12 8V12M12 16H12.01" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      talks: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
          <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="white"/>
        </svg>
      )
    };
    return icons[type];
  };

  return (
    <section className={styles.knowMoreSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>→ Get To Know More ←</h2>
        <p className={styles.sectionSubtitle}>Get the information you need to best prepare for your bootcamp journey!</p>

        <div className={styles.infoCardsGrid}>
          {infoCards.map((card, index) => (
            <div key={index} className={styles.infoCard}>
              <div className={styles.infoIconWrapper}>
                {getIcon(card.icon)}
              </div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <a href="#" className={styles.infoLink}>Coming Soon</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==================== FOOTER ====================
function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.footerLeft}>
            <div className={styles.footerLogo}>
              <Image 
                src="/uccd-logo@2x.png" 
                alt="UCCD" 
                width={24} 
                height={24}
              />
              <span>UCCD</span>
            </div>
            <p>UCCD is a student organization under HIMTI, dedicated to empowering students with skills in UI/UX Design, Web Development, and Game Development.</p>
          </div>
          <div className={styles.footerRight}>
            <div className={styles.footerSection}>
              <h4>Contact</h4>
              <p>Email: uccd@example.com</p>
              <p>Phone: +62 123 4567 890</p>
            </div>
            <div className={styles.footerSection}>
              <h4>About</h4>
              <a href="#">Home</a>
              <a href="#">Bootcamp</a>
              <a href="#">Insight</a>
              <a href="#">Glory</a>
              <a href="#">Talks</a>
              <a href="#">Info</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}