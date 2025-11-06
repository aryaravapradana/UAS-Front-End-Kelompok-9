'use client';

import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useTransition } from '../context/TransitionContext';

async function getBootcamp() {
  const res = await fetch('http://127.0.0.1:3001/api/bootcamps', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch data from backend');
  }
  return res.json();
}

export default function BootcampPage() {
  const [data, setData] = useState(null);
  const { endTransition } = useTransition();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bootcampData = await getBootcamp();
        setData(bootcampData);
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
        <h1 className="text-center mb-4">Daftar Bootcamp</h1>
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>Nama Bootcamp</th>
                <th>Penyelenggara</th>
                <th>Deadline</th>
                <th>Biaya</th>
              </tr>
            </thead>
            <tbody>
              {data.map((bootcamp) => (
                <tr key={bootcamp.id}>
                  <td>{bootcamp.nama_bootcamp}</td>
                  <td>{bootcamp.penyelenggara}</td>
                  <td>{new Date(bootcamp.tanggal_deadline).toLocaleDateString()}</td>
                  <td>Rp {bootcamp.biaya_daftar ? parseInt(bootcamp.biaya_daftar).toLocaleString('id-ID') : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}