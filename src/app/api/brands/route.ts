import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const globalForPrisma = global as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

const sampleBrands = [
  { id: '1', name: 'Avengers HQ', logo: null, type: 'OWN', status: true, _count: { products: 4 } },
  { id: '2', name: 'Hasbro', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Hasbro_logo.svg/200px-Hasbro_logo.svg.png', type: 'THIRD_PARTY', status: true, _count: { products: 2 } },
  { id: '3', name: 'Hot Toys', logo: null, type: 'THIRD_PARTY', status: true, _count: { products: 1 } },
  { id: '4', name: 'Funko', logo: null, type: 'THIRD_PARTY', status: true, _count: { products: 1 } }
]

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      include: { _count: { select: { products: true } } }
    })

    if (brands.length === 0) {
      const withSlugs = sampleBrands.map(b => ({
        ...b,
        slug: b.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      }))
      return NextResponse.json(withSlugs)
    }

    const withSlugs = brands.map(b => ({
      ...b,
      slug: b.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }))
    return NextResponse.json(withSlugs)
  } catch (error) {
    return NextResponse.json(sampleBrands)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const brand = await prisma.brand.create({
      data: {
        name: body.name,
        logo: body.logo || null,
        type: body.type || 'THIRD_PARTY',
        status: body.status ?? true
      }
    })
    return NextResponse.json(brand)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create brand" }, { status: 500 })
  }
}
