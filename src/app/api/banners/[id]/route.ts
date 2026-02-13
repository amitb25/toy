import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const globalForPrisma = global as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const banner = await prisma.banner.findUnique({ where: { id } })
    if (!banner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 })
    }
    return NextResponse.json(banner)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch banner" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const banner = await prisma.banner.update({
      where: { id },
      data: {
        title: body.title,
        subtitle: body.subtitle,
        image: body.image,
        link: body.link,
        active: body.active,
        order: body.order
      }
    })
    return NextResponse.json(banner)
  } catch (error: unknown) {
    const err = error as Error
    console.error("Update Banner Error:", err.message)
    return NextResponse.json({ error: "Failed to update banner", details: err.message }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.banner.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const err = error as Error
    console.error("Delete Banner Error:", err.message)
    return NextResponse.json({ error: "Failed to delete banner", details: err.message }, { status: 500 })
  }
}
