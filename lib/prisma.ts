import { PrismaClient } from "@prisma/client/edge"
import { withAccelerate } from "@prisma/extension-accelerate"

// For development, use regular PrismaClient
// For production (Vercel), use Prisma Accelerate
const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined
}

function createPrismaClient() {
  // In production, use Prisma Accelerate for edge compatibility
  if (process.env.NODE_ENV === "production") {
    return new PrismaClient().$extends(withAccelerate())
  }
  // In development, use standard client
  return new PrismaClient()
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
