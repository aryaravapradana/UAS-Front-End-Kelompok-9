'use client';

import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useTransition } from '../context/TransitionContext';
import styles from './info.module.css';
import Image from 'next/image';
import Link from 'next/link';
import FadeInOnScroll from '../components/FadeInOnScroll';

async function getBeasiswa() {
  const res = await fetch('http://127.0.0.1:3001/api/beasiswas', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch beasiswa data from backend');
  }
  return res.json();
}

async function getLomba() {
  const res = await fetch('http://127.0.0.1:3001/api/lombas', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch lomba data from backend');
  }
  return res.json();
}

export default function InfoPage() {
  const [beasiswaData, setBeasiswaData] = useState([]);
  const [lombaData, setLombaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { endTransition } = useTransition();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [beasiswas, lombas] = await Promise.all([getBeasiswa(), getLomba()]);
        setBeasiswaData(beasiswas);
        setLombaData(lombas);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
        endTransition();
      }
    };
    fetchData();
  }, [endTransition]);

  return (
    <div className={styles.infoPage}>
      <Header />
      <FadeInOnScroll>
        <InfoHeroSection />
      </FadeInOnScroll>
      <FadeInOnScroll>
        <InfoAboutSection />
      </FadeInOnScroll>
      <FadeInOnScroll>
        <InfoWhyJoinSection />
      </FadeInOnScroll>
      <FadeInOnScroll>
        <InfoOpportunitiesSection beasiswaData={beasiswaData} lombaData={lombaData} loading={loading} />
      </FadeInOnScroll>
      <FadeInOnScroll>
        <InfoKnowMoreSection />
      </FadeInOnScroll>
      <AppFooter />
    </div>
  );
}

function InfoHeroSection() {
  return (
    <section className={styles.infoHeroSection}>
      <div className="container">
        <div className="row align-items-center min-vh-100">
          <div className="col-lg-12">
            <div className={styles.infoHeroContent}>
              <h1 className={styles.infoHeroTitle}>
                Explore Opportunities<br />
                Expand Your Future
              </h1>
              <p className={styles.infoHeroDescription}>
                Discover curated scholarships, competitions, and tech programs designed to help FTI students grow academically and professionally.
              </p>
              <div className={styles.infoHeroButtons}>
                <button className={styles.infoBtnRegister}>Register Now</button>
                <button className={styles.infoBtnExplore}>Explore Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoAboutSection() {
  return (
    <section className={styles.infoAboutSection}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-12 text-center">
            <h2 className={styles.infoAboutTitle}>
              What is UCCD Info All About?
            </h2>
            <p className={styles.infoAboutText}>
              UCCD Info is a platform that collects and shares scholarship and competition opportunities in the tech field. Our mission is to connect students with the resources they need to develop their skills, gain recognition, and pursue their goals all completely free.
            </p>
          </div>
          <div className="col-lg-10 mt-5">
            <div className={styles.infoAboutImageWrapper}>
              <Image 
                src="/info/about.png" 
                alt="UCCD Info Platform"
                width={1200}
                height={600}
                style={{ objectFit: 'cover', borderRadius: '20px' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoWhyJoinSection() {
  return (
    <section className={styles.infoWhyJoinSection}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <h2 className={styles.infoWhyTitle}>
              Here's Why<br />
              You Should Join
            </h2>
            
            <div className={styles.infoWhyList}>
              <div className={styles.infoWhyItem}>
                <div className={styles.infoWhyNumber}>01</div>
                <div className={styles.infoWhyText}>
                  <p>Build real-world experience and boost your portfolio.</p>
                </div>
              </div>
              
              <div className={styles.infoWhyItem}>
                <div className={styles.infoWhyNumber}>02</div>
                <div className={styles.infoWhyText}>
                  <p>Direct insights from tech professionals and innovators</p>
                </div>
              </div>
              
              <div className={styles.infoWhyItem}>
                <div className={styles.infoWhyNumber}>03</div>
                <div className={styles.infoWhyText}>
                  <p>Free access to all sessions for FTI UNTAR students</p>
                </div>
              </div>
              
              <div className={styles.infoWhyItem}>
                <div className={styles.infoWhyNumber}>04</div>
                <div className={styles.infoWhyText}>
                  <p>Updated knowledge about the latest technology trends</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-6">
            <div className={styles.infoWhyImageContainer}>
              <Image 
                src="/info/why_join_image.png" 
                alt="Students celebrating"
                width={600}
                height={600}
                style={{ objectFit: 'cover', borderRadius: '20px' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoOpportunitiesSection({ beasiswaData, lombaData, loading }) {
  const [activeTab, setActiveTab] = useState('scholarships');

  if (loading) {
    return (
      <section className={styles.infoOpportunitiesSection}>
        <div className="container text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.infoOpportunitiesSection}>
      <div className="container">
        <div className="text-center mb-5">
          <div className={styles.infoOpportunitiesTitleWrapper}>
            <span className={`${styles.infoOppDot} ${styles.infoOppDotLeft}`}></span>
            <h2 className={styles.infoOpportunitiesTitle}>
              Opportunity List<br />
              Section
            </h2>
            <span className={`${styles.infoOppDot} ${styles.infoOppDotRight}`}></span>
          </div>
          <p className={styles.infoOpportunitiesSubtitle}>
            Discover curated scholarships, competitions, and tech programs designed to help FTI students grow academically and professionally.
          </p>
          
          <div className={styles.infoOpportunitiesTabs}>
            <button 
              className={`${styles.infoTabBtn} ${activeTab === 'scholarships' ? styles.infoTabActive : ''}`}
              onClick={() => setActiveTab('scholarships')}
            >
              Scholarships
            </button>
            <button 
              className={`${styles.infoTabBtn} ${activeTab === 'competition' ? styles.infoTabActive : ''}`}
              onClick={() => setActiveTab('competition')}
            >
              Competition
            </button>
          </div>
        </div>

        <div className={`row g-4 justify-content-center ${styles.featureCardsContainer}`}>
          {activeTab === 'scholarships' && (
            beasiswaData.length > 0 ? (
              beasiswaData.slice(0, 3).map((beasiswa) => (
                <div key={beasiswa.id} className="col-lg-4 col-md-6">
                  <div className={styles.infoCard}>
                    <div className={styles.infoCardImage}>
                      <Image 
                        src={beasiswa.posterUrl || '/info/default-beasiswa.png'} 
                        alt={beasiswa.nama_beasiswa || 'Scholarship'}
                        width={400}
                        height={300}
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className={styles.infoCardContent}>
                      <div className={styles.infoCardDate}>JUNE 24, 2025</div>
                      <h3 className={styles.infoCardTitle}>Google Developer Scholarship</h3>
                      <p className={styles.infoCardDesc}>Learn web development fundamentals with mentorship and certification directly from Google.</p>
                      <button className={styles.infoCardBtn}>See Details</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="col-lg-4 col-md-6">
                  <div className={styles.infoCard}>
                    <div className={styles.infoCardImage}>
                      <Image 
                        src="/info/default-beasiswa.png" 
                        alt="Google Developer Scholarship"
                        width={400}
                        height={300}
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className={styles.infoCardContent}>
                      <div className={styles.infoCardDate}>JUNE 24, 2025</div>
                      <h3 className={styles.infoCardTitle}>Google Developer Scholarship</h3>
                      <p className={styles.infoCardDesc}>Learn web development fundamentals with mentorship and certification directly from Google.</p>
                      <button className={styles.infoCardBtn}>See Details</button>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className={styles.infoCard}>
                    <div className={styles.infoCardImage}>
                      <Image 
                        src="/info/default-beasiswa.png" 
                        alt="Google Developer Scholarship"
                        width={400}
                        height={300}
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className={styles.infoCardContent}>
                      <div className={styles.infoCardDate}>JUNE 24, 2025</div>
                      <h3 className={styles.infoCardTitle}>Google Developer Scholarship</h3>
                      <p className={styles.infoCardDesc}>Learn web development fundamentals with mentorship and certification directly from Google.</p>
                      <button className={styles.infoCardBtn}>See Details</button>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className={styles.infoCard}>
                    <div className={styles.infoCardImage}>
                      <Image 
                        src="/info/default-beasiswa.png" 
                        alt="Google Developer Scholarship"
                        width={400}
                        height={300}
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className={styles.infoCardContent}>
                      <div className={styles.infoCardDate}>JUNE 24, 2025</div>
                      <h3 className={styles.infoCardTitle}>Google Developer Scholarship</h3>
                      <p className={styles.infoCardDesc}>Learn web development fundamentals with mentorship and certification directly from Google.</p>
                      <button className={styles.infoCardBtn}>See Details</button>
                    </div>
                  </div>
                </div>
              </>
            )
          )}

          {activeTab === 'competition' && (
            lombaData.length > 0 ? (
              lombaData.slice(0, 3).map((lomba) => (
                <div key={lomba.id} className="col-lg-4 col-md-6">
                  <div className={styles.infoCard}>
                    <div className={styles.infoCardImage}>
                      <Image 
                        src={lomba.posterUrl || '/info/default-lomba.png'} 
                        alt={lomba.nama_lomba || 'Competition'}
                        width={400}
                        height={300}
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className={styles.infoCardContent}>
                      <div className={styles.infoCardDate}>JUNE 24, 2025</div>
                      <h3 className={styles.infoCardTitle}>{lomba.nama_lomba}</h3>
                      <p className={styles.infoCardDesc}>{lomba.penyelenggara}</p>
                      <button className={styles.infoCardBtn}>See Details</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="col-lg-4 col-md-6">
                  <div className={styles.infoCard}>
                    <div className={styles.infoCardImage}>
                      <Image 
                        src="/info/default-lomba.png" 
                        alt="Tech Competition"
                        width={400}
                        height={300}
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className={styles.infoCardContent}>
                      <div className={styles.infoCardDate}>JUNE 24, 2025</div>
                      <h3 className={styles.infoCardTitle}>Tech Competition</h3>
                      <p className={styles.infoCardDesc}>Compete with fellow students in exciting tech challenges.</p>
                      <button className={styles.infoCardBtn}>See Details</button>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className={styles.infoCard}>
                    <div className={styles.infoCardImage}>
                      <Image 
                        src="/info/default-lomba.png" 
                        alt="Tech Competition"
                        width={400}
                        height={300}
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className={styles.infoCardContent}>
                      <div className={styles.infoCardDate}>JUNE 24, 2025</div>
                      <h3 className={styles.infoCardTitle}>Tech Competition</h3>
                      <p className={styles.infoCardDesc}>Compete with fellow students in exciting tech challenges.</p>
                      <button className={styles.infoCardBtn}>See Details</button>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className={styles.infoCard}>
                    <div className={styles.infoCardImage}>
                      <Image 
                        src="/info/default-lomba.png" 
                        alt="Tech Competition"
                        width={400}
                        height={300}
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className={styles.infoCardContent}>
                      <div className={styles.infoCardDate}>JUNE 24, 2025</div>
                      <h3 className={styles.infoCardTitle}>Tech Competition</h3>
                      <p className={styles.infoCardDesc}>Compete with fellow students in exciting tech challenges.</p>
                      <button className={styles.infoCardBtn}>See Details</button>
                    </div>
                  </div>
                </div>
              </>
            )
          )}
        </div>
      </div>
    </section>
  );
}

function InfoKnowMoreSection() {
  return (
    <section className={styles.infoFeaturesSection}>
      <div className="container text-center">
        <div className="mb-5">
          <div className={styles.infoFeaturesTitleWrapper}>
            <span className={`${styles.infoFeaturesDot} ${styles.infoFeaturesDotLeft}`}></span>
            <h2 className={styles.infoFeaturesTitle}>Get To Know More</h2>
            <span className={`${styles.infoFeaturesDot} ${styles.infoFeaturesDotRight}`}></span>
          </div>
          <p className={styles.infoFeaturesSubtext}>Gain the information you need to level up your skills here</p>
        </div>

        <div className={`row gy-4 justify-content-center ${styles.featureCardsContainer}`}>
          <div className="col-lg-4 col-md-6">
            <Link href="/bootcamp" className={`${styles.infoFeatureCard} ${styles.infoBootcampCard} shadow-sm`}>
              <Image src="/bootcamp.png" width={80} height={80} alt="Bootcamp" className={styles.infoFeatureImg} />
              <h3>BOOTCAMP</h3>
              <p>Intensive training program to build practical skills in UI, web, and data science.</p>
            </Link>
          </div>

          <div className="col-lg-4 col-md-6">
            <Link href="/glory" className={`${styles.infoFeatureCard} ${styles.infoGloryCard} shadow-sm`}>
              <Image src="/glory.png" width={80} height={80} alt="Glory" className={styles.infoFeatureImg} />
              <h3>GLORY</h3>
              <p>Platform to showcase and appreciate achievements of FTI students in competitions.</p>
            </Link>
          </div>

          <div className="col-lg-6 col-md-6">
            <Link href="/talk" className={`${styles.infoFeatureCard} ${styles.infoTalkCard} shadow-sm`}>
              <Image src="/talks.png" width={80} height={80} alt="Talks" className={styles.infoFeatureImg} />
              <h3>TALKS</h3>
              <p>Talkshows with tech professionals sharing industry insights and career experiences.</p>
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
