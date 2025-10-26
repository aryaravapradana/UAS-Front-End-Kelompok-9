async function getTalk() {
  const res = await fetch('http://127.0.0.1:8000/api/talk', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

export default async function TalkPage() {
  const data = await getTalk();

  return (
    <div>
      <h1 className="text-center mb-4">Daftar Talk</h1>
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
            <tr key={talk.id_talk}>
              <td>{talk.nama_seminar}</td>
              <td>{talk.penyelenggara}</td>
              <td>{new Date(talk.tanggal_pelaksanaan).toLocaleDateString()}</td>
              <td>Rp {parseInt(talk.biaya_daftar).toLocaleString('id-ID')}</td>
              <td>{talk.feedback_member}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
