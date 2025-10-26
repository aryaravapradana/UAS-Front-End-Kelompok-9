async function getBootcamp() {
  const res = await fetch('http://127.0.0.1:8000/api/bootcamp', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

export default async function BootcampPage() {
  const data = await getBootcamp();

  return (
    <div>
      <h1 className="text-center mb-4">Daftar Bootcamp</h1>
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
            <tr key={bootcamp.id_bootcamp}>
              <td>{bootcamp.nama_bootcamp}</td>
              <td>{bootcamp.penyelenggara}</td>
              <td>{new Date(bootcamp.tanggal_deadline).toLocaleDateString()}</td>
              <td>Rp {parseInt(bootcamp.biaya_daftar).toLocaleString('id-ID')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
