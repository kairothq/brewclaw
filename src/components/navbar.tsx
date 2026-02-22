"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const navItems = [
  { label: "Features", href: "#features", disabled: false },
  { label: "Pricing", href: "#pricing", disabled: false },
  { label: "Docs", href: "#docs", disabled: true, tooltip: "Coming soon" },
]

export function Navbar() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Detect scroll to add solid background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, disabled: boolean) => {
    if (disabled) {
      e.preventDefault()
      return
    }
    // Smooth scroll to section
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl"
    >
      <nav
        className={`relative flex items-center justify-between px-4 py-3 rounded-full backdrop-blur-xl border transition-all duration-300 ${
          scrolled
            ? "bg-zinc-900/60 border-zinc-700/50 shadow-lg shadow-black/20"
            : "bg-zinc-900/30 border-zinc-800/50"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-heading font-semibold text-white text-lg">BrewClaw</span>
        </Link>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex items-center gap-1 relative">
          <TooltipProvider>
            {navItems.map((item, index) => (
              <div key={item.label} className="relative">
                {item.disabled ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span
                        className="relative px-4 py-2 text-sm text-zinc-500 cursor-not-allowed"
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                      >
                        {hoveredIndex === index && (
                          <motion.div
                            layoutId="navbar-hover"
                            className="absolute inset-0 bg-zinc-800 rounded-full"
                            initial={false}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        )}
                        <span className="relative z-10">{item.label}</span>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{item.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <a
                    href={item.href}
                    className="relative px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={(e) => handleNavClick(e, item.href, item.disabled)}
                  >
                    {hoveredIndex === index && (
                      <motion.div
                        layoutId="navbar-hover"
                        className="absolute inset-0 bg-zinc-800 rounded-full"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </a>
                )}
              </div>
            ))}
          </TooltipProvider>
        </div>

        {/* CTA Button (Desktop) */}
        <div className="hidden md:flex items-center">
          <Button
            size="sm"
            className="shimmer-btn bg-white text-zinc-950 hover:bg-zinc-200 rounded-full px-4"
          >
            Get Started
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <button
              className="p-2 text-zinc-400 hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-zinc-900 border-zinc-800">
            <SheetHeader>
              <SheetTitle className="text-white font-heading">Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-2 mt-6">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.disabled ? undefined : item.href}
                  className={`px-4 py-3 text-sm rounded-lg transition-colors ${
                    item.disabled
                      ? "text-zinc-500 cursor-not-allowed"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                  }`}
                  onClick={(e) => {
                    if (!item.disabled) {
                      handleNavClick(e, item.href, item.disabled)
                      setMobileMenuOpen(false)
                    }
                  }}
                >
                  {item.label}
                  {item.disabled && (
                    <span className="ml-2 text-xs text-zinc-600">({item.tooltip})</span>
                  )}
                </a>
              ))}
              <hr className="border-zinc-800 my-2" />
              <Button className="shimmer-btn bg-white text-zinc-950 hover:bg-zinc-200 rounded-full">
                Get Started
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </motion.header>
  )
}
