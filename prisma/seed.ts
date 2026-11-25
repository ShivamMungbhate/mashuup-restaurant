import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database for Mashuup Cafe...');

  // 1. Admin User
  await prisma.adminUser.deleteMany();
  const passwordHash = await bcrypt.hash('Shivam30', 10);
  await prisma.adminUser.create({
    data: {
      name: 'Shivam Admin',
      email: 'square4oot@gmail.com',
      passwordHash,
    },
  });
  console.log('Admin user: square4oot@gmail.com');

  // 2. Restaurant Profile
  await prisma.restaurant.deleteMany();
  await prisma.restaurant.create({
    data: {
      name: 'Mashuup Cafe',
      tagline: 'Good Food. Good Vibes. Great Times.',
      description:
        'A 100% Pure Veg street food cafe serving freshly crafted street favorites — pizzas, pasta, momos, burgers, sandwiches, Indo-Chinese, and refreshing beverages.',
      about:
        'Welcome to Mashuup Cafe — Street Eats & Sips! We bring together the best of street food and cafe culture. From crispy momos and loaded fries to rich cold coffees and refreshing mojitos, every item is crafted fresh with quality ingredients. Come hungry, leave happy!',
      heroImage:
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80',
      restaurantImage:
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
      logo: '/logo.jpg',
      address: 'Near Pola Ground, Poonam Chamber, Chhindwara, Madhya Pradesh',
      phone: '9009310300',
      email: 'mashupfoodcart@gmail.com',
      instagramUrl: 'https://www.instagram.com/mashuupcafe_',
      mapUrl:
        'https://www.google.com/maps/place/Kalptaru+Healthcare+Birth+AND+Breath/@22.0488697,78.9283554,3229m/data=!3m1!1e3!4m10!1m2!2m1!1sKalptaru+chhindwara!3m6!1s0x3bd5693dbca53207:0xbef3933eb3ca1f65!8m2!3d22.0488697!4d78.9371101!15sChNLYWxwdGFydSBjaGhpbmR3YXJhWhUiE2thbHB0YXJ1IGNoaGluZHdhcmGSAQhob3NwaXRhbJoBI0NoWkRTVWhOTUc5blMwVkpRMEZuVFVSM2FDMVRVbVJCRUFF4AEA-gEECAAQPA!16s%2Fg%2F11y2tdkn5t?authuser=0&entry=ttu',
    },
  });

  // 3. Opening Hours
  await prisma.openingHour.deleteMany();
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  for (let i = 0; i < days.length; i++) {
    await prisma.openingHour.create({
      data: { day: days[i], openTime: '11:00 AM', closeTime: '11:00 PM', isClosed: false, displayOrder: i + 1 },
    });
  }

  // 4. Menu Categories & Items
  await prisma.menuItem.deleteMany();
  await prisma.menuCategory.deleteMany();

  // ── STREET EATS ──────────────────────────────────────────────────────────────
  // Category: PIZZA
  const pizza = await prisma.menuCategory.create({
    data: { name: 'Pizza', description: 'Freshly baked pizzas with rich toppings', displayOrder: 1 },
  });
  await prisma.menuItem.createMany({
    data: [
      { categoryId: pizza.id, name: 'Classic Pizza', description: 'Classic tomato sauce pizza with mozzarella cheese.', price: 149, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: true, displayOrder: 1 },
      { categoryId: pizza.id, name: 'Farmhouse Pizza', description: 'Loaded with capsicum, onion, tomato, corn & black olives.', price: 189, image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: true, displayOrder: 2 },
      { categoryId: pizza.id, name: 'Paneer Tikka Pizza', description: 'Marinated paneer tikka pieces with capsicum and onion.', price: 199, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 3 },
      { categoryId: pizza.id, name: 'Corn Cheese Pizza', description: 'Sweet corn and gooey melted cheese on tangy tomato base.', price: 169, image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 4 },
    ],
  });

  // Category: PASTA
  const pasta = await prisma.menuCategory.create({
    data: { name: 'Pasta', description: 'Creamy and saucy pasta dishes made fresh', displayOrder: 2 },
  });
  await prisma.menuItem.createMany({
    data: [
      { categoryId: pasta.id, name: 'White Sauce Pasta', description: 'Penne pasta in a rich creamy béchamel white sauce.', price: 139, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 1 },
      { categoryId: pasta.id, name: 'Red Sauce Pasta', description: 'Al dente pasta in a tangy tomato-based arrabbiata sauce.', price: 139, image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 2 },
      { categoryId: pasta.id, name: 'Pesto Pasta', description: 'Fresh basil pesto sauce tossed with penne and parmesan.', price: 149, image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 3 },
    ],
  });

  // Category: SOUP
  const soup = await prisma.menuCategory.create({
    data: { name: 'Soup', description: 'Hot & comforting soups made fresh daily', displayOrder: 3 },
  });
  await prisma.menuItem.createMany({
    data: [
      { categoryId: soup.id, name: 'Hot & Sour Soup', description: 'Classic Indo-Chinese hot and sour vegetable soup.', price: 79, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 1 },
      { categoryId: soup.id, name: 'Manchow Soup', description: 'Spicy Manchow soup with crispy fried noodles on top.', price: 79, image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 2 },
      { categoryId: soup.id, name: 'Tomato Soup', description: 'Creamy fresh tomato soup with croutons.', price: 99, image: 'https://images.unsplash.com/photo-1620379015764-10e1a09d5327?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 3 },
    ],
  });

  // Category: MASHUUP SPECIAL
  const special = await prisma.menuCategory.create({
    data: { name: 'Mashuup Special', description: 'Our signature must-try dishes', displayOrder: 4 },
  });
  await prisma.menuItem.createMany({
    data: [
      { categoryId: special.id, name: 'Baby Potatoes with Cajun Sauce', description: 'Crispy baby potatoes tossed in zesty cajun sauce.', price: 159, image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: true, displayOrder: 1 },
      { categoryId: special.id, name: 'Fried Ice Cream – Vanilla', description: 'Golden crispy fried vanilla ice cream — a hot-cold delight!', price: 99, image: 'https://images.unsplash.com/photo-1570197571499-166b36435e9f?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: true, displayOrder: 2 },
      { categoryId: special.id, name: 'Fried Ice Cream – Butterscotch', description: 'Golden crispy fried butterscotch ice cream with caramel drizzle.', price: 129, image: 'https://images.unsplash.com/photo-1570197571499-166b36435e9f?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 3 },
      { categoryId: special.id, name: 'Cheese Ball with Tartar Sauce', description: 'Crispy golden cheese balls served with creamy tartar dipping sauce.', price: 149, image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: true, displayOrder: 4 },
    ],
  });

  // Category: QUICK BITES
  const quickBites = await prisma.menuCategory.create({
    data: { name: 'Quick Bites', description: 'Crispy snacks and bites — perfect for any time!', displayOrder: 5 },
  });
  await prisma.menuItem.createMany({
    data: [
      { categoryId: quickBites.id, name: 'Classic Salted Fries (Reg)', description: 'Golden crispy salted potato fries — regular size.', price: 79, image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 1 },
      { categoryId: quickBites.id, name: 'Peri Peri Fries (Reg)', description: 'Fries tossed with fiery peri peri seasoning — regular size.', price: 89, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 2 },
      { categoryId: quickBites.id, name: 'Loaded Cheesy Fries (Reg)', description: 'Crispy fries loaded with gooey melted cheese sauce — regular size.', price: 119, image: 'https://images.unsplash.com/photo-1562059390-a761a084768e?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 3 },
      { categoryId: quickBites.id, name: 'Dahi ke Sholey (3 pc)', description: 'Crispy fried dahi ke sholey — 3 piece serving.', price: 149, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 4 },
      { categoryId: quickBites.id, name: 'Dahi Kebab (8 pc)', description: 'Soft and creamy dahi kebabs — 8 piece serving.', price: 189, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 5 },
      { categoryId: quickBites.id, name: 'Cheese Garlic Bread (2 pc)', description: 'Buttery garlic bread slices topped with melted mozzarella — 2 pcs.', price: 99, image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 6 },
      { categoryId: quickBites.id, name: 'Exotic Veg Garlic Bread (4 pc)', description: 'Garlic bread with exotic veggies and cheese topping — 4 pcs.', price: 149, image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 7 },
      { categoryId: quickBites.id, name: 'Garlic Bread (4 pc)', description: 'Classic buttery garlic bread — 4 piece serving.', price: 149, image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 8 },
      { categoryId: quickBites.id, name: 'Baked Potato', description: 'Oven-baked potato with choice of toppings.', price: 99, image: 'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 9 },
    ],
  });

  // Category: MOMOS SPECIAL
  const momos = await prisma.menuCategory.create({
    data: { name: 'Momos Special', description: 'Steamed, fried & kurkure momos — 6 pieces per serving', displayOrder: 6 },
  });
  await prisma.menuItem.createMany({
    data: [
      { categoryId: momos.id, name: 'Steamed Veg Momos', description: 'Soft steamed veg momos served with spicy red chutney — 6 pcs.', price: 69, image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 1 },
      { categoryId: momos.id, name: 'Steamed Paneer Momos', description: 'Soft steamed paneer-stuffed momos served with spicy chutney — 6 pcs.', price: 89, image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 2 },
      { categoryId: momos.id, name: 'Crispy Fried Veg Momos', description: 'Golden deep-fried crispy veg momos — 6 pcs.', price: 119, image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: true, displayOrder: 3 },
      { categoryId: momos.id, name: 'Crispy Fried Paneer Momos', description: 'Golden deep-fried paneer momos with spicy dip — 6 pcs.', price: 129, image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: true, displayOrder: 4 },
      { categoryId: momos.id, name: 'Peri Peri Fried Momos', description: 'Crispy fried momos tossed in spicy peri peri seasoning — 6 pcs.', price: 99, image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 5 },
      { categoryId: momos.id, name: 'Kurkure Momos', description: 'Crunchy kurkure-coated momos — uniquely crispy — 6 pcs.', price: 149, image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: true, displayOrder: 6 },
    ],
  });

  // Category: SANDWICHES & BURGER
  const sandwichBurger = await prisma.menuCategory.create({
    data: { name: 'Sandwiches & Burger', description: 'Grilled sandwiches and juicy veg burgers', displayOrder: 7 },
  });
  await prisma.menuItem.createMany({
    data: [
      { categoryId: sandwichBurger.id, name: 'Classic Veg Club Sandwich', description: 'Triple-layer toasted sandwich with veggies, cheese & chutney.', price: 149, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 1 },
      { categoryId: sandwichBurger.id, name: 'Corn & Cheese Grilled Sandwich', description: 'Grilled sandwich stuffed with sweet corn and melted cheese.', price: 129, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 2 },
      { categoryId: sandwichBurger.id, name: 'Paneer Tikka Sandwich', description: 'Spicy marinated paneer tikka stuffed in a grilled sandwich.', price: 119, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 3 },
      { categoryId: sandwichBurger.id, name: 'Bombay Masala Toast Sandwich', description: 'Classic Mumbai-style masala toast with chutneys.', price: 119, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 4 },
      { categoryId: sandwichBurger.id, name: 'Classic Crispy Veg Burger', description: 'Crispy veg patty with lettuce, tomato & burger mayo in a soft bun.', price: 89, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 5 },
      { categoryId: sandwichBurger.id, name: 'Double Cheese Burst Burger', description: 'Double veg patties with double cheese and cheese burst sauce.', price: 119, image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: true, displayOrder: 6 },
    ],
  });

  // Category: WRAPS & ROLLS
  const wraps = await prisma.menuCategory.create({
    data: { name: 'Wraps & Rolls', description: 'Stuffed wraps and crispy rolls packed with flavour', displayOrder: 8 },
  });
  await prisma.menuItem.createMany({
    data: [
      { categoryId: wraps.id, name: 'Veg Kathi Roll / Paneer Tikka Roll', description: 'Spicy veg or paneer tikka wrapped in a soft chapati roll.', price: 149, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 1 },
      { categoryId: wraps.id, name: 'Veg Corn Cheese Roll', description: 'Crispy roll stuffed with sweet corn and melted cheese.', price: 89, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 2 },
      { categoryId: wraps.id, name: 'Spicy Schezwan Paneer Wrap', description: 'Spicy schezwan paneer filling wrapped in a soft chapati.', price: 149, image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 3 },
    ],
  });

  // ── INDO-CHINESE CORNER ───────────────────────────────────────────────────────
  const indoChinese = await prisma.menuCategory.create({
    data: { name: 'Indo-Chinese Corner', description: 'Flavourful Indo-Chinese rice, noodles and starters', displayOrder: 9 },
  });
  await prisma.menuItem.createMany({
    data: [
      { categoryId: indoChinese.id, name: 'Veg Fried Rice', description: 'Stir-fried rice with mixed vegetables and soy sauce.', price: 99, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 1 },
      { categoryId: indoChinese.id, name: 'Schezwan Fried Rice', description: 'Spicy Schezwan-style fried rice with vegetables.', price: 129, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 2 },
      { categoryId: indoChinese.id, name: 'Crispy Chilli Potato', description: 'Crispy potatoes tossed in spicy chilli garlic sauce.', price: 129, image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: true, displayOrder: 3 },
      { categoryId: indoChinese.id, name: 'Veg Manchurian Dry', description: 'Crispy veg manchurian balls in a dry tangy sauce.', price: 99, image: 'https://images.unsplash.com/photo-1555243896-c709bfa0b564?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 4 },
      { categoryId: indoChinese.id, name: 'Veg Manchurian Gravy', description: 'Crispy veg manchurian balls in a rich gravy sauce.', price: 119, image: 'https://images.unsplash.com/photo-1555243896-c709bfa0b564?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 5 },
      { categoryId: indoChinese.id, name: 'Chilli Paneer Dry', description: 'Crispy paneer cubes tossed in spicy chilli sauce — dry style.', price: 149, image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 6 },
      { categoryId: indoChinese.id, name: 'Chilli Paneer Gravy', description: 'Paneer cubes in a saucy spicy chilli gravy.', price: 149, image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 7 },
      { categoryId: indoChinese.id, name: 'Classic Veg Chowmein', description: 'Stir-fried noodles with fresh vegetables and soy sauce.', price: 149, image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 8 },
      { categoryId: indoChinese.id, name: 'Veg Hakka Noodles', description: 'Wok-tossed Hakka noodles with crispy vegetables.', price: 149, image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 9 },
      { categoryId: indoChinese.id, name: 'Chilli Garlic Noodles', description: 'Spicy noodles stir-fried with garlic and chillies.', price: 129, image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 10 },
      { categoryId: indoChinese.id, name: 'Singapore Noodles', description: 'Spicy Singapore-style noodles with veggies and paneer.', price: 159, image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 11 },
    ],
  });

  // ── CHILL & SIP ───────────────────────────────────────────────────────────────
  // Category: HOT BREWS & CHAI
  const hotBrews = await prisma.menuCategory.create({
    data: { name: 'Hot Brews & Chai', description: 'Steaming hot teas and beverages to warm your soul', displayOrder: 10 },
  });
  await prisma.menuItem.createMany({
    data: [
      { categoryId: hotBrews.id, name: 'Adrak Elaichi Kadak Chai', description: 'Strong ginger and cardamom spiced tea — perfectly kadak!', price: 30, image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 1 },
      { categoryId: hotBrews.id, name: 'Masala Chai', description: 'Classic Indian masala chai with aromatic spices.', price: 39, image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 2 },
      { categoryId: hotBrews.id, name: 'Classic Green Tea', description: 'Light and refreshing hot green tea.', price: 30, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 3 },
      { categoryId: hotBrews.id, name: 'Hot Chocolate', description: 'Rich creamy hot chocolate made with premium cocoa.', price: 99, image: 'https://images.unsplash.com/photo-1517578239113-b03992dcdd25?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 4 },
    ],
  });

  // Category: COLD BEVERAGES
  const coldBev = await prisma.menuCategory.create({
    data: { name: 'Cold Beverages', description: 'Chilled coffees, shakes and refreshing mojitos', displayOrder: 11 },
  });
  await prisma.menuItem.createMany({
    data: [
      { categoryId: coldBev.id, name: 'Classic Cold Coffee', description: 'Chilled blended coffee — smooth and refreshing.', price: 99, image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: true, displayOrder: 1 },
      { categoryId: coldBev.id, name: 'Cold Coffee with Ice Cream', description: 'Cold coffee blended with a scoop of vanilla ice cream.', price: 129, image: 'https://images.unsplash.com/photo-1512006410192-eed3ef98ab18?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 2 },
      { categoryId: coldBev.id, name: 'Hazelnut Cold Coffee', description: 'Cold coffee with rich hazelnut flavour.', price: 149, image: 'https://images.unsplash.com/photo-1512006410192-eed3ef98ab18?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 3 },
      { categoryId: coldBev.id, name: 'Oreo Shake', description: 'Thick creamy shake blended with Oreo cookies.', price: 149, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: true, displayOrder: 4 },
      { categoryId: coldBev.id, name: 'Kit Kat Shake', description: 'Creamy thick shake with Kit Kat chocolate crumbles.', price: 139, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 5 },
      { categoryId: coldBev.id, name: 'Chocolate Shake', description: 'Rich chocolate thick shake — a choco lover\'s dream.', price: 129, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 6 },
      { categoryId: coldBev.id, name: 'Butterscotch Shake', description: 'Creamy butterscotch flavoured thick shake.', price: 109, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 7 },
      { categoryId: coldBev.id, name: 'Brownie Thickshake', description: 'Thick shake blended with chocolate brownie chunks.', price: 149, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 8 },
      { categoryId: coldBev.id, name: 'Kesar Badam Shake', description: 'Premium saffron and almond flavoured thick shake.', price: 140, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 9 },
      { categoryId: coldBev.id, name: 'Mint Mojito', description: 'Refreshing mint lemonade with sparkling water.', price: 110, image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 10 },
      { categoryId: coldBev.id, name: 'Blue Lagoon Mojito', description: 'Tropical blue lagoon flavoured mojito — refreshing and vibrant.', price: 110, image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 11 },
      { categoryId: coldBev.id, name: 'Green Apple Mojito', description: 'Tangy green apple flavoured mojito with a fresh twist.', price: 110, image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 12 },
      { categoryId: coldBev.id, name: 'Bubblegum Mojito', description: 'Fun bubblegum flavoured mojito — sweet and refreshing.', price: 110, image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 13 },
    ],
  });

  // Category: SWEETS / DESSERTS
  const desserts = await prisma.menuCategory.create({
    data: { name: 'Sweets & Desserts', description: 'Sweet endings to a perfect meal', displayOrder: 12 },
  });
  await prisma.menuItem.createMany({
    data: [
      { categoryId: desserts.id, name: 'Tutti Frutti Ice Cream', description: 'Classic tutti frutti flavoured ice cream scoop.', price: 149, image: 'https://images.unsplash.com/photo-1560008581-09826d1de69e?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 1 },
      { categoryId: desserts.id, name: 'With Hot Brownie Ice Cream', description: 'Warm chocolate brownie served with a scoop of vanilla ice cream.', price: 179, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: true, displayOrder: 2 },
      { categoryId: desserts.id, name: 'Butterscotch Ice Cream', description: 'Creamy butterscotch flavoured ice cream.', price: 59, image: 'https://images.unsplash.com/photo-1560008581-09826d1de69e?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 3 },
      { categoryId: desserts.id, name: 'Chocolate Ice Cream', description: 'Rich dark chocolate ice cream.', price: 79, image: 'https://images.unsplash.com/photo-1560008581-09826d1de69e?auto=format&fit=crop&w=600&q=80', isVeg: true, isAvailable: true, isFeatured: false, displayOrder: 4 },
    ],
  });

  console.log('✅ Database seeding complete for Mashuup Cafe!');
}

main()
  .catch((e) => {
    console.error('Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
