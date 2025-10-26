async function getBeasiswa() {
  const res = await fetch('http://127.0.0.1:8000/api/beasiswa', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

export default async function BeasiswaPage() {
  const data = await getBeasiswa();

  return (
    <div>
      <h1 className="text-center mb-4">Daftar Beasiswa</h1>
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
            <tr key={beasiswa.nama_beasiswa}>
              <td>{beasiswa.nama_beasiswa}</td>
              <td>{beasiswa.penyelenggara}</td>
              <td>{beasiswa.batasan_tahun}</td>
              <td>{beasiswa.batasan_prodi}</td>
              <td>{new Date(beasiswa.tanggal_deadline).toLocaleDateString()}</td>
              <td>Rp {parseInt(beasiswa.biaya_daftar).toLocaleString('id-ID')}</td>
              <td>{beasiswa.penerima_uccd}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
