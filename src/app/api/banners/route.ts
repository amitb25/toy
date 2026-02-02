import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const globalForPrisma = global as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      where: { active: true },
      orderBy: { order: 'asc' }
    })
    return NextResponse.json(banners)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 })
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
