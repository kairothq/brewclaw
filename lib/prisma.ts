import { PrismaClient } from "@prisma/client/edge"
import { withAccelerate } from "@prisma/extension-accelerate"

// Prisma 7 requires passing the connection URL to the client constructor
// For Prisma Accelerate, use the DATABASE_URL which should point to Accelerate

// Use 'any' type to avoid circular reference issues with extended client
type ExtendedPrismaClient = any

const globalForPrisma = globalThis as unknown as {
  prisma: ExtendedPrismaClient | undefined
}

function createPrismaClient(): ExtendedPrismaClient {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL environment variable is not set. " +
      "Please configure it in your Vercel environment variables."
    )
  }

  // Prisma 7: Pass accelerateUrl for Prisma Accelerate
  return new PrismaClient({
    accelerateUrl: databaseUrl,
  }).$extends(withAccelerate())
}

// Lazy initialization using a getter
// This prevents the client from being created until it's actually used
function getPrismaClient(): ExtendedPrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient()
  }
  return globalForPrisma.prisma
}

// Export a proxy that lazily initializes the client on first property access
export const prisma = new Proxy({} as ExtendedPrismaClient, {
  get(_target, prop: string | symbol) {
    const client = getPrismaClient()
    const value = client[prop]
    // If it's a function, bind it to the client
    if (typeof value === "function") {
      return value.bind(client)
    }
    return value
  },
})
