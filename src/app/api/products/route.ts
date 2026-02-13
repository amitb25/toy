import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const globalForPrisma = global as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Sample data for when database is empty/unavailable
const sampleProducts = [
  {
    id: '1',
    name: 'Iron Man Mark LXXXV Action Figure',
    description: 'Premium die-cast Iron Man figure with LED lights and 50+ points of articulation',
    price: 4999,
    discount: 500,
    images: '["https://images.unsplash.com/photo-1608889175123-8ee362201f81?q=80&w=500"]',
    ageGroup: '14+',
    stock: 25,
    soldCount: 150,
    featured: true,
    brand: { name: 'Avengers HQ', type: 'OWN' },
    category: { name: 'Action Figures', slug: 'action-figures' }
  },
  {
    id: '2',
    name: 'Captain America Shield Replica',
    description: 'Full-size vibranium shield replica with leather straps',
    price: 7999,
    discount: 1000,
    images: '["https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?q=80&w=500"]',
    ageGroup: '18+',
    stock: 10,
    soldCount: 89,
    featured: true,
    brand: { name: 'Avengers HQ', type: 'OWN' },
    category: { name: 'Role Play', slug: 'role-play' }
  },
  {
    id: '3',
    name: 'Thor Mjolnir Hammer',
    description: 'Electronic Mjolnir with lights and sound effects',
    price: 3499,
    discount: 0,
    images: '["https://images.unsplash.com/photo-1635863138275-d9b33299680b?q=80&w=500"]',
    ageGroup: '8+',
    stock: 50,
    soldCount: 200,
    featured: false,
    brand: { name: 'Hasbro', type: 'THIRD_PARTY' },
    category: { name: 'Role Play', slug: 'role-play' }
  },
  {
    id: '4',
    name: 'Spider-Man Web Shooters',
    description: 'Wearable web shooters with web fluid refills',
    price: 2499,
    discount: 300,
    images: '["https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?q=80&w=500"]',
    ageGroup: '6+',
    stock: 100,
    soldCount: 350,
    featured: true,
    brand: { name: 'Hasbro', type: 'THIRD_PARTY' },
    category: { name: 'Role Play', slug: 'role-play' }
  },
  {
    id: '5',
    name: 'Black Panther Collectible Statue',
    description: 'Limited edition 12-inch Black Panther statue',
    price: 12999,
    discount: 2000,
    images: '["https://images.unsplash.com/photo-1559535332-db9971090158?q=80&w=500"]',
    ageGroup: '18+',
    stock: 5,
    soldCount: 45,
    featured: true,
    brand: { name: 'Avengers HQ', type: 'OWN' },
    category: { name: 'Collectibles', slug: 'collectibles' }
  },
  {
    id: '6',
    name: 'Hulk Smash Fists',
    description: 'Foam Hulk fists with smash sound effects',
    price: 1999,
    discount: 200,
    images: '["https://images.unsplash.com/photo-1611604548018-d56bbd85d681?q=80&w=500"]',
    ageGroup: '4+',
    stock: 75,
    soldCount: 180,
    featured: false,
    brand: { name: 'Funko', type: 'THIRD_PARTY' },
    category: { name: 'Role Play', slug: 'role-play' }
  },
  {
    id: '7',
    name: 'Thanos Infinity Gauntlet',
    description: 'Electronic Infinity Gauntlet with light-up stones',
    price: 5999,
    discount: 500,
    images: '["https://images.unsplash.com/photo-1547638375-ebf04735d792?q=80&w=500"]',
    ageGroup: '14+',
    stock: 20,
    soldCount: 120,
    featured: true,
    brand: { name: 'Avengers HQ', type: 'OWN' },
    category: { name: 'Collectibles', slug: 'collectibles' }
  },
  {
    id: '8',
    name: 'Avengers Team Action Figure Set',
    description: '6-pack of Avengers action figures',
    price: 8999,
    discount: 1500,
    images: '["https://images.unsplash.com/photo-1558507652-2d9626c4e67a?q=80&w=500"]',
    ageGroup: '8+',
    stock: 30,
    soldCount: 95,
    featured: false,
    brand: { name: 'Hot Toys', type: 'THIRD_PARTY' },
    category: { name: 'Action Figures', slug: 'action-figures' }
  }
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const all = searchParams.get('all')

    const products = await prisma.product.findMany({
      where: all === 'true' ? {} : { status: true },
      include: {
        brand: true,
        category: true
      }
    })

    // Return sample data if database is empty
    if (products.length === 0) {
      const withSlugs = sampleProducts.map(p => ({
        ...p,
        slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      }))
      return NextResponse.json(withSlugs)
    }

    const withSlugs = products.map(p => ({
      ...p,
      slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }))
    return NextResponse.json(withSlugs)
  } catch (error) {
    console.error("Prisma Error:", error)
    // Return sample data on error
    return NextResponse.json(sampleProducts)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        price: parseFloat(body.price),
        discount: parseFloat(body.discount) || 0,
        stock: parseInt(body.stock) || 0,
        images: body.images || '[]',
        ageGroup: body.ageGroup || 'All',
        safetyInfo: body.safetyInfo || null,
        status: body.status ?? true,
        featured: body.featured ?? false,
        categoryId: body.categoryId,
        brandId: body.brandId
      },
      include: {
        brand: true,
        category: true
      }
    })
    return NextResponse.json(product)
  } catch (error: unknown) {
    const err = error as Error
    console.error("Create Product Error:", err.message, err.stack)
    return NextResponse.json({ error: "Failed to create product", details: err.message }, { status: 500 })
  }
}
