# Phase 12: Signup Step - Research

**Researched:** 2026-02-25
**Domain:** User Authentication (Google OAuth + Email Magic Links)
**Confidence:** HIGH

## Summary

Phase 12 implements user signup with two authentication methods: Google OAuth and email magic links. The standard stack for Next.js authentication is **NextAuth.js (Auth.js) v5**, which provides built-in OAuth providers, email verification, session management, and CSRF protection. This phase requires database setup (Prisma + PostgreSQL recommended), email service integration (Resend or Nodemailer), and proper routing logic to differentiate new users (onboarding) from returning users (dashboard).

The implementation follows Next.js App Router patterns with server-side authentication using the `auth()` function, server actions for form handling, and middleware for route protection. Session persistence across browser refresh is handled automatically through HTTP-only cookies with JWT or database sessions.

**Primary recommendation:** Use NextAuth.js v5 with Prisma adapter, Resend for email delivery, and implement session-based routing through the `pages.newUser` callback for new user onboarding flows.

## Phase Requirements

<phase_requirements>
| ID | Description | Research Support |
|----|-------------|-----------------|
| SIGNUP-01 | Google OAuth authentication | NextAuth Google provider with built-in OAuth flow, requires Google Cloud Console setup |
| SIGNUP-02 | Email magic link verification | NextAuth Email provider (Resend/Nodemailer) with token-based authentication |
| SIGNUP-03 | Magic link delivery within 30 seconds | Resend API provides fast delivery (~5-10s), requires rate limiting (60s between requests) |
| SIGNUP-04 | Session persistence across refresh | NextAuth session management with HTTP-only cookies, JWT or database strategy |
| SIGNUP-05 | New users route to AI selection (step 2) | NextAuth `pages.newUser` callback + redirect logic in middleware |
| SIGNUP-06 | Returning users route to dashboard | Session-based routing with `auth()` function in middleware and server components |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next-auth | v5 (Auth.js) | Authentication framework | Industry standard for Next.js, 1400+ code examples, handles OAuth/email/sessions/CSRF |
| @auth/prisma-adapter | Latest | Database adapter | Official adapter for storing users/accounts/sessions/tokens |
| @prisma/client | Latest | ORM + type-safe queries | Standard for Next.js, 11K+ code examples, automatic migrations |
| @auth/resend-adapter | Latest | Email delivery | Modern API-based service, 5-10s delivery time, serverless-friendly |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| nodemailer | 6.x | SMTP email delivery | Alternative to Resend if using existing SMTP server |
| @auth/pg-adapter | Latest | PostgreSQL adapter | Alternative to Prisma if no ORM needed |
| next-auth/react | v5 | Client-side hooks | Only for client components needing useSession() |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| NextAuth.js | Auth0 Next.js SDK | Managed service ($), vendor lock-in, but less setup |
| NextAuth.js | Clerk | Modern UI ($), but less customizable |
| Resend | SendGrid | More features, but slower setup and SMTP complexity |
| Prisma | Raw SQL with pg adapter | Less boilerplate, but lose type safety and migrations |

**Installation:**
```bash
npm install next-auth@beta @auth/prisma-adapter @prisma/client
npm install -D prisma
npx prisma init
```

## Architecture Patterns

### Recommended Project Structure
```
app/
├── api/
│   └── auth/
│       └── [...nextauth]/
│           └── route.ts          # NextAuth handlers
├── (auth)/
│   ├── signin/
│   │   └── page.tsx              # Custom sign-in page
│   └── onboarding/
│       └── page.tsx              # New user onboarding
├── dashboard/
│   └── page.tsx                  # Protected dashboard
└── middleware.ts                 # Route protection
lib/
├── auth.ts                       # NextAuth config + exports
└── prisma.ts                     # Prisma client singleton
prisma/
└── schema.prisma                 # Database schema
```

### Pattern 1: NextAuth Configuration (App Router)
**What:** Central auth configuration with providers and database adapter
**When to use:** Always - this is the foundation
**Example:**
```typescript
// lib/auth.ts
// Source: https://github.com/nextauthjs/next-auth/blob/main/docs/pages/getting-started/providers/google.mdx
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Resend from "next-auth/providers/resend"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: "noreply@brewclaw.com",
    }),
  ],
  pages: {
    signIn: '/signin',
    newUser: '/onboarding', // New users redirected here after first sign-in
  },
  session: {
    strategy: "jwt", // or "database" for database sessions
  },
})
```

### Pattern 2: API Route Handlers
**What:** Expose NextAuth endpoints for OAuth callbacks and API routes
**When to use:** Required for NextAuth to work
**Example:**
```typescript
// app/api/auth/[...nextauth]/route.ts
// Source: https://context7.com/nextauthjs/next-auth/llms.txt
import { handlers } from "@/lib/auth"

export const { GET, POST } = handlers
```

### Pattern 3: Server-Side Session Check with Redirect
**What:** Protect pages and redirect unauthenticated users
**When to use:** Dashboard, profile, and protected pages
**Example:**
```typescript
// app/dashboard/page.tsx
// Source: https://context7.com/nextauthjs/next-auth/llms.txt
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/api/auth/signin")
  }

  return (
    <div>
      <h1>Welcome, {session.user.name}</h1>
      <img src={session.user.image} alt="Avatar" />
    </div>
  )
}
```

### Pattern 4: Magic Link Form with Server Action
**What:** Email input form that sends magic link using server action
**When to use:** Sign-in page for passwordless authentication
**Example:**
```typescript
// Source: https://github.com/nextauthjs/next-auth/blob/main/docs/pages/getting-started/authentication/email.mdx
import { signIn } from "@/lib/auth"

export function MagicLinkForm() {
  return (
    <form action={async (formData) => {
      "use server"
      await signIn("resend", formData)
    }}>
      <input name="email" type="email" placeholder="Enter your email" required />
      <button type="submit">Send Magic Link</button>
    </form>
  )
}
```

### Pattern 5: Google OAuth Sign-In Button
**What:** Button that triggers Google OAuth flow
**When to use:** Sign-in page
**Example:**
```typescript
import { signIn } from "@/lib/auth"

export function GoogleSignInButton() {
  return (
    <form action={async () => {
      "use server"
      await signIn("google", { redirectTo: "/dashboard" })
    }}>
      <button type="submit">
        Continue with Google
      </button>
    </form>
  )
}
```

### Pattern 6: Prisma Client Singleton
**What:** Reuse Prisma client instance to prevent connection pool exhaustion
**When to use:** Always in Next.js development (hot reload) and production
**Example:**
```typescript
// lib/prisma.ts
// Source: https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
```

### Pattern 7: Middleware for Route Protection
**What:** Protect routes at the edge before rendering
**When to use:** Global route protection for /dashboard, /profile, etc.
**Example:**
```typescript
// middleware.ts
// Source: https://authjs.dev/getting-started/session-management/protecting
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnDashboard = req.nextUrl.pathname.startsWith('/dashboard')

  if (isOnDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL('/signin', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

### Pattern 8: Routing New vs Returning Users
**What:** Redirect logic based on user account creation time
**When to use:** After successful authentication to route to onboarding or dashboard
**Example:**
```typescript
// lib/auth.ts - Add to NextAuth config
// Source: https://github.com/nextauthjs/next-auth/discussions/9125
import NextAuth from "next-auth"
// ... other imports

export const { handlers, auth, signIn, signOut } = NextAuth({
  // ... other config
  pages: {
    signIn: '/signin',
    newUser: '/onboarding', // Automatic redirect for first-time users
  },
  callbacks: {
    async jwt({ token, user, account, isNewUser }) {
      // isNewUser is only available on first sign-in
      if (isNewUser) {
        token.isNewUser = true
      }
      return token
    },
    async session({ session, token }) {
      // Pass isNewUser to client if needed
      session.user.isNewUser = token.isNewUser
      return session
    },
  },
})
```

### Anti-Patterns to Avoid
- **Using client-side authentication checks only:** Server components and API routes can be accessed directly, bypassing client-side middleware. Always verify sessions server-side near data fetching.
- **Not using singleton pattern for Prisma:** Creates connection pool exhaustion in development from hot reloading.
- **Storing session in localStorage:** Vulnerable to XSS attacks. Use NextAuth's HTTP-only cookies.
- **Setting `sameSite: 'strict'`:** Breaks OAuth callback flows. Use `'lax'` for CSRF protection without blocking legitimate redirects.
- **Using `getServerSession` in App Router:** Deprecated in v5. Use `auth()` function instead.
- **Not setting NEXTAUTH_SECRET in production:** Causes JWT decryption failures and session loss.
- **Multiple Prisma Client instances:** Each instance creates its own connection pool, exhausting database connections in serverless.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| OAuth flow | Custom OAuth state management, token exchange, PKCE | NextAuth Google provider | Handles state validation, CSRF, token refresh, edge cases (invalid state errors) |
| Email verification tokens | Custom token generation + expiry logic | NextAuth Email provider | Built-in cryptographic token generation, database storage, expiry handling, rate limiting |
| Session management | Custom JWT signing/verification | NextAuth session strategy | Handles JWT encryption (JWE A256GCM), cookie security (HttpOnly, Secure, SameSite), CSRF tokens |
| CSRF protection | Manual CSRF token generation/validation | NextAuth built-in CSRF | Double-submit cookie method, automatic validation on all POST routes |
| Database schema | Custom user/account/session tables | NextAuth adapter schema | Handles account linking, OAuth account relationships, session expiry, verification tokens |
| Connection pooling | Manual connection management | Prisma Client | Automatic pool sizing (num_cpus * 2 + 1), connection reuse, serverless optimization |

**Key insight:** Authentication has numerous security edge cases (token replay attacks, CSRF, session fixation, OAuth state validation, account linking attacks). NextAuth.js handles these before you write code, preventing vulnerabilities that appear months after launch.

## Common Pitfalls

### Pitfall 1: Missing NEXTAUTH_SECRET in Production
**What goes wrong:** Sessions don't persist, JWEDecryptionFailed errors, all users logged out
**Why it happens:** Default secret generation only works in development. Production requires explicit secret.
**How to avoid:**
- Generate secret: `npx auth secret` or `openssl rand -base64 32`
- Set `NEXTAUTH_SECRET` environment variable in production
- NEVER commit secrets to git
**Warning signs:** JWT decryption errors after deployment, sessions clearing on refresh

### Pitfall 2: OAuthAccountNotLinked Error
**What goes wrong:** User signs in with Google using email@example.com, then tries magic link with same email - gets error
**Why it happens:** NextAuth prevents automatic account linking for security (prevents account takeover if email provider is compromised)
**How to avoid:**
- Accept this as intended security behavior
- OR set `allowDangerousEmailAccountLinking: true` in provider config IF you trust OAuth provider email verification
- Educate users to use same sign-in method
**Warning signs:** Error message "account with this email already exists"

### Pitfall 3: redirect_uri_mismatch Google OAuth Error
**What goes wrong:** Google OAuth fails with "redirect_uri_mismatch" error
**Why it happens:** Redirect URI in code doesn't match Google Cloud Console configuration
**How to avoid:**
- Google Console: Add exact callback URL: `http://localhost:3000/api/auth/callback/google` (dev)
- Google Console: Add production URL: `https://yourdomain.com/api/auth/callback/google` (prod)
- Restart dev server after adding URIs
- Verify NEXTAUTH_URL environment variable matches deployment URL
**Warning signs:** OAuth fails immediately after clicking "Continue with Google"

### Pitfall 4: Magic Link Token Consumed by Email Scanners
**What goes wrong:** User receives magic link, clicks it, gets "Invalid token" error
**Why it happens:** Corporate email security (Microsoft Defender, Proofpoint) pre-scans links before delivery, consuming single-use token
**How to avoid:**
- Implement first-request grace period (check User-Agent for common scanners)
- Use OTP codes instead of magic links for corporate environments
- Increase token attempts if using Better Auth
- Set token expiry to 10-15 minutes (balance security vs UX)
**Warning signs:** Users in corporate environments consistently report invalid token errors

### Pitfall 5: Database Connection Pool Exhaustion
**What goes wrong:** "Too many connections" errors, database becomes unresponsive
**Why it happens:** Next.js hot reload creates new Prisma Client instances, each with own connection pool
**How to avoid:**
- Use Prisma singleton pattern with `globalThis` (see Pattern 6)
- Set `connection_limit=1` in serverless environments
- Monitor connection count in production
- Use Prisma Accelerate for high-scale serverless
**Warning signs:** Connection errors in development after multiple hot reloads, serverless function timeouts

### Pitfall 6: Session Not Persisting Across Refresh
**What goes wrong:** User signs in successfully but gets logged out on page refresh
**Why it happens:** Cookie configuration issues - wrong domain, sameSite settings, or missing secure flag
**How to avoid:**
- Use default NextAuth cookie settings (don't override unless necessary)
- Set `sameSite: 'lax'` (not 'strict')
- Ensure `secure: true` in production (HTTPS)
- Verify cookie domain matches deployment domain
**Warning signs:** Login works but session clears on F5 refresh

### Pitfall 7: Magic Link Delivery Slower Than 30 Seconds
**What goes wrong:** Users wait 60+ seconds for magic link email
**Why it happens:** Using slow SMTP provider or not optimizing email delivery
**How to avoid:**
- Use Resend instead of Nodemailer (5-10s delivery vs 30-60s)
- Configure proper SPF/DKIM records for email domain
- Avoid Gmail SMTP for production (rate limited, slow)
- Implement rate limiting (60s between requests) to prevent abuse
**Warning signs:** User complaints about slow email delivery, support tickets about "not receiving email"

### Pitfall 8: Edge Runtime Incompatibility with Database Adapter
**What goes wrong:** Middleware fails with "module not supported in edge runtime" error
**Why it happens:** Database adapters use Node.js APIs not available in edge runtime
**How to avoid:**
- Split auth config into `auth.config.ts` (edge-safe, no adapter) for middleware
- Keep full config in `auth.ts` (with adapter) for server components/routes
- Use JWT session strategy in middleware (doesn't require database)
- Import minimal config in middleware
**Warning signs:** Edge runtime errors when deploying middleware with database adapter

## Code Examples

Verified patterns from official sources:

### Complete Prisma Schema for NextAuth
```prisma
// prisma/schema.prisma
// Source: https://context7.com/nextauthjs/next-auth/llms.txt
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Account {
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@id([provider, providerAccountId])
}

model Session {
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String
  expires    DateTime

  @@id([identifier, token])
}
```

### Environment Variables Setup
```bash
# .env.local
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/brewclaw"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Google OAuth
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"

# Resend Email
AUTH_RESEND_KEY="re_xxxxxxxxxxxx"
```

### Complete Sign-In Page Component
```tsx
// app/signin/page.tsx
import { signIn } from "@/lib/auth"

export default function SignInPage() {
  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto mt-20">
      <h1>Sign in to Brewclaw</h1>

      {/* Google OAuth */}
      <form action={async () => {
        "use server"
        await signIn("google", { redirectTo: "/dashboard" })
      }}>
        <button type="submit" className="w-full">
          Continue with Google
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      {/* Magic Link */}
      <form action={async (formData) => {
        "use server"
        await signIn("resend", formData)
      }}>
        <input
          name="email"
          type="email"
          placeholder="email@example.com"
          required
          className="w-full"
        />
        <button type="submit" className="w-full mt-2">
          Send Magic Link
        </button>
      </form>
    </div>
  )
}
```

### Client-Side Session Access (Optional)
```tsx
// app/profile/client-component.tsx
"use client"
import { useSession } from "next-auth/react"

export function UserProfile() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!session) {
    return <div>Not signed in</div>
  }

  return (
    <div>
      <p>Signed in as {session.user?.email}</p>
      <img src={session.user?.image} alt="Avatar" />
    </div>
  )
}

// Parent must be wrapped in SessionProvider
// app/profile/page.tsx
import { SessionProvider } from "next-auth/react"
import { UserProfile } from "./client-component"

export default function ProfilePage() {
  return (
    <SessionProvider>
      <UserProfile />
    </SessionProvider>
  )
}
```

### Custom Email Template (Optional)
```typescript
// lib/auth.ts - Custom email template
import Nodemailer from "next-auth/providers/nodemailer"

export const { handlers, auth, signIn, signOut } = NextAuth({
  // ... other config
  providers: [
    Nodemailer({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      sendVerificationRequest({
        identifier: email,
        url,
        provider: { server, from },
      }) {
        const { host } = new URL(url)
        const transport = createTransport(server)

        return transport.sendMail({
          to: email,
          from,
          subject: `Sign in to ${host}`,
          text: `Sign in to ${host}\n${url}\n\n`,
          html: `
            <body>
              <h1>Sign in to ${host}</h1>
              <p>Click the link below to sign in:</p>
              <a href="${url}">Sign in</a>
              <p>This link expires in 15 minutes.</p>
            </body>
          `,
        })
      },
    }),
  ],
})
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `getServerSession()` | `auth()` function | NextAuth v5 (2024) | Single function works everywhere (components, routes, middleware) |
| Separate Pages Router config | Unified App Router config | NextAuth v5 (2024) | Simpler setup, fewer files, better edge support |
| Manual CSRF token handling | Built-in CSRF protection | NextAuth v4+ | Automatic protection on all POST routes |
| `useSession()` everywhere | Server-side `auth()` preferred | Next.js 13+ | Better security, no client-side exposure of session data |
| Database sessions only | JWT + database options | NextAuth v4+ | JWT better for serverless, database better for revocation needs |
| Email provider manual setup | Resend provider built-in | NextAuth v5 (2024) | 5-10s delivery, simple API, no SMTP config |

**Deprecated/outdated:**
- `[...nextauth].js` in Pages Router: Use App Router `route.ts` instead
- `getServerSession(authOptions)`: Use `auth()` function in v5
- Unencrypted JWTs: v5 uses JWE (encrypted) by default for security
- Manual OAuth state management: Built-in in v5 with better PKCE support

## Open Questions

1. **Which database to use: PostgreSQL vs MySQL vs SQLite?**
   - What we know: Prisma supports all three, PostgreSQL most common in production
   - What's unclear: Project-specific database requirements, hosting preferences
   - Recommendation: PostgreSQL for production (better JSON support, more features), SQLite for quick development setup

2. **JWT vs Database session strategy?**
   - What we know: JWT faster (no DB query per request), Database sessions allow instant revocation
   - What's unclear: Need for instant session revocation (logout all devices, ban user)
   - Recommendation: Start with JWT (simpler, faster). Switch to database sessions if need instant revocation or long session durations (30+ days)

3. **Custom email template design needed?**
   - What we know: NextAuth provides default text email, customizable via `sendVerificationRequest`
   - What's unclear: Brewclaw branding requirements, HTML email needs
   - Recommendation: Start with default, customize later if branding needed (see Custom Email Template example)

4. **Email rate limiting threshold?**
   - What we know: Default 60s between requests per email, 1 hour token expiry
   - What's unclear: Expected user behavior, abuse patterns
   - Recommendation: Keep 60s default, monitor for abuse, adjust if needed

5. **OAuth account linking policy?**
   - What we know: NextAuth prevents auto-linking for security, can enable with `allowDangerousEmailAccountLinking: true`
   - What's unclear: User experience priority vs security priority
   - Recommendation: Keep auto-linking disabled (secure default). Handle OAuthAccountNotLinked error with friendly message: "This email is already registered. Please sign in with [original method]."

## Sources

### Primary (HIGH confidence)
- NextAuth.js Context7 Documentation (/nextauthjs/next-auth) - OAuth, email providers, session management
- Prisma Documentation (/prisma/docs) - Database schema, adapter setup
- [NextAuth.js Google Provider Docs](https://github.com/nextauthjs/next-auth/blob/main/docs/pages/getting-started/providers/google.mdx)
- [NextAuth.js Email Authentication](https://github.com/nextauthjs/next-auth/blob/main/docs/pages/getting-started/authentication/email.mdx)
- [Auth.js Session Management](https://authjs.dev/getting-started/session-management/protecting)

### Secondary (MEDIUM confidence)
- [Next.js Launchpad: NextAuth v5 Guide](https://nextjslaunchpad.com/article/nextjs-authentication-authjs-v5-complete-guide-sessions-providers-route-protection) - v5 best practices
- [WorkOS: Next.js App Router Auth Guide 2026](https://workos.com/blog/nextjs-app-router-authentication-guide-2026) - Redirect patterns
- [Clerk: Next.js Session Management 2025](https://clerk.com/articles/nextjs-session-management-solving-nextauth-persistence-issues) - Common pitfalls
- [Medium: Resend vs Nodemailer](https://devdiwan.medium.com/goodbye-nodemailer-why-i-switched-to-resend-for-sending-emails-in-node-js-55e5a0dba899) - Email delivery comparison
- [Prisma Production Guide](https://www.digitalapplied.com/blog/prisma-orm-production-guide-nextjs) - Connection pooling

### Tertiary (LOW confidence)
- [NextAuth Error Documentation](https://next-auth.js.org/errors) - Error handling reference
- [Magic Link Security Guide](https://guptadeepak.com/mastering-magic-link-security-a-deep-dive-for-developers/) - Security best practices
- [GitHub: New User Redirect Discussion](https://github.com/nextauthjs/next-auth/discussions/9125) - Routing patterns

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - NextAuth is documented standard with 1400+ examples, Prisma with 11K+ examples
- Architecture: HIGH - Official Next.js App Router patterns from Context7 and official docs
- Pitfalls: HIGH - Verified from official error docs and multiple production reports

**Research date:** 2026-02-25
**Valid until:** 2026-03-27 (30 days - NextAuth v5 is stable, no major changes expected)
