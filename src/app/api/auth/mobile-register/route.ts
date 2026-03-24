import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { name, email, password, phone } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Name, email and password required' }, { status: 400 })
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email },
    })

    if (existing) {
      return NextResponse.json({ message: 'Email already registered' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        role: 'USER',
      },
    })

    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      iat: Date.now(),
    }
    const token = Buffer.from(JSON.stringify(tokenPayload)).toString('base64')

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
      },
      token,
    })
  } catch (error) {
    console.error('Mobile register error:', error)
    return NextResponse.json({ message: 'Registration failed' }, { status: 500 })
  }
}
