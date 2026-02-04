import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const globalForPrisma = global as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        brand: true,
        category: true
      }
    })
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    console.log("Updating product:", id, JSON.stringify(body))

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        price: parseFloat(body.price),
        discount: parseFloat(body.discount) || 0,
        stock: parseInt(body.stock) || 0,
        images: body.images,
        ageGroup: body.ageGroup,
        safetyInfo: body.safetyInfo,
        status: body.status,
        featured: body.featured,
        categoryId: body.categoryId,
        brandId: body.brandId
      },
      include: {
        brand: true,
        category: true
      }
    })
    return NextResponse.json(product)
  } catch (error: unknown) {
    const err = error as Error
    console.error("Update Product Error:", err.message, err.stack)
    return NextResponse.json({ error: "Failed to update product", details: err.message }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    console.log("Deleting product:", id)

    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const err = error as Error
    console.error("Delete Product Error:", err.message, err.stack)
    return NextResponse.json({ error: "Failed to delete product", details: err.message }, { status: 500 })
  }
}
