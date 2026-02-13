import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const globalForPrisma = global as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()

export async function GET() {
  try {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const [
      totalRevenue,
      ordersToday,
      pendingOrders,
      lowStockProducts,
      recentOrders,
      lowStockAlerts,
    ] = await Promise.all([
      // Total revenue from all delivered/completed orders
      prisma.order.aggregate({
        _sum: { totalAmount: true },
      }),
      // Orders placed today
      prisma.order.count({
        where: { createdAt: { gte: todayStart } },
      }),
      // Pending orders
      prisma.order.count({
        where: { status: 'PENDING' },
      }),
      // Low stock product count (stock < 10)
      prisma.product.count({
        where: { stock: { lt: 10 }, status: true },
      }),
      // Recent 5 orders
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
          user: { select: { name: true } },
        },
      }),
      // Low stock products (stock < 10, active)
      prisma.product.findMany({
        where: { stock: { lt: 10 }, status: true },
        orderBy: { stock: 'asc' },
        take: 5,
        select: { id: true, name: true, stock: true },
      }),
    ])

    return NextResponse.json({
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      ordersToday,
      pendingOrders,
      lowStockCount: lowStockProducts,
      recentOrders: recentOrders.map((o) => ({
        id: o.orderId,
        itemCount: o.items.length,
        amount: o.totalAmount,
        status: o.status,
        customer: o.user?.name || 'Guest',
      })),
      lowStockAlerts: lowStockAlerts.map((p) => ({
        id: p.id,
        name: p.name,
        stock: p.stock,
      })),
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json({
      totalRevenue: 0,
      ordersToday: 0,
      pendingOrders: 0,
      lowStockCount: 0,
      recentOrders: [],
      lowStockAlerts: [],
    })
  }
}
