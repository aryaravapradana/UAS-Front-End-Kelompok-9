import Header from '../components/Header';

async function getTalk() {
  // Corrected API endpoint and port
  const res = await fetch('http://127.0.0.1:3001/api/talks', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch data from backend');
  }
  return res.json();
}

export default async function TalkPage() {
  const data = await getTalk();

  return (
    <div>
      <Header />
      <main className="container py-5" style={{ marginTop: '80px' }}>
        <h1 className="text-center mb-4">Daftar Talk</h1>
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>Nama Seminar</th>
                <th>Penyelenggara</th>
                <th>Tanggal Pelaksanaan</th>
                <th>Biaya</th>
                <th>Feedback Member</th>
              </tr>
            </thead>
            <tbody>
              {data.map((talk) => (
                <tr key={talk.id}>
                  <td>{talk.nama_seminar}</td>
                  <td>{talk.penyelenggara}</td>
                  <td>{new Date(talk.tanggal_pelaksanaan).toLocaleDateString()}</td>
                  <td>Rp {talk.biaya_daftar ? parseInt(talk.biaya_daftar).toLocaleString('id-ID') : '-'}</td>
                  <td>{talk.feedback_member}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}