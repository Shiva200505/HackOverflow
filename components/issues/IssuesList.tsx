"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Filter, MessageSquare, ThumbsUp, Loader2 } from "lucide-react"
import { FadeIn, StaggerContainer, StaggerItem, HoverCard } from "@/components/ui/motion"

const PRIORITY_COLORS = {
    LOW: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    MEDIUM: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    HIGH: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    EMERGENCY: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

const STATUS_COLORS = {
    REPORTED: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    ASSIGNED: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    IN_PROGRESS: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    RESOLVED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    CLOSED: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
}

interface Issue {
    id: string
    title: string
    description: string
    category: string
    priority: string
    status: string
    visibility: string
    hostel: string
    block: string
    room: string
    createdAt: string
    reporter: {
        name: string
        email: string
    }
    _count: {
        comments: number
        reactions: number
    }
}

export default function IssuesList() {
    const [issues, setIssues] = useState<Issue[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [filters, setFilters] = useState({
        category: "all",
        priority: "all",
        status: "all",
    })

    useEffect(() => {
        const fetchIssues = async () => {
            setIsLoading(true)
            try {
                const params = new URLSearchParams()
                if (filters.category !== "all") params.append("category", filters.category)
                if (filters.priority !== "all") params.append("priority", filters.priority)
                if (filters.status !== "all") params.append("status", filters.status)

                const response = await fetch(`/api/issues?${params}`)
                const data = await response.json()
                setIssues(data)
            } catch (error) {
                console.error("Failed to fetch issues:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchIssues()
    }, [filters])

    return (
        <FadeIn className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">All Issues</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        {issues.length} issue{issues.length !== 1 ? "s" : ""} found
                    </p>
                </div>
                <Link href="/issues/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Report Issue
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filters
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Category</label>
                            <Select
                                value={filters.category}
                                onValueChange={(value) => setFilters({ ...filters, category: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    <SelectItem value="PLUMBING">Plumbing</SelectItem>
                                    <SelectItem value="ELECTRICAL">Electrical</SelectItem>
                                    <SelectItem value="CLEANLINESS">Cleanliness</SelectItem>
                                    <SelectItem value="INTERNET">Internet</SelectItem>
                                    <SelectItem value="FURNITURE">Furniture</SelectItem>
                                    <SelectItem value="OTHER">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Priority</label>
                            <Select
                                value={filters.priority}
                                onValueChange={(value) => setFilters({ ...filters, priority: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Priorities</SelectItem>
                                    <SelectItem value="LOW">Low</SelectItem>
                                    <SelectItem value="MEDIUM">Medium</SelectItem>
                                    <SelectItem value="HIGH">High</SelectItem>
                                    <SelectItem value="EMERGENCY">Emergency</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Status</label>
                            <Select
                                value={filters.status}
                                onValueChange={(value) => setFilters({ ...filters, status: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="REPORTED">Reported</SelectItem>
                                    <SelectItem value="ASSIGNED">Assigned</SelectItem>
                                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                                    <SelectItem value="CLOSED">Closed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {isLoading ? (
                <div className="text-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-4" />
                    <p className="text-gray-500">Loading issues...</p>
                </div>
            ) : issues.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-gray-500">No issues found. Be the first to report one!</p>
                    </CardContent>
                </Card>
            ) : (
                <StaggerContainer className="grid gap-4">
                    {issues.map((issue) => (
                        <StaggerItem key={issue.id}>
                            <Link href={`/issues/${issue.id}`}>
                                <HoverCard>
                                    <Card className="border border-slate-200 dark:border-slate-800 transition-colors hover:border-blue-300 dark:hover:border-blue-700">
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Badge className={PRIORITY_COLORS[issue.priority as keyof typeof PRIORITY_COLORS]}>
                                                            {issue.priority}
                                                        </Badge>
                                                        <Badge className={STATUS_COLORS[issue.status as keyof typeof STATUS_COLORS]}>
                                                            {issue.status.replace("_", " ")}
                                                        </Badge>
                                                        <Badge variant="outline">{issue.category}</Badge>
                                                    </div>
                                                    <h3 className="text-lg font-semibold mb-1">{issue.title}</h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                                                        {issue.description}
                                                    </p>
                                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                                        <span>📍 {issue.hostel} - {issue.block} - Room {issue.room}</span>
                                                        <span>👤 {issue.reporter.name}</span>
                                                        <span>🕒 {new Date(issue.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-4 text-sm text-gray-500 ml-4">
                                                    <div className="flex items-center gap-1">
                                                        <MessageSquare className="h-4 w-4" />
                                                        {issue._count.comments}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <ThumbsUp className="h-4 w-4" />
                                                        {issue._count.reactions}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </HoverCard>
                            </Link>
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            )}
        </FadeIn>
    )
}
