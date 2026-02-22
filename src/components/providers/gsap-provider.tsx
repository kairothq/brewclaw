"use client"

import { useEffect } from 'react'
import { ScrollTrigger } from '@/lib/gsap-config'

export function GSAPProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Configure ScrollTrigger defaults
    ScrollTrigger.defaults({
      toggleActions: 'play none none reverse',
    })

    // Cleanup all ScrollTriggers on unmount
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return <>{children}</>
}
