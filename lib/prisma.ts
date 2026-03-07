import { PrismaClient } from "@prisma/client/edge"
import { withAccelerate } from "@prisma/extension-accelerate"

// Prisma 7 requires passing the connection URL to the client constructor
// For Prisma Accelerate, use the DATABASE_URL which should point to Accelerate
const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined
}

function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL

  // During build time, DATABASE_URL may not be set
  // Use a dummy URL that will be replaced at runtime
  // This prevents build failures while ensuring runtime works correctly
  const url = databaseUrl || "prisma://placeholder.prisma-data.net"

  // Prisma 7: Pass accelerateUrl for Prisma Accelerate
  return new PrismaClient({
    accelerateUrl: url,
  }).$extends(withAccelerate())
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
