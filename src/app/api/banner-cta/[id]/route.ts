import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const globalForPrisma = global as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const bannerCTA = await prisma.bannerCTA.findUnique({ where: { id } })
    if (!bannerCTA) {
      return NextResponse.json({ error: "Banner CTA not found" }, { status: 404 })
    }
    return NextResponse.json(bannerCTA)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch banner CTA" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    // Use upsert to handle sample data that doesn't exist in the database
    const bannerCTA = await prisma.bannerCTA.upsert({
      where: { id },
      update: {
        title: body.title,
        subtitle: body.subtitle,
        description: body.description,
        image: body.image,
        buttonText: body.buttonText,
        buttonLink: body.buttonLink,
        showTitle: body.showTitle,
        showButton: body.showButton,
        active: body.active,
        order: body.order
      },
      create: {
        title: body.title,
        subtitle: body.subtitle || null,
        description: body.description || null,
        image: body.image,
        buttonText: body.buttonText || 'Shop Now',
        buttonLink: body.buttonLink,
        showTitle: body.showTitle ?? true,
        showButton: body.showButton ?? true,
        active: body.active ?? true,
        order: body.order || 0
      }
    })
    return NextResponse.json(bannerCTA)
  } catch (error: unknown) {
    const err = error as Error
    console.error("Update BannerCTA Error:", err.message)
    return NextResponse.json({ error: "Failed to update banner CTA", details: err.message }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    // Check if record exists before trying to delete
    const existing = await prisma.bannerCTA.findUnique({ where: { id } })
    if (!existing) {
      // Record doesn't exist (could be sample data) - just return success
      return NextResponse.json({ success: true })
    }

    await prisma.bannerCTA.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const err = error as Error
    console.error("Delete BannerCTA Error:", err.message)
    return NextResponse.json({ error: "Failed to delete banner CTA", details: err.message }, { status: 500 })
  }
}
