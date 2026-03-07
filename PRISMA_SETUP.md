# Prisma Accelerate Setup for Magic Link Authentication

## Quick Setup (5 minutes)

### Option 1: Prisma Accelerate (Recommended for Vercel)

1. **Go to Prisma Data Platform:**
   https://console.prisma.io/

2. **Create new project:**
   - Click "New Project"
   - Choose "PostgreSQL"
   - Select region (closest to your users)

3. **Get connection string:**
   - Copy the **Connection pooler URL** (starts with `prisma://accelerate...`)
   - This is your `DATABASE_URL` for Vercel

4. **Add to Vercel:**
   ```
   Vercel Dashboard → brewclaw → Settings → Environment Variables
   
   Variable: DATABASE_URL
   Value: prisma://accelerate.prisma-data.net/?api_key=YOUR_KEY
   Environment: Production, Preview, Development
   ```

5. **Run migration:**
   ```bash
   # Locally with direct database URL (not Accelerate)
   DATABASE_URL="postgresql://user:pass@host/db" npx prisma migrate deploy
   
   # Or use Prisma console UI to run migrations
   ```

### Option 2: Direct PostgreSQL (Free tier options)

**Neon.tech (Free 500 MB):**
1. https://neon.tech → Sign up
2. Create database → Copy connection string
3. Enable connection pooling → Copy pooled connection string
4. Add to Vercel as `DATABASE_URL`

**Supabase (Free 500 MB):**
1. https://supabase.com → New project
2. Settings → Database → Connection string (Pooled)
3. Add to Vercel as `DATABASE_URL`

**Railway (Free $5 credit/month):**
1. https://railway.app → New project → PostgreSQL
2. Copy connection URL
3. Add to Vercel as `DATABASE_URL`

## Testing Locally

```bash
# Add to .env.local
DATABASE_URL="your_connection_string_here"

# Run migrations
npx prisma migrate deploy

# Generate client
npx prisma generate

# Test
npm run dev
```

## Vercel Deployment

After adding `DATABASE_URL`:
1. Redeploy staging
2. Magic link should now work at staging.brewclaw.com/onboarding

## Current Status

✅ Razorpay integration - DONE (live on staging)
✅ GCP provisioning API - DONE (integrated)
⏳ Magic link - NEEDS DATABASE_URL

