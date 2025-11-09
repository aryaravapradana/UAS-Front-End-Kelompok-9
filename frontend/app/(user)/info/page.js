'use client';

import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useTransition } from '../context/TransitionContext';
import styles from './info.module.css';

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
      <main className="container py-5" style={{ marginTop: '80px' }}>
        <div className="text-center mb-5">
            <h1 className={styles.pageTitle}>Informasi Beasiswa & Lomba</h1>
            <p className={styles.pageSubtitle}>Temukan peluang untuk berkembang dan berprestasi.</p>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <section id="beasiswa" className={styles.infoSection}>
              <h2 className={styles.sectionTitle}>Daftar Beasiswa</h2>
              <div className="table-responsive">
                <table className="table table-striped table-bordered table-hover">
                  <thead className="thead-dark">
                    <tr>
                      <th>Nama Beasiswa</th>
                      <th>Penyelenggara</th>
                      <th>Batasan Tahun</th>
                      <th>Batasan Prodi</th>
                      <th>Deadline</th>
                      <th>Biaya</th>
                      <th>Penerima UCCD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {beasiswaData.map((beasiswa) => (
                      <tr key={beasiswa.id}>
                        <td>{beasiswa.nama_beasiswa}</td>
                        <td>{beasiswa.penyelenggara}</td>
                        <td>{beasiswa.batasan_tahun}</td>
                        <td>{beasiswa.batasan_prodi}</td>
                        <td>{new Date(beasiswa.tanggal_deadline).toLocaleDateString()}</td>
                        <td>Rp {beasiswa.biaya_daftar ? parseInt(beasiswa.biaya_daftar).toLocaleString('id-ID') : '-'}</td>
                        <td>{beasiswa.penerima_uccd}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section id="lomba" className={`mt-5 ${styles.infoSection}`}>
              <h2 className={styles.sectionTitle}>Daftar Lomba</h2>
              <div className="table-responsive">
                <table className="table table-striped table-bordered table-hover">
                  <thead className="thead-dark">
                    <tr>
                      <th>Nama Lomba</th>
                      <th>Penyelenggara</th>
                      <th>Batasan Tahun</th>
                      <th>Batasan Prodi</th>
                      <th>Deadline</th>
                      <th>Biaya</th>
                      <th>Pemenang UCCD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lombaData.map((lomba) => (
                      <tr key={lomba.id}>
                        <td>{lomba.nama_lomba}</td>
                        <td>{lomba.penyelenggara}</td>
                        <td>{lomba.batasan_tahun}</td>
                        <td>{lomba.batasan_prodi}</td>
                        <td>{new Date(lomba.tanggal_deadline).toLocaleDateString()}</td>
                        <td>Rp {lomba.biaya_daftar ? parseInt(lomba.biaya_daftar).toLocaleString('id-ID') : '-'}</td>
                        <td>{lomba.pemenang_uccd}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}