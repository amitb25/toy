import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const globalForPrisma = global as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()

export async function GET() {
  try {
    const [pendingOrders, unreadMessages] = await Promise.all([
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.contactMessage.count({ where: { read: false } }),
    ])

    return NextResponse.json({ pendingOrders, unreadMessages })
  } catch {
    return NextResponse.json({ pendingOrders: 0, unreadMessages: 0 })
  }
}
