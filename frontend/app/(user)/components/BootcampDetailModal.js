'use client';

import React from 'react';
import Image from 'next/image';
import styles from './BootcampDetailModal.module.css';

const BootcampDetailModal = ({ isOpen, onClose, bootcamp }) => {
  if (!isOpen || !bootcamp) return null;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Placeholder for description and benefits if not available in bootcamp object
  // NOTE: These fields (description, benefits) are not currently available in the backend Bootcamp model.
  // To make them dynamic, you need to add 'description' (String) and 'benefits' (String[])
  // to the Bootcamp model in backend/prisma/schema.prisma and update the backend API.
  const description = bootcamp.description || "This is a placeholder description for the bootcamp. Please update the backend to include a 'description' field in the Bootcamp model for dynamic content.";
  const benefits = bootcamp.benefits || [
    "Placeholder Benefit 1: Hands-on projects",
    "Placeholder Benefit 2: Expert mentorship",
    "Placeholder Benefit 3: Career development",
    "Placeholder Benefit 4: Portfolio building"
  ];

  return (
    <div className={`${styles.modalOverlay} ${isOpen ? styles.open : ''}`} onClick={onClose}>
      <div className={`${styles.modalContent} ${isOpen ? styles.open : ''}`} onClick={(e) => e.stopPropagation()}>
        {/* Left Half: Poster and Back Button */}
        <div className={styles.leftHalf}>
          <button className={styles.backButton} onClick={onClose}>
            <i className="fas fa-arrow-left"></i>
          </button>
          {bootcamp.posterUrl ? (
            <Image
              src={bootcamp.posterUrl}
              alt="Bootcamp Poster"
              layout="fill"
              objectFit="contain"
              className={styles.posterImage}
            />
          ) : (
            <div className={styles.noPoster}>No poster available.</div>
          )}
        </div>

        {/* Right Half: Details */}
        <div className={styles.rightHalf}>
          <h2 className={styles.bootcampName}>{bootcamp.nama_bootcamp}</h2>
          <p className={styles.bootcampDescription}>{description}</p>

          <div className={styles.detailItem}>
            <i className="fas fa-calendar-alt"></i>
            <div className={styles.detailTextContainer}>
              <div className={styles.detailLabel}>Application Period</div>
              <div className={styles.detailValue}>{formatDate(bootcamp.tanggal_deadline)}</div>
            </div>
          </div>

          <div className={styles.detailItem}>
            <i className="fas fa-suitcase"></i>
            <span className={styles.detailLabel}>Benefits</span>
            <ul className={styles.benefitsList}>
              {benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>

          <button className={styles.registerButton}>Register Now</button>
        </div>
      </div>
    </div>
  );
};

export default BootcampDetailModal;