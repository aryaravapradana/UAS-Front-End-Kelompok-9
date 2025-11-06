import Header from '../components/Header';

async function getBootcamp() {
  // Corrected API endpoint and port
  const res = await fetch('http://127.0.0.1:3001/api/bootcamps', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch data from backend');
  }
  return res.json();
}

export default async function BootcampPage() {
  const data = await getBootcamp();

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
                <tr key={bootcamp.id}> {/* Use unique id for key */}
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