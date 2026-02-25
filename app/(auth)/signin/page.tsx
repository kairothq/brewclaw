import { GoogleSignInButton } from "@/components/auth/google-signin-button"
import { MagicLinkForm } from "@/components/auth/magic-link-form"

export default function SignInPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Sign in to Brewclaw</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose your preferred sign-in method
        </p>
      </div>

      <GoogleSignInButton />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <MagicLinkForm />

      <p className="text-center text-xs text-muted-foreground">
        By signing in, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  )
}
