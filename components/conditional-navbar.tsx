"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/navbar"

// Routes where navbar should be hidden
const HIDDEN_NAVBAR_ROUTES = [
  "/onboarding",
  "/dashboard",
  "/settings",
  "/signin",
  "/signup",
]

export function ConditionalNavbar() {
  const pathname = usePathname()

  // Check if current path starts with any of the hidden routes
  const shouldHideNavbar = HIDDEN_NAVBAR_ROUTES.some(route =>
    pathname?.startsWith(route)
  )

  if (shouldHideNavbar) {
    return null
  }

  return <Navbar />
}
