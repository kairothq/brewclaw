import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { MotionProvider } from '@/components/providers/motion-provider'
import { GSAPProvider } from '@/components/providers/gsap-provider'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'BrewClaw - Your Personal AI Assistant',
  description: 'Deploy your personal AI assistant in under 5 minutes. No code needed.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="font-sans antialiased bg-background text-foreground">
        <MotionProvider>
          <GSAPProvider>
            {children}
          </GSAPProvider>
        </MotionProvider>
      </body>
    </html>
  )
}
