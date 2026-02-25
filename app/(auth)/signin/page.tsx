import { GoogleSignInButton } from "@/components/auth/google-signin-button"
import { MagicLinkForm } from "@/components/auth/magic-link-form"

export default function SignInPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Sign in to Brewclaw</h1>
        <p className="mt-2 text-sm text-gray-600">
          Choose your preferred sign-in method
        </p>
      </div>

      <GoogleSignInButton />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">
            Or continue with
          </span>
        </div>
      </div>

      <MagicLinkForm />

      <p className="text-center text-xs text-gray-500">
        By signing in, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  )
}
