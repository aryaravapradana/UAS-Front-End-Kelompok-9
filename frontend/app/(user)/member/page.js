import Header from '../components/Header';

async function getMember() {
  const res = await fetch('http://127.0.0.1:8000/api/member', { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

export default async function MemberPage() {
  const data = await getMember();

  return (
    <div>
      <Header />
      <h1 className="text-center mb-4">Daftar Member</h1>
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
  );
}