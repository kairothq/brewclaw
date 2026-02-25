import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function OnboardingPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/signin")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome to Brewclaw!</h1>
          <p className="text-gray-600 mt-2">
            Let&apos;s get you set up. First, choose your AI assistant.
          </p>
        </div>

        <div className="bg-gray-100 rounded-lg p-6 text-center">
          <p className="text-gray-500">
            [AI Selection Component - Coming in Step 2]
          </p>
        </div>

        {/* Placeholder: Will be replaced with actual AI selection in Phase 13+ */}
        <p className="text-sm text-gray-400 text-center">
          Signed in as {session.user.email}
        </p>
      </div>
    </div>
  )
}
