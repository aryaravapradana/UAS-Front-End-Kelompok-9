'use client';

import { useEffect, useState } from 'react';
import Header from '../../../../components/Header';
import { useTransition } from '../../../../context/TransitionContext';

async function getBootcamp(id) {
  const res = await fetch(`http://127.0.0.1:3001/api/bootcamps/${id}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch data from backend');
  }
  return res.json();
}

export default function BootcampRegistrationPage({ params }) {
  const [data, setData] = useState(null);
  const { endTransition } = useTransition();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bootcampData = await getBootcamp(params.id);
        setData(bootcampData);
      } catch (error) {
        console.error(error);
      } finally {
        endTransition();
      }
    };
    fetchData();
  }, [endTransition, params.id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
    alert('Pendaftaran berhasil!');
  };

  if (!data) {
    return (
      <div>
        <Header />
        <div className="container py-5 text-center" style={{ marginTop: '80px' }}>
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="container py-5" style={{ marginTop: '80px' }}>
        <h1 className="text-center mb-4">Daftar Bootcamp: {data.nama_bootcamp}</h1>
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Nama Lengkap</label>
                <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Alamat Email</label>
                <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <button type="submit" className="btn btn-primary">Daftar</button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
