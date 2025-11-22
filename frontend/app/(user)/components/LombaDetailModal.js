'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './LombaDetailModal.module.css';
import toast from 'react-hot-toast';
import API from '@/lib/api';

const LombaDetailModal = ({ isOpen, onClose, lomba }) => {
  const [registrationStep, setRegistrationStep] = useState('initial'); // 'initial', 'create-team', 'join-team', 'success'
  const [teamName, setTeamName] = useState('');
  const [teamCode, setTeamCode] = useState('');
  const [generatedTeamCode, setGeneratedTeamCode] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !lomba) return null;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const isSolo = lomba.max_anggota === 1;
  const isTeam = lomba.max_anggota > 1;

  // Handle solo registration
  const handleSoloRegister = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        return;
      }

      const res = await fetch(API.lombas.registerSolo(lomba.id), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Successfully registered for competition!');
        setRegistrationStep('success');
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error registering:', error);
      toast.error('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  // Handle team creation
  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      toast.error('Please enter a team name');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        return;
      }

      const res = await fetch(API.lombas.createTeam(lomba.id), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nama_tim: teamName }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Team created successfully!');
        setGeneratedTeamCode(data.team_code);
        setRegistrationStep('success');
      } else {
        toast.error(data.message || 'Team creation failed');
      }
    } catch (error) {
      console.error('Error creating team:', error);
      toast.error('An error occurred while creating team');
    } finally {
      setLoading(false);
    }
  };

  // Handle joining team
  const handleJoinTeam = async () => {
    if (!teamCode.trim()) {
      toast.error('Please enter a team code');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        return;
      }

      const res = await fetch(API.lombas.joinTeam(lomba.id), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ kode_tim: teamCode }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`Successfully joined team: ${data.team_name}`);
        setRegistrationStep('success');
      } else {
        toast.error(data.message || 'Failed to join team');
      }
    } catch (error) {
      console.error('Error joining team:', error);
      toast.error('An error occurred while joining team');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setRegistrationStep('initial');
    setTeamName('');
    setTeamCode('');
    setGeneratedTeamCode('');
    onClose();
  };

  const copyTeamCode = () => {
    navigator.clipboard.writeText(generatedTeamCode);
    toast.success('Team code copied to clipboard!');
  };

  return (
    <div className={`${styles.modalOverlay} ${isOpen ? styles.open : ''}`} onClick={handleClose}>
      <div className={`${styles.modalContent} ${isOpen ? styles.open : ''}`} onClick={(e) => e.stopPropagation()}>
        {/* Left Half: Poster and Back Button */}
        <div className={styles.leftHalf}>
          <button className={styles.backButton} onClick={handleClose}>
            <i className="fas fa-arrow-left"></i>
          </button>
          {lomba.posterUrl ? (
            <Image
              src={lomba.posterUrl}
              alt="Competition Poster"
              layout="fill"
              objectFit="contain"
              className={styles.posterImage}
            />
          ) : (
            <div className={styles.noPoster}>No poster available.</div>
          )}
        </div>

        {/* Right Half: Details and Registration */}
        <div className={styles.rightHalf}>
          <h2 className={styles.lombaName}>{lomba.nama_lomba}</h2>
          <p className={styles.lombaOrganizer}>Organized by {lomba.penyelenggara}</p>

          <div className={styles.detailItem}>
            <i className="fas fa-calendar-alt"></i>
            <div className={styles.detailTextContainer}>
              <div className={styles.detailLabel}>Deadline</div>
              <div className={styles.detailValue}>{formatDate(lomba.tanggal_deadline)}</div>
            </div>
          </div>

          <div className={styles.detailItem}>
            <i className="fas fa-money-bill-wave"></i>
            <div className={styles.detailTextContainer}>
              <div className={styles.detailLabel}>Registration Fee</div>
              <div className={styles.detailValue}>
                {lomba.biaya_daftar === 0 ? 'Free' : `Rp ${lomba.biaya_daftar.toLocaleString()}`}
              </div>
            </div>
          </div>

          <div className={styles.detailItem}>
            <i className="fas fa-users"></i>
            <div className={styles.detailTextContainer}>
              <div className={styles.detailLabel}>Competition Type</div>
              <div className={styles.detailValue}>
                {isSolo ? 'Solo Competition' : `Team Competition (Max ${lomba.max_anggota} members)`}
              </div>
            </div>
          </div>

          {/* Registration Section */}
          <div className={styles.registrationSection}>
            {registrationStep === 'initial' && (
              <>
                {isSolo && (
                  <button 
                    className={styles.registerButton} 
                    onClick={handleSoloRegister}
                    disabled={loading}
                  >
                    {loading ? 'Registering...' : 'Register Now'}
                  </button>
                )}

                {isTeam && (
                  <div className={styles.teamOptions}>
                    <h3 className={styles.teamOptionsTitle}>Choose Registration Method</h3>
                    <button 
                      className={styles.teamOptionButton}
                      onClick={() => setRegistrationStep('create-team')}
                    >
                      <i className="fas fa-plus-circle"></i>
                      Create New Team
                    </button>
                    <button 
                      className={styles.teamOptionButton}
                      onClick={() => setRegistrationStep('join-team')}
                    >
                      <i className="fas fa-user-plus"></i>
                      Join Existing Team
                    </button>
                  </div>
                )}
              </>
            )}

            {registrationStep === 'create-team' && (
              <div className={styles.teamForm}>
                <button 
                  className={styles.backToOptionsButton}
                  onClick={() => setRegistrationStep('initial')}
                >
                  <i className="fas fa-arrow-left"></i> Back
                </button>
                <h3 className={styles.formTitle}>Create Your Team</h3>
                <input
                  type="text"
                  className={styles.teamInput}
                  placeholder="Enter team name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  maxLength={50}
                />
                <button 
                  className={styles.submitButton}
                  onClick={handleCreateTeam}
                  disabled={loading || !teamName.trim()}
                >
                  {loading ? 'Creating...' : 'Create Team'}
                </button>
              </div>
            )}

            {registrationStep === 'join-team' && (
              <div className={styles.teamForm}>
                <button 
                  className={styles.backToOptionsButton}
                  onClick={() => setRegistrationStep('initial')}
                >
                  <i className="fas fa-arrow-left"></i> Back
                </button>
                <h3 className={styles.formTitle}>Join a Team</h3>
                <input
                  type="text"
                  className={styles.teamInput}
                  placeholder="Enter team code (e.g., TEAM-ABC123)"
                  value={teamCode}
                  onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
                  maxLength={11}
                />
                <button 
                  className={styles.submitButton}
                  onClick={handleJoinTeam}
                  disabled={loading || !teamCode.trim()}
                >
                  {loading ? 'Joining...' : 'Join Team'}
                </button>
              </div>
            )}

            {registrationStep === 'success' && (
              <div className={styles.successMessage}>
                <i className="fas fa-check-circle"></i>
                <h3>Registration Successful!</h3>
                {generatedTeamCode && (
                  <div className={styles.teamCodeDisplay}>
                    <p>Your team code:</p>
                    <div className={styles.codeBox}>
                      <span className={styles.code}>{generatedTeamCode}</span>
                      <button className={styles.copyButton} onClick={copyTeamCode}>
                        <i className="fas fa-copy"></i>
                      </button>
                    </div>
                    <p className={styles.codeInstruction}>Share this code with your team members!</p>
                  </div>
                )}
                <button className={styles.closeButton} onClick={handleClose}>
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LombaDetailModal;
