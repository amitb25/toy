import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const globalForPrisma = global as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, addItems, removeItems, updateItems } = body

    // Update status
    if (status) {
      await prisma.order.update({
        where: { id },
        data: { status },
      })
    }

    // Remove items
    if (removeItems?.length) {
      await prisma.orderItem.deleteMany({
        where: { id: { in: removeItems }, orderId: id },
      })
    }

    // Add items
    if (addItems?.length) {
      await prisma.orderItem.createMany({
        data: addItems.map((item: any) => ({
          orderId: id,
          productId: item.productId,
          quantity: item.quantity || 1,
          price: item.price,
        })),
      })
    }

    // Update item quantities
    if (updateItems?.length) {
      for (const item of updateItems) {
        await prisma.orderItem.update({
          where: { id: item.id },
          data: { quantity: item.quantity, price: item.price },
        })
      }
    }

    // Recalculate total if items changed
    if (addItems?.length || removeItems?.length || updateItems?.length) {
      const items = await prisma.orderItem.findMany({ where: { orderId: id } })
      const totalAmount = items.reduce((sum, item) => sum + item.price, 0)
      await prisma.order.update({
        where: { id },
        data: { totalAmount },
      })
    }

    // Return updated order
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        items: {
          include: {
            product: { select: { name: true, images: true, price: true } },
          },
        },
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('Order update error:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const order = await prisma.order.findFirst({
      where: { OR: [{ id }, { orderId: id }] },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        items: {
          include: {
            product: { select: { name: true, images: true, price: true } },
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
  }
}
