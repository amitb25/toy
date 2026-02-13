import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const globalForPrisma = global as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: {
        orders: { some: {} }
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        city: true,
        state: true,
        pincode: true,
        createdAt: true,
        orders: {
          select: {
            id: true,
            orderId: true,
            totalAmount: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const customers = users.map(user => ({
      ...user,
      totalOrders: user.orders.length,
      totalSpent: user.orders.reduce((sum, o) => sum + o.totalAmount, 0),
      lastOrder: user.orders[0]?.createdAt || null,
    }))

    return NextResponse.json(customers)
  } catch (error) {
    console.error('Customers fetch error:', error)
    return NextResponse.json([])
  }
}
