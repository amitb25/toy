import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const globalForPrisma = global as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, address, city, pincode, paymentMode, items } = body

    if (!name || !phone || !address || !city || !pincode || !paymentMode || !items?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const guestEmail = email || `guest_${phone.replace(/\D/g, '')}@avengershq.com`

    // Upsert guest user
    const user = await prisma.user.upsert({
      where: { email: guestEmail },
      update: { name, phone, address, city, pincode },
      create: {
        name,
        email: guestEmail,
        phone,
        password: '',
        address,
        city,
        pincode,
      },
    })

    // Generate order ID
    const orderCount = await prisma.order.count()
    const orderId = `AHQ-${(orderCount + 1001).toString().padStart(4, '0')}`

    // Calculate total
    const totalAmount = items.reduce(
      (sum: number, item: any) => sum + (item.price - (item.discount || 0)) * (item.quantity || 1),
      0
    )

    // Create order with items
    const order = await prisma.order.create({
      data: {
        orderId,
        totalAmount,
        status: 'PENDING',
        paymentMode: paymentMode.toUpperCase(),
        shippingAddress: JSON.stringify({ name, phone, address, city, pincode }),
        userId: user.id,
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity || 1,
            price: (item.price - (item.discount || 0)) * (item.quantity || 1),
          })),
        },
      },
      include: { items: true },
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        items: {
          include: {
            product: { select: { name: true, images: true } },
          },
        },
      },
    })
    return NextResponse.json(orders)
  } catch {
    return NextResponse.json([])
  }
}
