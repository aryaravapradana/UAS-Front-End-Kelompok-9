async function getLomba() {
  const res = await fetch('http://127.0.0.1:8000/api/lomba', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

export default async function LombaPage() {
  const data = await getLomba();

  return (
    <div>
      <h1 className="text-center mb-4">Daftar Lomba</h1>
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
            <tr key={lomba.id_lomba}>
              <td>{lomba.nama_lomba}</td>
              <td>{lomba.penyelenggara}</td>
              <td>{lomba.batasan_tahun}</td>
              <td>{lomba.batasan_prodi}</td>
              <td>{new Date(lomba.tanggal_deadline).toLocaleDateString()}</td>
              <td>Rp {parseInt(lomba.biaya_daftar).toLocaleString('id-ID')}</td>
              <td>{lomba.pemenang_uccd}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
