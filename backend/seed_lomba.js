const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding lomba data...');

  // Create solo competition
  const soloLomba = await prisma.lomba.create({
    data: {
      nama_lomba: 'UI/UX Design Challenge 2025',
      penyelenggara: 'Google Developers',
      batasan_tahun: '2020-2024',
      batasan_prodi: 'Semua Prodi',
      tanggal_deadline: new Date('2025-06-30'),
      biaya_daftar: 0,
      posterUrl: '/info/default-lomba.png',
      max_anggota: 1, // Solo competition
    },
  });

  console.log('Created solo competition:', soloLomba.nama_lomba);

  // Create team competition
  const teamLomba = await prisma.lomba.create({
    data: {
      nama_lomba: 'Hackathon Indonesia 2025',
      penyelenggara: 'Kementerian Komunikasi dan Informatika',
      batasan_tahun: '2020-2024',
      batasan_prodi: 'Semua Prodi',
      tanggal_deadline: new Date('2025-07-15'),
      biaya_daftar: 50000,
      posterUrl: '/info/default-lomba.png',
      max_anggota: 3, // Team competition (max 3 members)
    },
  });

  console.log('Created team competition:', teamLomba.nama_lomba);

  console.log('\\nSeeding complete!');
  console.log('Solo competition ID:', soloLomba.id);
  console.log('Team competition ID:', teamLomba.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
