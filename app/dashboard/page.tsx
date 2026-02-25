import { auth, signOut } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/signin")
  }

  return (
    <div className="min-h-screen p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <form action={async () => {
          "use server"
          await signOut({ redirectTo: "/signin" })
        }}>
          <button type="submit" className="text-gray-600 hover:text-gray-900">
            Sign out
          </button>
        </form>
      </header>

      <main>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Welcome back!</h2>
          <p className="text-gray-600">
            Signed in as {session.user.email}
          </p>
          {session.user.image && (
            <img
              src={session.user.image}
              alt="Profile"
              className="w-12 h-12 rounded-full mt-4"
            />
          )}
        </div>

        <div className="mt-6 bg-gray-100 rounded-lg p-6">
          <p className="text-gray-500">
            [Dashboard content - Coming in future phases]
          </p>
        </div>
      </main>
    </div>
  )
}
