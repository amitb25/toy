import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const globalForPrisma = global as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

const sampleBannerCTA = [
  {
    id: '1',
    title: 'Exclusive Collection',
    subtitle: 'Limited Edition Items',
    description: 'Get your hands on rare Marvel collectibles before they are gone!',
    image: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?q=80&w=1200',
    buttonText: 'Shop Now',
    buttonLink: '/category/exclusives',
    active: true,
    order: 0
  }
]

export async function GET() {
  try {
    const bannerCTAs = await prisma.bannerCTA.findMany({
      where: { active: true },
      orderBy: { order: 'asc' }
    })

    if (bannerCTAs.length === 0) {
      return NextResponse.json(sampleBannerCTA)
    }

    return NextResponse.json(bannerCTAs)
  } catch (error) {
    console.error("BannerCTA fetch error:", error)
    return NextResponse.json(sampleBannerCTA)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("Creating BannerCTA:", JSON.stringify(body))

    const bannerCTA = await prisma.bannerCTA.create({
      data: {
        title: body.title,
        subtitle: body.subtitle || null,
        description: body.description || null,
        image: body.image,
        buttonText: body.buttonText || 'Shop Now',
        buttonLink: body.buttonLink,
        active: body.active ?? true,
        order: body.order || 0
      }
    })
    return NextResponse.json(bannerCTA)
  } catch (error: unknown) {
    const err = error as Error
    console.error("Create BannerCTA Error:", err.message)
    return NextResponse.json({ error: "Failed to create banner CTA", details: err.message }, { status: 500 })
  }
}
