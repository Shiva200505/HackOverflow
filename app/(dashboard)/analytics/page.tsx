import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { BarChart3, TrendingUp } from "lucide-react"
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard"

export default async function AnalyticsPage() {
    const session = await auth()

    if (!session) {
        redirect("/login")
    }

    // Only management can access analytics
    if (session.user?.role !== "MANAGEMENT") {
        redirect("/dashboard")
    }

    return (
        <div className="space-y-6">
            {/* Page Header with Gradient */}
            <div className="mb-6 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white shadow-xl">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                    <BarChart3 className="h-8 w-8" />
                                </div>
                                <h1 className="text-4xl font-bold">Analytics</h1>
                            </div>
                            <p className="text-white/90 text-lg">
                                Comprehensive insights and performance metrics
                            </p>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <TrendingUp className="h-5 w-5" />
                            <span className="font-semibold">Management Dashboard</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto p-6">
                <AnalyticsDashboard />
            </div>
        </div>
    )
}
