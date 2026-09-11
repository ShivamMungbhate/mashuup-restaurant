import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.restaurant.updateMany({
    data: {
      name: 'Mashuup',
      tagline: 'Delicious Food & Great Moments.',
      phone: '9009310300',
      email: 'mashupfoodcart@gmail.com',
      instagramUrl: 'https://instagram.com/mashuupfoodcart',
    },
  });

  console.log('Database updated successfully with Mashuup details!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
