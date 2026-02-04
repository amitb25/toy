import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const globalForPrisma = global as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

const sampleBanners = [
  {
    id: '1',
    title: 'Avengers Collection',
    subtitle: 'Premium Marvel collectibles & action figures',
    image: 'https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?q=80&w=2000',
    link: '/category/all',
    active: true,
    order: 1
  },
  {
    id: '2',
    title: 'New Arrivals',
    subtitle: 'Fresh from the multiverse - Check out our latest products',
    image: 'https://images.unsplash.com/photo-1635863138275-d9b33299680b?q=80&w=2000',
    link: '/new-arrivals',
    active: true,
    order: 2
  }
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const showAll = searchParams.get('all') === 'true'

    const banners = await prisma.banner.findMany({
      where: showAll ? {} : { active: true },
      orderBy: { order: 'asc' }
    })

    if (banners.length === 0 && !showAll) {
      return NextResponse.json(sampleBanners)
    }

    return NextResponse.json(banners)
  } catch (error) {
    console.error("Banners fetch error:", error)
    return NextResponse.json(sampleBanners)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const banner = await prisma.banner.create({
      data: {
        title: body.title,
        subtitle: body.subtitle,
        image: body.image,
        link: body.link,
        active: body.active ?? true,
        order: body.order ?? 0
      }
    })
    return NextResponse.json(banner)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create banner" }, { status: 500 })
  }
}
