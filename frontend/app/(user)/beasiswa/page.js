'use client';

import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useTransition } from '../context/TransitionContext';
import FadeInOnScroll from '../components/FadeInOnScroll';

async function getBeasiswa() {
  const res = await fetch('http://127.0.0.1:3001/api/beasiswas', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch data from backend');
  }
  return res.json();
}

export default function BeasiswaPage() {
  const [data, setData] = useState(null);
  const { endTransition } = useTransition();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const beasiswaData = await getBeasiswa();
        setData(beasiswaData);
      } catch (error) {
        console.error(error);
      } finally {
        endTransition();
      }
    };
    fetchData();
  }, [endTransition]);

  if (!data) {
    return (
      <div>
        <Header />
        {/* Render nothing or a minimal loader, the curtain is covering the screen */}
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="container py-5" style={{ marginTop: '80px' }}>
        <FadeInOnScroll>
          <h1 className="text-center mb-4">Daftar Beasiswa</h1>
        </FadeInOnScroll>
        <FadeInOnScroll>
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
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
                {data.map((beasiswa) => (
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
        </FadeInOnScroll>
      </main>
    </div>
  );
}
