'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Header from '../components/Header';
import styles from './glory.module.css';
import { useTransition } from '../context/TransitionContext';
import FadeInOnScroll from '../components/FadeInOnScroll';

export default function GloryPage() {
  const { endTransition } = useTransition();

  useEffect(() => {
    endTransition();
  }, [endTransition]);

  const champions = [
    {
      id: 1,
      name: 'Tim UCCD',
      achievement: 'Juara 1 Lomba Competitive Programming',
      competition: 'UNTAR National Competition 2025',
      image: '/glory/champion1.png',
    },
    {
      id: 2,
      name: 'Jane Doe & Tim',
      achievement: 'Juara 2 UI/UX Design Competition',
      competition: 'Tech Innovate Summit 2025',
      image: '/glory/champion1.png',
    },
    {
      id: 3,
      name: 'John Smith',
      achievement: 'Finalis Data Science Challenge',
      competition: 'Global AI Conference 2025',
      image: '/glory/champion1.png',
    },
  ];

  return (
    <div className={styles.gloryPage}>
      <Header />

      <FadeInOnScroll>
        <section className={styles.heroSection}>
          <Image
            src="/glory/hero.png"
            alt="Glory Hero"
            layout="fill"
            objectFit="cover"
            quality={100}
          />
          <div className={styles.heroOverlay} />
          <div className={`container ${styles.heroContent}`}>
            <h1 className={styles.heroTitle}>Hall of Achievement</h1>
            <p className={styles.heroSubtitle}>
              Celebrating the outstanding achievements of our members in the tech world.
            </p>
          </div>
        </section>
      </FadeInOnScroll>

      <FadeInOnScroll>
        <section className="py-5">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className={styles.sectionTitle}>Our Champions</h2>
              <p className={styles.sectionSubtitle}>
                Meet the brilliant minds who have brought glory to our community.
              </p>
            </div>

            <div className="row gy-4">
              {champions.map((champion) => (
                <div key={champion.id} className="col-lg-4 col-md-6">
                  <div className={`card h-100 shadow-sm ${styles.championCard}`}>
                    <Image
                      src={champion.image}
                      alt={champion.name}
                      width={400}
                      height={250}
                      className="card-img-top"
                      objectFit="cover"
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{champion.name}</h5>
                      <p className={`card-text ${styles.achievementText}`}>{champion.achievement}</p>
                      <p className="card-text text-muted mt-auto">
                        <small>{champion.competition}</small>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInOnScroll>
    </div>
  );
}
