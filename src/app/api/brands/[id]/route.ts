import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const globalForPrisma = global as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const brand = await prisma.brand.findUnique({
      where: { id },
      include: { products: true }
    })
    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 })
    }
    return NextResponse.json(brand)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch brand" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const brand = await prisma.brand.update({
      where: { id },
      data: {
        name: body.name,
        logo: body.logo,
        type: body.type,
        status: body.status
      }
    })
    return NextResponse.json(brand)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update brand" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.brand.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete brand" }, { status: 500 })
  }
}
