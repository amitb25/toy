import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const globalForPrisma = global as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const category = await prisma.category.findUnique({
      where: { id },
      include: { products: true }
    })
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }
    return NextResponse.json(category)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const slug = body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const category = await prisma.category.update({
      where: { id },
      data: {
        name: body.name,
        slug: slug,
        image: body.image,
        enabled: body.enabled
      }
    })
    return NextResponse.json(category)
  } catch (error: unknown) {
    const err = error as Error
    console.error("Update Category Error:", err.message, err.stack)
    return NextResponse.json({ error: "Failed to update category", details: err.message }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.category.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const err = error as Error
    console.error("Delete Category Error:", err.message, err.stack)
    return NextResponse.json({ error: "Failed to delete category", details: err.message }, { status: 500 })
  }
}
