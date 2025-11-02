const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding started...');

  // 1. Delete all existing data
  console.log('Deleting existing data...');
  await prisma.pesertaBootcamp.deleteMany({});
  await prisma.pesertaTalk.deleteMany({});
  await prisma.pesertaBeasiswa.deleteMany({});
  await prisma.pesertaLomba.deleteMany({});
  await prisma.bootcamp.deleteMany({});
  await prisma.talk.deleteMany({});
  await prisma.beasiswa.deleteMany({});
  await prisma.lomba.deleteMany({});
  await prisma.member.deleteMany({});

  // 2. Create new data
  console.log('Creating new data...');

  // Hash passwords
  const adminPassword = await bcrypt.hash('admin123', 12);
  const memberPassword = await bcrypt.hash('member123', 12);

  // Create Members
  const adminUser = await prisma.member.create({
    data: {
      nim: '535249999',
      password: adminPassword,
      nama_lengkap: 'Admin User',
      prodi: 'Teknik Informatika',
      angkatan: '24',
      role: 'admin',
    },
  });

  const regularUser = await prisma.member.create({
    data: {
      nim: '535248888',
      password: memberPassword,
      nama_lengkap: 'Regular Member',
      prodi: 'Teknik Informatika',
      angkatan: '24',
      role: 'member',
    },
  });

  console.log('Created users:', { adminUser, regularUser });

  // Create Events
  const lomba = await prisma.lomba.create({
    data: {
      nama_lomba: 'UCCD Competitive Programming',
      penyelenggara: 'UCCD',
      tanggal_deadline: new Date('2025-12-01'),
      biaya_daftar: 0,
    },
  });

  const beasiswa = await prisma.beasiswa.create({
    data: {
      nama_beasiswa: 'UMN Scholarship',
      penyelenggara: 'Universitas Multimedia Nusantara',
      tanggal_deadline: new Date('2025-11-15'),
    },
  });

  const talk = await prisma.talk.create({
    data: {
      nama_seminar: 'Getting Started with AI',
      penyelenggara: 'Google',
      tanggal_pelaksanaan: new Date('2025-11-25'),
    },
  });

  const bootcamp = await prisma.bootcamp.create({
    data: {
      nama_bootcamp: 'Data Science Intensive',
      penyelenggara: 'Algoritma',
      tanggal_deadline: new Date('2025-11-20'),
      biaya_daftar: 1000000,
    },
  });

  console.log('Created events:', { lomba, beasiswa, talk, bootcamp });

  // Create some registrations
  console.log('Creating registrations...');
  const lombaRegistration = await prisma.pesertaLomba.create({
    data: {
      nim: regularUser.nim,
      id_lomba: lomba.id,
      tanggal_daftar: new Date(),
    },
  });

  const talkRegistration = await prisma.pesertaTalk.create({
    data: {
      nim: regularUser.nim,
      id_talk: talk.id,
      tanggal_daftar: new Date(),
    },
  });

  const bootcampRegistration = await prisma.pesertaBootcamp.create({
    data: {
      nim: regularUser.nim,
      id_bootcamp: bootcamp.id,
      tanggal_daftar: new Date(),
    },
  });

  const beasiswaRegistration = await prisma.pesertaBeasiswa.create({
    data: {
      nim: regularUser.nim,
      nama_beasiswa: beasiswa.nama_beasiswa,
      tanggal_daftar: new Date(),
    },
  });

  console.log('Created registrations:', { lombaRegistration, talkRegistration, bootcampRegistration, beasiswaRegistration });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Seeding finished.');
  });
