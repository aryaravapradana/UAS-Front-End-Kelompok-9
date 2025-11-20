'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './EventDetailModal.module.css';

const EventDetailModal = ({ isOpen, onClose, event }) => {
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && event) {
      fetchTeamData();
    }
  }, [isOpen, event]);

  const fetchTeamData = async () => {
    if (!event || event.type.toLowerCase() !== 'lomba') {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3001/api/events/${event.type}/${event.id}/team`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setTeamData(data);
      }
    } catch (error) {
      console.error('Error fetching team data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !event) return null;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getEventName = () => {
    return event.nama_lomba || event.nama_beasiswa || event.nama_seminar || event.nama_bootcamp;
  };

  const getEventOrganizer = () => {
    return event.penyelenggara || 'N/A';
  };

  const copyTeamCode = () => {
    if (teamData?.team_code) {
      navigator.clipboard.writeText(teamData.team_code);
      // You could add a toast notification here
    }
  };

  return (
    <div className={`${styles.modalOverlay} ${isOpen ? styles.open : ''}`} onClick={onClose}>
      <div className={`${styles.modalContent} ${isOpen ? styles.open : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>

        <div className={styles.modalHeader}>
          <span className={`${styles.eventTypeBadge} ${styles[event.type.toLowerCase()]}`}>
            {event.type}
          </span>
          <h2 className={styles.eventName}>{getEventName()}</h2>
          <p className={styles.eventOrganizer}>Organized by {getEventOrganizer()}</p>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.detailItem}>
            <i className="fas fa-calendar-alt"></i>
            <div className={styles.detailTextContainer}>
              <div className={styles.detailLabel}>Date</div>
              <div className={styles.detailValue}>{formatDate(event.date)}</div>
            </div>
          </div>

          {event.biaya_daftar !== undefined && (
            <div className={styles.detailItem}>
              <i className="fas fa-money-bill-wave"></i>
              <div className={styles.detailTextContainer}>
                <div className={styles.detailLabel}>Registration Fee</div>
                <div className={styles.detailValue}>
                  {event.biaya_daftar === 0 ? 'Free' : `Rp ${event.biaya_daftar.toLocaleString()}`}
                </div>
              </div>
            </div>
          )}

          {/* Team Information Section - Only for Lomba */}
          {event.type.toLowerCase() === 'lomba' && teamData && teamData.is_team && (
            <div className={styles.teamSection}>
              <div className={styles.teamHeader}>
                <h3 className={styles.teamTitle}>
                  <i className="fas fa-users"></i>
                  Team Information
                </h3>
              </div>

              <div className={styles.teamInfo}>
                <div className={styles.teamInfoItem}>
                  <span className={styles.teamInfoLabel}>Team Name:</span>
                  <span className={styles.teamInfoValue}>{teamData.team_name}</span>
                </div>
                <div className={styles.teamInfoItem}>
                  <span className={styles.teamInfoLabel}>Team Code:</span>
                  <div className={styles.teamCodeBox}>
                    <span className={styles.teamCode}>{teamData.team_code}</span>
                    <button className={styles.copyButton} onClick={copyTeamCode}>
                      <i className="fas fa-copy"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.teamMembers}>
                <h4 className={styles.membersTitle}>Team Members ({teamData.team_members.length})</h4>
                <div className={styles.membersList}>
                  {teamData.team_members.map((member, index) => (
                    <div key={member.nim} className={styles.memberCard}>
                      <div className={styles.memberAvatar}>
                        <Image
                          src={member.profilePictureUrl || '/uccd-logo@2x.png'}
                          alt={member.nama_lengkap}
                          width={50}
                          height={50}
                          className={styles.avatarImage}
                        />
                        {member.is_leader && (
                          <span className={styles.leaderBadge}>
                            <i className="fas fa-crown"></i>
                          </span>
                        )}
                      </div>
                      <div className={styles.memberInfo}>
                        <div className={styles.memberName}>
                          {member.nama_lengkap}
                          {member.is_leader && <span className={styles.leaderTag}>Leader</span>}
                        </div>
                        <div className={styles.memberDetails}>
                          {member.nim} • {member.prodi} • 20{member.angkatan}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Solo Registration Info */}
          {event.type.toLowerCase() === 'lomba' && teamData && !teamData.is_team && (
            <div className={styles.soloInfo}>
              <i className="fas fa-user"></i>
              <span>Solo Registration</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;
