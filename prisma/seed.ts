import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../lib/auth'
import { ADMIN_CREDENTIALS } from '../lib/constants'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: ADMIN_CREDENTIALS.email }
  })

  if (existingAdmin) {
    console.log('✅ Admin user already exists')
    return
  }

  // Create admin user
  const hashedPassword = await hashPassword(ADMIN_CREDENTIALS.password)

  const admin = await prisma.user.create({
    data: {
      email: ADMIN_CREDENTIALS.email,
      password: hashedPassword,
      name: ADMIN_CREDENTIALS.name,
      role: ADMIN_CREDENTIALS.role,
      plan: ADMIN_CREDENTIALS.plan,
      emailVerified: new Date(),
    }
  })

  console.log('✅ Admin user created successfully')
  console.log(`📧 Email: ${admin.email}`)
  console.log(`🔐 Password: ${ADMIN_CREDENTIALS.password}`)
  console.log(`👤 Role: ${admin.role}`)
  console.log(`💎 Plan: ${admin.plan}`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
