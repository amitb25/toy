import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

// Use a global variable to prevent multiple instances of Prisma Client in development
const globalForPrisma = global as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        brand: true,
        category: true
      }
    })
    return NextResponse.json(products)
  } catch (error) {
    console.error("Prisma Error:", error)
    return NextResponse.json({ error: "Failed to fetch products from database" }, { status: 500 })
  }
}
