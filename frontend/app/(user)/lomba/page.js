'use client';

import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useTransition } from '../context/TransitionContext';
import FadeInOnScroll from '../components/FadeInOnScroll';

async function getLomba() {
  const res = await fetch('http://127.0.0.1:3001/api/lombas', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch data from backend');
  }
  return res.json();
}

export default function LombaPage() {
  const [data, setData] = useState(null);
  const { endTransition } = useTransition();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lombaData = await getLomba();
        setData(lombaData);
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
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="container py-5" style={{ marginTop: '80px' }}>
        <FadeInOnScroll>
          <h1 className="text-center mb-4">Daftar Lomba</h1>
        </FadeInOnScroll>
        <FadeInOnScroll>
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
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
                {data.map((lomba) => (
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
        </FadeInOnScroll>
      </main>
    </div>
  );
}
