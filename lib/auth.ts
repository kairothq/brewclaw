import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
// import Resend from "next-auth/providers/resend" // Uncomment when AUTH_RESEND_KEY is configured
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Resend provider disabled until AUTH_RESEND_KEY is set
    // Resend({
    //   apiKey: process.env.AUTH_RESEND_KEY!,
    //   from: "noreply@brewclaw.com",
    // }),
  ],
  pages: {
    signIn: '/signin',
    newUser: '/onboarding', // New users redirected here after first sign-in
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
