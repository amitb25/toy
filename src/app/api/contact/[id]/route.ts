import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const globalForPrisma = global as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const message = await prisma.contactMessage.update({
      where: { id },
      data: body,
    })
    return NextResponse.json(message)
  } catch (error) {
    console.error('Error updating contact message:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.contactMessage.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting contact message:', error)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
