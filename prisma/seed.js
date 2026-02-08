const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Clear existing
  await prisma.wishlist.deleteMany({})
  await prisma.orderItem.deleteMany({})
  await prisma.order.deleteMany({})
  await prisma.product.deleteMany({})
  await prisma.category.deleteMany({})
  await prisma.brand.deleteMany({})
  await prisma.banner.deleteMany({})

  // 1. Categories
  const actionFigures = await prisma.category.create({ data: { name: 'Action Figures', slug: 'action-figures' } })
  const collectibles = await prisma.category.create({ data: { name: 'Collectibles', slug: 'collectibles' } })
  const rolePlay = await prisma.category.create({ data: { name: 'Role Play Gear', slug: 'role-play' } })

  // 2. Brands - Own Brands
  const avengers = await prisma.brand.create({ data: { name: 'Avengers Exclusive', type: 'OWN' } })
  const starkTech = await prisma.brand.create({ data: { name: 'Stark Tech', type: 'OWN' } })
  const wakandaForever = await prisma.brand.create({ data: { name: 'Wakanda Forever', type: 'OWN' } })

  // 2b. Brands - Third Party with logos
  const marvel = await prisma.brand.create({ data: { name: 'Marvel Studios', type: 'THIRD_PARTY', logo: 'https://images.unsplash.com/photo-1635863138275-d9b33299680b?q=80&w=300' } })
  const hasbro = await prisma.brand.create({ data: { name: 'Hasbro', type: 'THIRD_PARTY', logo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=300' } })
  const funko = await prisma.brand.create({ data: { name: 'Funko Pop', type: 'THIRD_PARTY', logo: 'https://images.unsplash.com/photo-1608889476518-738c9b1dcb40?q=80&w=300' } })

  // 3. Hero Banners
  await prisma.banner.createMany({
    data: [
      {
        title: 'Avengers Endgame Collection',
        subtitle: 'Limited Edition 2026 Series - Shop Now',
        image: 'https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?q=80&w=2000',
        link: '/products',
        order: 1,
        active: true
      },
      {
        title: 'New Spider-Man Arrivals',
        subtitle: 'Swing into action with the latest collection',
        image: 'https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?q=80&w=2000',
        link: '/category/action-figures',
        order: 2,
        active: true
      },
      {
        title: 'Exclusive Stark Tech',
        subtitle: 'Premium Iron Man collectibles only at Avengers HQ',
        image: 'https://images.unsplash.com/photo-1635863138275-d9b33299680b?q=80&w=2000',
        link: '/category/exclusives',
        order: 3,
        active: true
      }
    ]
  })

  // 4. Products
  const heroes = ['Iron Man', 'Spider-Man', 'Captain America', 'Thor', 'Hulk', 'Black Panther', 'Doctor Strange', 'Ant-Man', 'Thanos', 'Loki']
  const types = ['Action Figure', 'Titan Hero', 'Electronic Helmet', 'Shield Replica', 'Infinity Gauntlet']

  const heroImages = {
    'Iron Man': 'https://images.unsplash.com/photo-1635863138275-d9b33299680b?q=80&w=500',
    'Spider-Man': 'https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?q=80&w=500',
    'Captain America': 'https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?q=80&w=500',
    'Thor': 'https://images.unsplash.com/photo-1655720828018-edd2daec9349?q=80&w=500',
    'Hulk': 'https://images.unsplash.com/photo-1530982011887-3cc11cc85693?q=80&w=500',
    'Black Panther': 'https://images.unsplash.com/photo-1559535332-db9971090158?q=80&w=500',
    'Doctor Strange': 'https://images.unsplash.com/photo-1620336655052-b57986f5a26a?q=80&w=500',
    'Ant-Man': 'https://images.unsplash.com/photo-1611604548018-d56bbd85d681?q=80&w=500',
    'Thanos': 'https://images.unsplash.com/photo-1598552920507-59e78c62ee76?q=80&w=500',
    'Loki': 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?q=80&w=500'
  }

  const products = []
  const allBrands = [avengers, starkTech, wakandaForever, marvel, hasbro, funko]
  const allCategories = [actionFigures, collectibles, rolePlay]

  for (let i = 1; i <= 40; i++) {
    const hero = heroes[i % heroes.length]
    const type = types[i % types.length]
    const basePrice = 999 + (i * 100)
    const hasDiscount = i % 4 === 0 // Every 4th product has discount

    products.push({
      name: `${hero} ${type}`,
      description: `Premium quality ${hero} toy from the Avengers Saga. Authentic detailing and movable joints. Perfect for collectors and fans of all ages.`,
      price: basePrice,
      discount: hasDiscount ? Math.floor(basePrice * 0.2) : 0, // 20% discount
      stock: 10 + (i * 2),
      images: JSON.stringify([heroImages[hero]]),
      ageGroup: i % 3 === 0 ? '8+ Years' : i % 2 === 0 ? '6+ Years' : '4+ Years',
      featured: i <= 8, // First 8 products are featured
      soldCount: Math.floor(Math.random() * 500) + 50, // Random sold count for best sellers
      categoryId: allCategories[i % 3].id,
      brandId: allBrands[i % 6].id,
    })
  }

  await prisma.product.createMany({ data: products })
  console.log('✅ Database Seeded Successfully!')
  console.log('   - 3 Categories')
  console.log('   - 6 Brands (3 Own + 3 Third Party)')
  console.log('   - 3 Hero Banners')
  console.log('   - 40 Products (8 Featured, 10 with Deals)')
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect())
