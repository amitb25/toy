import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Check if data already exists - skip seeding if it does
  const existingProducts = await prisma.product.count()
  if (existingProducts > 0) {
    console.log('⚠️ Database already has data. Skipping seed to preserve uploaded images.')
    console.log('💡 To force reseed, manually delete all data first or use: npx prisma migrate reset')
    return
  }

  // Clear existing data (only runs if no products exist)
  await prisma.wishlist.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.brand.deleteMany()
  await prisma.banner.deleteMany()
  await prisma.user.deleteMany()

  // Create Users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@toykart.com',
        name: 'Admin User',
        phone: '9876543210',
        password: 'admin123', // In production, use hashed passwords
        address: '123 Admin Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        role: 'ADMIN'
      }
    }),
    prisma.user.create({
      data: {
        email: 'user@example.com',
        name: 'Test User',
        phone: '9876543211',
        password: 'user123',
        address: '456 User Lane',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '110001',
        role: 'USER'
      }
    })
  ])
  console.log('✅ Users created')

  // Create Categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Action Figures',
        slug: 'action-figures',
        image: 'https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=400',
        enabled: true
      }
    }),
    prisma.category.create({
      data: {
        name: 'Building Blocks',
        slug: 'building-blocks',
        image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400',
        enabled: true
      }
    }),
    prisma.category.create({
      data: {
        name: 'Dolls & Playsets',
        slug: 'dolls-playsets',
        image: 'https://images.unsplash.com/photo-1613682988402-a12dcc342121?w=400',
        enabled: true
      }
    }),
    prisma.category.create({
      data: {
        name: 'Educational Toys',
        slug: 'educational-toys',
        image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400',
        enabled: true
      }
    }),
    prisma.category.create({
      data: {
        name: 'Remote Control',
        slug: 'remote-control',
        image: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400',
        enabled: true
      }
    }),
    prisma.category.create({
      data: {
        name: 'Board Games',
        slug: 'board-games',
        image: 'https://images.unsplash.com/photo-1611891487122-207579d67d98?w=400',
        enabled: true
      }
    })
  ])
  console.log('✅ Categories created')

  // Create Brands
  const brands = await Promise.all([
    prisma.brand.create({
      data: {
        name: 'LEGO',
        logo: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=200&h=200&fit=crop',
        type: 'THIRD_PARTY',
        status: true
      }
    }),
    prisma.brand.create({
      data: {
        name: 'Hot Wheels',
        logo: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=200&h=200&fit=crop',
        type: 'THIRD_PARTY',
        status: true
      }
    }),
    prisma.brand.create({
      data: {
        name: 'Barbie',
        logo: 'https://images.unsplash.com/photo-1613682988402-a12dcc342121?w=200&h=200&fit=crop',
        type: 'THIRD_PARTY',
        status: true
      }
    }),
    prisma.brand.create({
      data: {
        name: 'Marvel',
        logo: 'https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=200&h=200&fit=crop',
        type: 'THIRD_PARTY',
        status: true
      }
    }),
    prisma.brand.create({
      data: {
        name: 'Fisher-Price',
        logo: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=200&h=200&fit=crop',
        type: 'THIRD_PARTY',
        status: true
      }
    }),
    prisma.brand.create({
      data: {
        name: 'Avengers HQ',
        logo: 'https://images.unsplash.com/photo-1635863138275-d9b33299680b?w=200&h=200&fit=crop',
        type: 'OWN',
        status: true
      }
    })
  ])
  console.log('✅ Brands created')

  // Create Products
  const products = await Promise.all([
    // Action Figures - Own Brand (Avengers HQ)
    prisma.product.create({
      data: {
        name: 'Spider-Man Action Figure',
        description: 'Highly detailed Spider-Man action figure with multiple points of articulation. Perfect for collectors and kids alike!',
        price: 1499,
        discount: 10,
        stock: 50,
        images: JSON.stringify(['https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=600']),
        ageGroup: '6+',
        safetyInfo: 'Small parts. Not suitable for children under 3 years.',
        status: true,
        featured: true,
        soldCount: 120,
        categoryId: categories[0].id,
        brandId: brands[5].id // Avengers HQ (OWN brand)
      }
    }),
    prisma.product.create({
      data: {
        name: 'Iron Man Mark 85',
        description: 'Premium Iron Man action figure from Endgame. Die-cast metal parts with LED lights.',
        price: 2999,
        discount: 15,
        stock: 30,
        images: JSON.stringify(['https://images.unsplash.com/photo-1635863138275-d9b33299680b?w=600']),
        ageGroup: '8+',
        safetyInfo: 'Contains small parts and batteries.',
        status: true,
        featured: true,
        soldCount: 85,
        categoryId: categories[0].id,
        brandId: brands[5].id // Avengers HQ (OWN brand)
      }
    }),
    prisma.product.create({
      data: {
        name: 'Captain America Shield Replica',
        description: 'Premium metal shield replica with leather straps. Museum quality collectible.',
        price: 4999,
        discount: 20,
        stock: 15,
        images: JSON.stringify(['https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?w=600']),
        ageGroup: '14+',
        safetyInfo: 'Heavy item. Display purposes recommended.',
        status: true,
        featured: true,
        soldCount: 60,
        categoryId: categories[0].id,
        brandId: brands[5].id // Avengers HQ (OWN brand)
      }
    }),
    prisma.product.create({
      data: {
        name: 'Thor Mjolnir Hammer',
        description: 'Life-size Mjolnir replica with LED effects and sound. Worthy collectors item!',
        price: 3499,
        discount: 10,
        stock: 25,
        images: JSON.stringify(['https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=600']),
        ageGroup: '10+',
        safetyInfo: 'Requires batteries. Adult supervision recommended.',
        status: true,
        featured: true,
        soldCount: 95,
        categoryId: categories[0].id,
        brandId: brands[5].id // Avengers HQ (OWN brand)
      }
    }),
    // Building Blocks - LEGO
    prisma.product.create({
      data: {
        name: 'LEGO City Police Station',
        description: 'Build your own police station with this 743-piece LEGO set. Includes 5 minifigures and police vehicles.',
        price: 4999,
        discount: 20,
        stock: 25,
        images: JSON.stringify(['https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600']),
        ageGroup: '6+',
        safetyInfo: 'Small parts. Not suitable for children under 3 years.',
        status: true,
        featured: true,
        soldCount: 200,
        categoryId: categories[1].id,
        brandId: brands[0].id // LEGO
      }
    }),
    prisma.product.create({
      data: {
        name: 'LEGO Technic Race Car',
        description: 'Advanced building set with working suspension and steering. 1,580 pieces for serious builders.',
        price: 7999,
        discount: 10,
        stock: 15,
        images: JSON.stringify(['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600']),
        ageGroup: '10+',
        safetyInfo: 'Small parts. Adult supervision recommended.',
        status: true,
        featured: false,
        soldCount: 45,
        categoryId: categories[1].id,
        brandId: brands[0].id // LEGO
      }
    }),
    // Dolls - Barbie
    prisma.product.create({
      data: {
        name: 'Barbie Dreamhouse Adventures',
        description: 'Beautiful Barbie doll with multiple outfit changes and accessories. Spark imagination and creativity!',
        price: 1999,
        discount: 25,
        stock: 40,
        images: JSON.stringify(['https://images.unsplash.com/photo-1613682988402-a12dcc342121?w=600']),
        ageGroup: '3+',
        safetyInfo: 'Suitable for children 3 years and above.',
        status: true,
        featured: true,
        soldCount: 150,
        categoryId: categories[2].id,
        brandId: brands[2].id // Barbie
      }
    }),
    // Educational - Fisher-Price
    prisma.product.create({
      data: {
        name: 'Science Lab Kit',
        description: 'Complete science experiment kit with 50+ experiments. Learn chemistry, physics, and biology basics.',
        price: 2499,
        discount: 15,
        stock: 35,
        images: JSON.stringify(['https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600']),
        ageGroup: '8+',
        safetyInfo: 'Adult supervision required. Contains chemicals.',
        status: true,
        featured: true,
        soldCount: 90,
        categoryId: categories[3].id,
        brandId: brands[4].id // Fisher-Price
      }
    }),
    prisma.product.create({
      data: {
        name: 'Wooden Alphabet Blocks',
        description: 'Classic wooden blocks with letters and numbers. Perfect for early learning.',
        price: 799,
        discount: 0,
        stock: 100,
        images: JSON.stringify(['https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600']),
        ageGroup: '1+',
        safetyInfo: 'Non-toxic paint. Safe for toddlers.',
        status: true,
        featured: false,
        soldCount: 300,
        categoryId: categories[3].id,
        brandId: brands[4].id // Fisher-Price
      }
    }),
    // Remote Control - Hot Wheels
    prisma.product.create({
      data: {
        name: 'RC Monster Truck',
        description: 'High-speed remote control monster truck with 4WD. Reaches speeds up to 30 km/h!',
        price: 3499,
        discount: 20,
        stock: 20,
        images: JSON.stringify(['https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=600']),
        ageGroup: '8+',
        safetyInfo: 'Use in open areas only. Batteries not included.',
        status: true,
        featured: true,
        soldCount: 75,
        categoryId: categories[4].id,
        brandId: brands[1].id // Hot Wheels
      }
    }),
    prisma.product.create({
      data: {
        name: 'Racing Drone with Camera',
        description: 'FPV racing drone with HD camera. Perfect for beginners with auto-hover feature.',
        price: 5999,
        discount: 10,
        stock: 10,
        images: JSON.stringify(['https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=600']),
        ageGroup: '14+',
        safetyInfo: 'Follow local drone regulations. Adult supervision required.',
        status: true,
        featured: false,
        soldCount: 40,
        categoryId: categories[4].id,
        brandId: brands[1].id // Hot Wheels
      }
    }),
    // Board Games - Avengers HQ
    prisma.product.create({
      data: {
        name: 'Avengers Strategy Game',
        description: 'Epic board game featuring Marvel heroes. Team up to defeat Thanos!',
        price: 1299,
        discount: 5,
        stock: 60,
        images: JSON.stringify(['https://images.unsplash.com/photo-1611891487122-207579d67d98?w=600']),
        ageGroup: '8+',
        safetyInfo: 'Contains small pieces.',
        status: true,
        featured: true,
        soldCount: 180,
        categoryId: categories[5].id,
        brandId: brands[5].id // Avengers HQ (OWN brand)
      }
    }),
    prisma.product.create({
      data: {
        name: 'Marvel Chess Set',
        description: 'Premium chess set featuring Marvel heroes vs villains. Collector edition.',
        price: 2499,
        discount: 0,
        stock: 45,
        images: JSON.stringify(['https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=600']),
        ageGroup: '6+',
        safetyInfo: 'No specific safety concerns.',
        status: true,
        featured: false,
        soldCount: 65,
        categoryId: categories[5].id,
        brandId: brands[5].id // Avengers HQ (OWN brand)
      }
    }),
    // More Avengers HQ products
    prisma.product.create({
      data: {
        name: 'Black Panther Mask',
        description: 'Wearable Black Panther mask with electronic sound effects. Vibranium style finish.',
        price: 1999,
        discount: 15,
        stock: 35,
        images: JSON.stringify(['https://images.unsplash.com/photo-1559535332-db9971090158?w=600']),
        ageGroup: '8+',
        safetyInfo: 'Electronic item. Keep away from water.',
        status: true,
        featured: true,
        soldCount: 110,
        categoryId: categories[0].id,
        brandId: brands[5].id // Avengers HQ (OWN brand)
      }
    }),
    prisma.product.create({
      data: {
        name: 'Hulk Smash Gloves',
        description: 'Oversized foam Hulk fists with sound effects. Smash responsibly!',
        price: 899,
        discount: 10,
        stock: 80,
        images: JSON.stringify(['https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=600']),
        ageGroup: '4+',
        safetyInfo: 'Soft foam. Safe for play.',
        status: true,
        featured: true,
        soldCount: 250,
        categoryId: categories[0].id,
        brandId: brands[5].id // Avengers HQ (OWN brand)
      }
    })
  ])
  console.log('✅ Products created')

  // Create Banners
  await Promise.all([
    prisma.banner.create({
      data: {
        title: 'Summer Sale - Up to 50% Off!',
        subtitle: 'Limited time offer on selected toys',
        image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=1200',
        link: '/products?discount=true',
        active: true,
        order: 1
      }
    }),
    prisma.banner.create({
      data: {
        title: 'New LEGO Collection',
        subtitle: 'Build your imagination',
        image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=1200',
        link: '/products?category=building-blocks',
        active: true,
        order: 2
      }
    }),
    prisma.banner.create({
      data: {
        title: 'Educational Toys',
        subtitle: 'Learning through play',
        image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=1200',
        link: '/products?category=educational-toys',
        active: true,
        order: 3
      }
    })
  ])
  console.log('✅ Banners created')

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
