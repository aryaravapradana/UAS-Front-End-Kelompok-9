'use client';

import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useTransition } from '../context/TransitionContext';
import FadeInOnScroll from '../components/FadeInOnScroll';

async function getMember() {
  const res = await fetch('http://127.0.0.1:3001/api/member', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

export default function MemberPage() {
  const [data, setData] = useState(null);
  const { endTransition } = useTransition();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const memberData = await getMember();
        setData(memberData);
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
          <h1 className="text-center mb-4">Daftar Member</h1>
        </FadeInOnScroll>
        <FadeInOnScroll>
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th>NIM</th>
                  <th>Nama Lengkap</th>
                  <th>Prodi</th>
                  <th>Angkatan</th>
                </tr>
              </thead>
              <tbody>
                {data.map((member) => (
                  <tr key={member.nim}>
                    <td>{member.nim}</td>
                    <td>{member.nama_lengkap}</td>
                    <td>{member.prodi}</td>
                    <td>{member.angkatan}</td>
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
