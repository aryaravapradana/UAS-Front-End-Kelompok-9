const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Fetching all members to inspect data...');
  
  const allMembers = await prisma.member.findMany({
    select: {
      id: true,
      email: true,
      nama_lengkap: true,
      nim: true
    }
  });

  console.log(`Total members found: ${allMembers.length}`);
  
  const nullEmailMembers = allMembers.filter(m => m.email === null || m.email === undefined);
  console.log(`Members with null/undefined email (JS filter): ${nullEmailMembers.length}`);

  if (nullEmailMembers.length > 0) {
    console.log('Listing members with null email:');
    nullEmailMembers.forEach(m => {
      console.log(`- ID: ${m.id}, NIM: ${m.nim}, Name: ${m.nama_lengkap}, Email: ${m.email}`);
    });
    
    if (nullEmailMembers.length > 0) {
       console.log('\nAttempting to fix duplicates by assigning dummy emails...');
       // Update ALL members with null email to have a unique dummy email
       for (const m of nullEmailMembers) {
         const dummyEmail = `no_email_${m.nim}_${Date.now()}@placeholder.com`;
         await prisma.member.update({
            where: { id: m.id },
            data: { email: dummyEmail }
         });
         console.log(`Updated ${m.nim} with email: ${dummyEmail}`);
       }
    }
  } else {
    console.log('No null emails found in JS check either.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
