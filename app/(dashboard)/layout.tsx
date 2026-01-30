import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { EmergencySOS } from "@/components/EmergencySOS"
import { QuickActions } from "@/components/QuickActions"
import { SignOutButton } from "@/components/auth/SignOutButton"
import {
    Home,
    AlertCircle,
    Megaphone,
    Search,
    BarChart3,
    Trophy
} from "lucide-react"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    if (!session) {
        redirect("/login")
    }

    const isManagement = session.user?.role === "MANAGEMENT"

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Sidebar */}
            <aside className="hidden w-64 border-r border-gray-200 dark:border-gray-700 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 lg:block shadow-xl">
                <div className="flex h-full flex-col">
                    <div className="border-b border-gray-200 dark:border-gray-700 p-6 bg-gradient-to-r from-blue-600 to-purple-600">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                🏠
                            </div>
                            Hostel Tracker
                        </h2>
                        <p className="text-sm text-white/90 mt-2 font-medium">
                            {session.user?.name}
                        </p>
                        <p className="text-xs text-white/70 mt-1 px-2 py-1 bg-white/20 rounded-full inline-block">
                            {session.user?.role}
                        </p>
                    </div>

                    <nav className="flex-1 space-y-1 p-4">
                        <Link href="/dashboard">
                            <Button variant="ghost" className="w-full justify-start">
                                <Home className="mr-2 h-4 w-4" />
                                Dashboard
                            </Button>
                        </Link>
                        <Link href="/issues">
                            <Button variant="ghost" className="w-full justify-start">
                                <AlertCircle className="mr-2 h-4 w-4" />
                                Issues
                            </Button>
                        </Link>
                        <Link href="/announcements">
                            <Button variant="ghost" className="w-full justify-start">
                                <Megaphone className="mr-2 h-4 w-4" />
                                Announcements
                            </Button>
                        </Link>
                        <Link href="/lost-found">
                            <Button variant="ghost" className="w-full justify-start">
                                <Search className="mr-2 h-4 w-4" />
                                Lost & Found
                            </Button>
                        </Link>
                        <Link href="/leaderboard">
                            <Button variant="ghost" className="w-full justify-start">
                                <Trophy className="mr-2 h-4 w-4" />
                                Leaderboard
                            </Button>
                        </Link>
                        {isManagement && (
                            <Link href="/analytics">
                                <Button variant="ghost" className="w-full justify-start">
                                    <BarChart3 className="mr-2 h-4 w-4" />
                                    Analytics
                                </Button>
                            </Link>
                        )}
                    </nav>

                    <div className="border-t p-4 space-y-2">
                        <div className="flex items-center justify-between px-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Theme</span>
                            <ThemeToggle />
                        </div>
                        <SignOutButton />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Floating Action Components */}
            <EmergencySOS />
            <QuickActions />
        </div>
    )
}
