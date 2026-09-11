import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database for Mashuup...');

  // 1. Admin User (Remove older admins and set square4oot@gmail.com / Shivam30)
  await prisma.adminUser.deleteMany();
  const passwordHash = await bcrypt.hash('Shivam30', 10);
  await prisma.adminUser.create({
    data: {
      name: 'Shivam Admin',
      email: 'square4oot@gmail.com',
      passwordHash,
    },
  });
  console.log('Admin user updated: square4oot@gmail.com');

  // 2. Restaurant Profile
  await prisma.restaurant.deleteMany();
  await prisma.restaurant.create({
    data: {
      name: 'Mashuup',
      tagline: 'Delicious Food & Great Moments.',
      description:
        'A contemporary 100% Pure Veg restaurant and food cart serving fresh grilled pizzas, juicy veg burgers, sandwiches, thick shakes, beverages, and crispy snacks.',
      about:
        'Welcome to Mashuup! We are a brand new 100% Pure Veg restaurant bringing together artisanal pizzas, gourmet burgers, grilled sandwiches, refreshing beverages, and modern street-food favorites. Our team selects fresh, quality ingredients to deliver an unforgettable self-service dining experience.',
      heroImage:
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80',
      restaurantImage:
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
      logo: '/logo.png',
      address: 'Near Pola Ground, Poonam Chamber, Chhindwara, Madhya Pradesh',
      phone: '9009310300',
      email: 'mashupfoodcart@gmail.com',
      instagramUrl: 'https://www.instagram.com/mashuupcafe_?stkn=MTE1cGI5bzFxOHFlOA==',
      mapUrl:
        'https://www.google.com/maps/place/Kalptaru+Healthcare+Birth+AND+Breath/@22.0488697,78.9283554,3229m/data=!3m1!1e3!4m10!1m2!2m1!1sKalptaru+chhindwara!3m6!1s0x3bd5693dbca53207:0xbef3933eb3ca1f65!8m2!3d22.0488697!4d78.9371101!15sChNLYWxwdGFydSBjaGhpbmR3YXJhWhUiE2thbHB0YXJ1IGNoaGluZHdhcmGSAQhob3NwaXRhbJoBI0NoWkRTVWhOTUc5blMwVkpRMEZuVFVSM2FDMVRVbVJCRUFF4AEA-gEECAAQPA!16s%2Fg%2F11y2tdkn5t?authuser=0&entry=ttu&g_ep=EgoyMDI2MDkwOC4wIKXMDSoASAFQAw%3D%3D',
    },
  });

  // 3. Opening Hours (11:00 AM - 11:00 PM for all 7 days)
  await prisma.openingHour.deleteMany();
  const defaultHours = [
    { day: 'Monday', openTime: '11:00 AM', closeTime: '11:00 PM', isClosed: false, displayOrder: 1 },
    { day: 'Tuesday', openTime: '11:00 AM', closeTime: '11:00 PM', isClosed: false, displayOrder: 2 },
    { day: 'Wednesday', openTime: '11:00 AM', closeTime: '11:00 PM', isClosed: false, displayOrder: 3 },
    { day: 'Thursday', openTime: '11:00 AM', closeTime: '11:00 PM', isClosed: false, displayOrder: 4 },
    { day: 'Friday', openTime: '11:00 AM', closeTime: '11:00 PM', isClosed: false, displayOrder: 5 },
    { day: 'Saturday', openTime: '11:00 AM', closeTime: '11:00 PM', isClosed: false, displayOrder: 6 },
    { day: 'Sunday', openTime: '11:00 AM', closeTime: '11:00 PM', isClosed: false, displayOrder: 7 },
  ];
  for (const h of defaultHours) {
    await prisma.openingHour.create({ data: h });
  }

  // 4. Categories & Pure Veg Menu Items (Burgers, Pizzas, Beverages, Sandwiches, Snacks, Desserts)
  await prisma.menuItem.deleteMany();
  await prisma.menuCategory.deleteMany();

  const burgers = await prisma.menuCategory.create({
    data: {
      name: 'Burgers',
      description: 'Juicy, crispy 100% Pure Veg burgers loaded with cheese and sauces',
      displayOrder: 1,
    },
  });

  const pizzas = await prisma.menuCategory.create({
    data: {
      name: 'Pizzas',
      description: 'Oven-fresh hand-tossed vegetable pizzas with rich mozzarella',
      displayOrder: 2,
    },
  });

  const beverages = await prisma.menuCategory.create({
    data: {
      name: 'Beverages & Thick Shakes',
      description: 'Refreshing cold drinks, fruit juices, iced teas, and rich thick shakes',
      displayOrder: 3,
    },
  });

  const sandwiches = await prisma.menuCategory.create({
    data: {
      name: 'Sandwiches',
      description: 'Golden grilled, triple-layered club sandwiches',
      displayOrder: 4,
    },
  });

  const snacks = await prisma.menuCategory.create({
    data: {
      name: 'Quick Snacks & Fries',
      description: 'Crispy peri peri fries, nachos, and cheese balls',
      displayOrder: 5,
    },
  });

  const desserts = await prisma.menuCategory.create({
    data: {
      name: 'Desserts',
      description: 'Hot sizzling brownies, lava cakes, and sweet delights',
      displayOrder: 6,
    },
  });

  // BURGERS
  await prisma.menuItem.createMany({
    data: [
      {
        categoryId: burgers.id,
        name: 'Classic Veg Cheese Burger',
        description: 'Crispy potato-veggie patty topped with melted cheese slice, lettuce, tomato, and burger mayo.',
        price: 110,
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
        isVeg: true,
        isAvailable: true,
        isFeatured: true,
        displayOrder: 1,
      },
      {
        categoryId: burgers.id,
        name: 'Paneer Tikka Crunch Burger',
        description: 'Marinated grilled paneer patty drizzled with spicy tikka sauce, jalapenos, and melted cheese.',
        price: 140,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
        isVeg: true,
        isAvailable: true,
        isFeatured: true,
        displayOrder: 2,
      },
      {
        categoryId: burgers.id,
        name: 'Double Cheese Burst Burger',
        description: 'Double veg patties layered with double cheddar cheese slices and liquid cheese bomb sauce.',
        price: 160,
        image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=600&q=80',
        isVeg: true,
        isAvailable: true,
        isFeatured: false,
        displayOrder: 3,
      },
    ],
  });

  // PIZZAS
  await prisma.menuItem.createMany({
    data: [
      {
        categoryId: pizzas.id,
        name: 'Classic Margherita Pizza',
        description: 'Italian San Marzano tomato sauce, fresh basil oil, and generous mozzarella cheese.',
        price: 190,
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
        isVeg: true,
        isAvailable: true,
        isFeatured: true,
        displayOrder: 1,
      },
      {
        categoryId: pizzas.id,
        name: 'Farmhouse Special Veggie Pizza',
        description: 'Loaded with capsicum, crunchy onions, sweet corn, juicy tomatoes, and black olives.',
        price: 240,
        image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=600&q=80',
        isVeg: true,
        isAvailable: true,
        isFeatured: true,
        displayOrder: 2,
      },
      {
        categoryId: pizzas.id,
        name: 'Paneer Makhani Cheese Pizza',
        description: 'Tender tandoori paneer cubes, red paprika, capsicum, and makhani cheese sauce.',
        price: 270,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
        isVeg: true,
        isAvailable: true,
        isFeatured: true,
        displayOrder: 3,
      },
    ],
  });

  // BEVERAGES
  await prisma.menuItem.createMany({
    data: [
      {
        categoryId: beverages.id,
        name: 'Oreo Chocolate Thick Shake',
        description: 'Rich creamy milk blended with crunchy Oreo cookies and chocolate drizzle.',
        price: 140,
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
        isVeg: true,
        isAvailable: true,
        isFeatured: true,
        displayOrder: 1,
      },
      {
        categoryId: beverages.id,
        name: 'Fresh Orange Citrus Juice',
        description: 'Freshly squeezed natural orange juice filled with refreshing vitamin C goodness.',
        price: 90,
        image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80',
        isVeg: true,
        isAvailable: true,
        isFeatured: true,
        displayOrder: 2,
      },
      {
        categoryId: beverages.id,
        name: 'Mint Lemon Lime Mojito Cooler',
        description: 'Sparkling soda muddled with fresh mint leaves, lime juice, and crushed ice.',
        price: 100,
        image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
        isVeg: true,
        isAvailable: true,
        isFeatured: false,
        displayOrder: 3,
      },
      {
        categoryId: beverages.id,
        name: 'Artisanal Cold Brew Coffee',
        description: 'Single-origin espresso slow-brewed over ice with a hint of vanilla cream.',
        price: 120,
        image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80',
        isVeg: true,
        isAvailable: true,
        isFeatured: false,
        displayOrder: 4,
      },
    ],
  });

  // SANDWICHES
  await prisma.menuItem.createMany({
    data: [
      {
        categoryId: sandwiches.id,
        name: 'Mashuup Special Grilled Club Sandwich',
        description: 'Triple-layer toasted sandwich stuffed with paneer, fresh veggies, cheese, and signature green chutney.',
        price: 160,
        image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80',
        isVeg: true,
        isAvailable: true,
        isFeatured: true,
        displayOrder: 1,
      },
      {
        categoryId: sandwiches.id,
        name: 'Cheese Garlic Toast',
        description: 'Crusty garlic bread topped with melted butter, herbs, and mozzarella cheese.',
        price: 120,
        image: 'https://images.unsplash.com/photo-1572656631137-7935297eff55?auto=format&fit=crop&w=600&q=80',
        isVeg: true,
        isAvailable: true,
        isFeatured: false,
        displayOrder: 2,
      },
    ],
  });

  // SNACKS
  await prisma.menuItem.createMany({
    data: [
      {
        categoryId: snacks.id,
        name: 'Crispy Peri Peri Fries',
        description: 'Golden potato fries tossed in spicy peri-peri seasoning.',
        price: 110,
        image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80',
        isVeg: true,
        isAvailable: true,
        isFeatured: true,
        displayOrder: 1,
      },
      {
        categoryId: snacks.id,
        name: 'Loaded Paneer Nachos',
        description: 'Crispy tortilla chips topped with spiced paneer, melted cheese sauce, and jalapenos.',
        price: 150,
        image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=600&q=80',
        isVeg: true,
        isAvailable: true,
        isFeatured: false,
        displayOrder: 2,
      },
    ],
  });

  // DESSERTS
  await prisma.menuItem.createMany({
    data: [
      {
        categoryId: desserts.id,
        name: 'Hot Chocolate Sizzling Brownie',
        description: 'Warm fudgy eggless brownie served on a hot sizzler plate with vanilla ice cream and hot chocolate fudge.',
        price: 170,
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
        isVeg: true,
        isAvailable: true,
        isFeatured: true,
        displayOrder: 1,
      },
    ],
  });

  console.log('Database seeding finished successfully for Mashuup!');
}

main()
  .catch((e) => {
    console.error('Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
