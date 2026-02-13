import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const globalForPrisma = global as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function GET() {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(messages)
  } catch (error) {
    console.error('Error fetching contact messages:', error)
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const contactMessage = await prisma.contactMessage.create({
      data: { name, email, subject, message },
    })

    return NextResponse.json(contactMessage, { status: 201 })
  } catch (error) {
    console.error('Error creating contact message:', error)
    return NextResponse.json({ error: 'Failed to submit message' }, { status: 500 })
  }
}
