const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function createAdmin() {
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@toystore.com' },
    update: {},
    create: {
      email: 'admin@toystore.com',
      name: 'Murali Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log('✅ Admin User Created:', admin.email)
}

createAdmin()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect())
