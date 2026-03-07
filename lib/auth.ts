import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Resend from "next-auth/providers/resend"
import { PrismaAdapter } from "@auth/prisma-adapter"

// Only import prisma if DATABASE_URL is available
// This prevents crashes during build and for unauthenticated routes
const getAdapter = () => {
  if (!process.env.DATABASE_URL) {
    // Return undefined - NextAuth will work without an adapter
    // but won't persist user data to database
    return undefined
  }
  // Dynamic import to prevent loading prisma when not needed
  const { prisma } = require("@/lib/prisma")
  return PrismaAdapter(prisma)
}

// Build providers array conditionally based on available credentials
const providers = []

// Add Google provider only if credentials are configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  )
}

// Add Resend provider only if API key is configured
if (process.env.AUTH_RESEND_KEY) {
  providers.push(
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: process.env.AUTH_RESEND_FROM || "onboarding@resend.dev",
    })
  )
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: getAdapter(),
  providers,
  pages: {
    signIn: '/signin',
    newUser: '/onboarding',
  },
  session: {
    strategy: "jwt", // JWT for serverless compatibility
  },
  callbacks: {
    async jwt({ token, user, isNewUser }) {
      // Mark new users for routing logic
      if (isNewUser) {
        token.isNewUser = true
      }
      return token
    },
    async session({ session, token }) {
      // Pass isNewUser flag to client if needed
      if (token.isNewUser) {
        (session as any).isNewUser = token.isNewUser
      }
      return session
    },
  },
})
