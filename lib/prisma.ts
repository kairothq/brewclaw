import { PrismaClient } from "@prisma/client/edge"
import { withAccelerate } from "@prisma/extension-accelerate"

// Prisma 7 requires passing the connection URL to the client constructor
// For Prisma Accelerate, use the DATABASE_URL which should point to Accelerate
const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined
}

function createPrismaClient() {
  // Prisma 7: Pass accelerateUrl for Prisma Accelerate
  // The DATABASE_URL should be the Prisma Accelerate connection string
  return new PrismaClient({
    accelerateUrl: process.env.DATABASE_URL,
  }).$extends(withAccelerate())
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
