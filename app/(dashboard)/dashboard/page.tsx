import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
    AlertCircle,
    Megaphone,
    Search,
    TrendingUp,
    Clock,
    CheckCircle2,
    Plus,
    Sparkles,
    Zap,
    Target
} from "lucide-react"

export default async function DashboardPage() {
    const session = await auth()

    if (!session) {
        redirect("/login")
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
    })

    // Get user's issues
    const myIssues = await prisma.issue.count({
        where: { reporterId: session.user.id },
    })

    const myPendingIssues = await prisma.issue.count({
        where: {
            reporterId: session.user.id,
            status: { in: ["REPORTED", "ASSIGNED", "IN_PROGRESS"] },
        },
    })

    // Get recent issues
    const recentIssues = await prisma.issue.findMany({
        where: session.user.role === "STUDENT"
            ? { OR: [{ reporterId: session.user.id }, { visibility: "PUBLIC" }] }
            : {},
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
            reporter: {
                select: { name: true },
            },
        },
    })

    // Get recent announcements
    const recentAnnouncements = await prisma.announcement.findMany({
        take: 3,
        orderBy: { createdAt: "desc" },
        include: {
            author: {
                select: { name: true },
            },
        },
    })

    const isManagement = session.user.role === "MANAGEMENT"

    // Management stats
    let totalIssues = 0
    let pendingIssues = 0
    let resolvedIssues = 0

    if (isManagement) {
        totalIssues = await prisma.issue.count()
        pendingIssues = await prisma.issue.count({
            where: { status: { in: ["REPORTED", "ASSIGNED", "IN_PROGRESS"] } },
        })
        resolvedIssues = await prisma.issue.count({
            where: { status: { in: ["RESOLVED", "CLOSED"] } },
        })
    }

    const PRIORITY_COLORS = {
        LOW: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
        MEDIUM: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
        HIGH: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
        URGENT: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    }

    const STATUS_COLORS = {
        REPORTED: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        ASSIGNED: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
        IN_PROGRESS: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        RESOLVED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        CLOSED: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="container mx-auto p-6 space-y-8">
                {/* Welcome Section with Gradient */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 text-white shadow-2xl">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <Sparkles className="h-8 w-8 animate-pulse" />
                            <h1 className="text-4xl font-bold">Welcome back, {user?.name}!</h1>
                        </div>
                        <p className="text-white/90 text-lg">
                            {isManagement ? "🎯 Manage hostel operations efficiently" : `📍 ${user?.hostel} - ${user?.block} - Room ${user?.room}`}
                        </p>
                    </div>
                    {/* Decorative circles */}
                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
                    <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
                </div>

                {/* Quick Stats with Enhanced Design */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {isManagement ? (
                        <>
                            <Card className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                                <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-blue-500/10 -mr-12 -mt-12"></div>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-semibold text-blue-900 dark:text-blue-100">Total Issues</CardTitle>
                                    <div className="p-2 bg-blue-500 rounded-lg">
                                        <AlertCircle className="h-5 w-5 text-white" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{totalIssues}</div>
                                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">All reported issues</p>
                                </CardContent>
                            </Card>

                            <Card className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
                                <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-orange-500/10 -mr-12 -mt-12"></div>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-semibold text-orange-900 dark:text-orange-100">Pending</CardTitle>
                                    <div className="p-2 bg-orange-500 rounded-lg animate-pulse">
                                        <Clock className="h-5 w-5 text-white" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{pendingIssues}</div>
                                    <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">Needs attention</p>
                                </CardContent>
                            </Card>

                            <Card className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                                <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-green-500/10 -mr-12 -mt-12"></div>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-semibold text-green-900 dark:text-green-100">Resolved</CardTitle>
                                    <div className="p-2 bg-green-500 rounded-lg">
                                        <CheckCircle2 className="h-5 w-5 text-white" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">{resolvedIssues}</div>
                                    <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                                        {totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 0}% resolution rate
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
                                <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-purple-500/10 -mr-12 -mt-12"></div>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-semibold text-purple-900 dark:text-purple-100">Quick Actions</CardTitle>
                                    <div className="p-2 bg-purple-500 rounded-lg">
                                        <Target className="h-5 w-5 text-white" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Link href="/analytics">
                                        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-md">
                                            <TrendingUp className="mr-2 h-4 w-4" />
                                            View Analytics
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </>
                    ) : (
                        <>
                            <Card className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                                <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-blue-500/10 -mr-12 -mt-12"></div>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-semibold text-blue-900 dark:text-blue-100">My Issues</CardTitle>
                                    <div className="p-2 bg-blue-500 rounded-lg">
                                        <AlertCircle className="h-5 w-5 text-white" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{myIssues}</div>
                                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">Total reported</p>
                                </CardContent>
                            </Card>

                            <Card className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
                                <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-orange-500/10 -mr-12 -mt-12"></div>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-semibold text-orange-900 dark:text-orange-100">Pending</CardTitle>
                                    <div className="p-2 bg-orange-500 rounded-lg animate-pulse">
                                        <Clock className="h-5 w-5 text-white" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{myPendingIssues}</div>
                                    <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">In progress</p>
                                </CardContent>
                            </Card>

                            <Card className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                                <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-green-500/10 -mr-12 -mt-12"></div>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-semibold text-green-900 dark:text-green-100">Quick Actions</CardTitle>
                                    <div className="p-2 bg-green-500 rounded-lg">
                                        <Zap className="h-5 w-5 text-white" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Link href="/issues/new">
                                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white shadow-md">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Report Issue
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>

                            <Card className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
                                <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-purple-500/10 -mr-12 -mt-12"></div>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-semibold text-purple-900 dark:text-purple-100">Lost & Found</CardTitle>
                                    <div className="p-2 bg-purple-500 rounded-lg">
                                        <Search className="h-5 w-5 text-white" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Link href="/lost-found">
                                        <Button variant="outline" className="w-full border-purple-300 text-purple-700 hover:bg-purple-100 dark:border-purple-700 dark:text-purple-300">
                                            Browse Items
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>

                {/* Recent Issues with Enhanced Design */}
                <Card className="border-none shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Recent Issues
                                </CardTitle>
                                <CardDescription className="text-base">Latest reported issues</CardDescription>
                            </div>
                            <Link href="/issues">
                                <Button variant="outline" size="sm" className="shadow-md hover:shadow-lg transition-shadow">
                                    View All →
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            {recentIssues.length === 0 ? (
                                <div className="text-center py-12">
                                    <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                                    <p className="text-gray-500 text-lg">No issues yet</p>
                                </div>
                            ) : (
                                recentIssues.map((issue) => (
                                    <Link key={issue.id} href={`/issues/${issue.id}`}>
                                        <div className="group relative p-5 rounded-xl border-2 border-gray-100 hover:border-blue-300 dark:border-gray-700 dark:hover:border-blue-600 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-lg transition-all duration-300 cursor-pointer">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Badge className={`${PRIORITY_COLORS[issue.priority as keyof typeof PRIORITY_COLORS]} font-semibold`}>
                                                            {issue.priority}
                                                        </Badge>
                                                        <Badge className={`${STATUS_COLORS[issue.status as keyof typeof STATUS_COLORS]} font-semibold`}>
                                                            {issue.status.replace("_", " ")}
                                                        </Badge>
                                                    </div>
                                                    <h4 className="font-bold text-lg mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                        {issue.title}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                                                        {issue.description}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <span className="font-medium">{issue.reporter.name}</span>
                                                        <span>•</span>
                                                        <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                                                        <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Announcements with Enhanced Design */}
                <Card className="border-none shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-3 text-2xl font-bold">
                                    <div className="p-2 bg-purple-500 rounded-lg">
                                        <Megaphone className="h-6 w-6 text-white" />
                                    </div>
                                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                        Recent Announcements
                                    </span>
                                </CardTitle>
                                <CardDescription className="text-base ml-14">Latest hostel updates</CardDescription>
                            </div>
                            <Link href="/announcements">
                                <Button variant="outline" size="sm" className="shadow-md hover:shadow-lg transition-shadow">
                                    View All →
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            {recentAnnouncements.length === 0 ? (
                                <div className="text-center py-12">
                                    <Megaphone className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                                    <p className="text-gray-500 text-lg">No announcements yet</p>
                                </div>
                            ) : (
                                recentAnnouncements.map((announcement) => (
                                    <div key={announcement.id} className="p-5 rounded-xl border-2 border-purple-100 dark:border-purple-900 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 hover:shadow-lg transition-all duration-300">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h4 className="font-bold text-lg mb-2 text-purple-900 dark:text-purple-100">
                                                    {announcement.title}
                                                </h4>
                                                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-3">
                                                    {announcement.content}
                                                </p>
                                                <div className="flex items-center gap-2 text-xs text-purple-700 dark:text-purple-300">
                                                    <span className="font-medium">{announcement.author.name}</span>
                                                    <span>•</span>
                                                    <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
