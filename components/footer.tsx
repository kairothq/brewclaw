import { Github, Twitter, Linkedin, Instagram } from "lucide-react"

const footerLinks = {
  product: {
    title: "PRODUCT",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Documentation", href: "#", disabled: true },
      { label: "Changelog", href: "#" },
    ],
  },
  company: {
    title: "COMPANY",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#", disabled: true, tooltip: "Coming soon" },
      { label: "Careers", href: "#", disabled: true, tooltip: "Coming soon" },
    ],
  },
  legal: {
    title: "LEGAL",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
    ],
  },
  contact: {
    title: "CONTACT",
    links: [
      { label: "hello@brewclaw.com", href: "mailto:hello@brewclaw.com", isEmail: true },
      { label: "Austin, TX", href: "#", isLocation: true },
    ],
  },
}

const socialLinks = [
  { icon: Github, href: "https://github.com/brewclaw", label: "GitHub" },
  { icon: Twitter, href: "https://x.com/brewclaw", label: "X (Twitter)" },
  { icon: Linkedin, href: "https://linkedin.com/company/brewclaw", label: "LinkedIn" },
  { icon: Instagram, href: "https://instagram.com/brewclaw", label: "Instagram" },
]

export function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Column Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Product Column */}
          <div>
            <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-4">
              {footerLinks.product.title}
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.disabled ? undefined : link.href}
                    className={`text-sm transition-colors ${
                      link.disabled
                        ? "text-zinc-600 cursor-not-allowed"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-4">
              {footerLinks.company.title}
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.disabled ? undefined : link.href}
                    className={`text-sm transition-colors ${
                      link.disabled
                        ? "text-zinc-600 cursor-not-allowed"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {link.label}
                    {link.disabled && link.tooltip && (
                      <span className="ml-1 text-xs text-zinc-600">({link.tooltip})</span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-4">
              {footerLinks.legal.title}
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-4">
              {footerLinks.contact.title}
            </h3>
            <ul className="space-y-3">
              {footerLinks.contact.links.map((link) => (
                <li key={link.label}>
                  {link.isEmail ? (
                    <a
                      href={link.href}
                      className="text-sm text-zinc-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <span className="text-sm text-zinc-500">{link.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-4 mt-12">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-white transition-colors"
              aria-label={social.label}
            >
              <social.icon className="w-5 h-5" />
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="border-t border-zinc-800 mt-12 pt-6">
          <p className="text-sm text-zinc-500 text-center">
            &copy; {new Date().getFullYear()} BrewClaw. Deploy smarter, not harder.
          </p>
        </div>
      </div>
    </footer>
  )
}
