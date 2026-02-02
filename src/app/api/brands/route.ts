import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const globalForPrisma = global as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      where: { status: true },
      include: { _count: { select: { products: true } } }
    })
    return NextResponse.json(brands)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch brands" }, { status: 500 })
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
