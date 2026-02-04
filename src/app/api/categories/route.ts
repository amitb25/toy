import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const globalForPrisma = global as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

const sampleCategories = [
  { id: '1', name: 'Action Figures', slug: 'action-figures', image: null, enabled: true, _count: { products: 2 } },
  { id: '2', name: 'Role Play', slug: 'role-play', image: null, enabled: true, _count: { products: 4 } },
  { id: '3', name: 'Collectibles', slug: 'collectibles', image: null, enabled: true, _count: { products: 2 } },
  { id: '4', name: 'Board Games', slug: 'board-games', image: null, enabled: true, _count: { products: 0 } },
  { id: '5', name: 'Puzzles', slug: 'puzzles', image: null, enabled: true, _count: { products: 0 } }
]

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } }
    })

    if (categories.length === 0) {
      return NextResponse.json(sampleCategories)
    }

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Categories fetch error:", error)
    return NextResponse.json(sampleCategories)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("Creating category:", JSON.stringify(body))

    const slug = body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const category = await prisma.category.create({
      data: {
        name: body.name,
        slug: slug,
        image: body.image || null,
        enabled: body.enabled ?? true
      }
    })
    return NextResponse.json(category)
  } catch (error: unknown) {
    const err = error as Error
    console.error("Create Category Error:", err.message, err.stack)
    return NextResponse.json({ error: "Failed to create category", details: err.message }, { status: 500 })
  }
}
