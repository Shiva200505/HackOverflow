"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MapPin, User, CheckCircle2, AlertCircle, Timer, XCircle } from "lucide-react"

const PRIORITY_STYLES = {
    LOW: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
    MEDIUM: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800",
    HIGH: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
    URGENT: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800 animate-pulse",
}

const STATUS_ICONS = {
    REPORTED: AlertCircle,
    ASSIGNED: User,
    IN_PROGRESS: Timer,
    RESOLVED: CheckCircle2,
    CLOSED: XCircle,
}

const STATUS_Styles = {
    REPORTED: "bg-blue-100 text-blue-700 border-blue-200",
    ASSIGNED: "bg-purple-100 text-purple-700 border-purple-200",
    IN_PROGRESS: "bg-amber-100 text-amber-700 border-amber-200",
    RESOLVED: "bg-emerald-100 text-emerald-700 border-emerald-200",
    CLOSED: "bg-gray-100 text-gray-700 border-gray-200",
}

interface IssueDetailProps {
    issueId: string
    isManagement: boolean
}

interface IssueWithDetails {
    id: string
    title: string
    description: string
    status: string
    priority: string
    category: string
    visibility: string
    hostel: string
    block: string
    room: string
    reportedAt: string
    resolvedAt?: string
    reporter: {
        id: string
        name: string
    }
    mediaUrls?: string[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    comments?: any[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reactions?: any[]
}

export default function IssueDetail({ issueId, isManagement }: IssueDetailProps) {
    const router = useRouter()
    const [issue, setIssue] = useState<IssueWithDetails | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isUpdating, setIsUpdating] = useState(false)

    const fetchIssue = useCallback(async () => {
        try {
            const response = await fetch(`/api/issues/${issueId}`)
            if (response.ok) {
                const data = await response.json()
                setIssue(data)
            }
        } catch (error) {
            console.error("Failed to fetch issue:", error)
        } finally {
            setIsLoading(false)
        }
    }, [issueId])

    useEffect(() => {
        fetchIssue()
    }, [fetchIssue])

    const updateStatus = async (newStatus: string) => {
        setIsUpdating(true)
        try {
            const response = await fetch(`/api/issues/${issueId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            })

            if (response.ok) {
                await fetchIssue()
                router.refresh()
            }
        } catch (error) {
            console.error("Failed to update status:", error)
        } finally {
            setIsUpdating(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
                <p className="text-gray-500 font-medium animate-pulse">Loading issue details...</p>
            </div>
        )
    }

    if (!issue) {
        return (
            <Card className="border-red-200 bg-red-50 dark:bg-red-900/10">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <XCircle className="h-12 w-12 text-red-500 mb-4" />
                    <h3 className="text-lg font-bold text-red-900 dark:text-red-200">Issue Not Found</h3>
                    <p className="text-red-700 dark:text-red-300">The requested issue could not be found or has been deleted.</p>
                </CardContent>
            </Card>
        )
    }

    const StatusIcon = STATUS_ICONS[issue.status as keyof typeof STATUS_ICONS] || AlertCircle

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <Card className="border-none shadow-xl bg-white dark:bg-gray-800 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="space-y-3">
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="outline" className={`${PRIORITY_STYLES[issue.priority as keyof typeof PRIORITY_STYLES]} border px-3 py-1`}>
                                    {issue.priority} Priority
                                </Badge>
                                <Badge variant="outline" className={`${STATUS_Styles[issue.status as keyof typeof STATUS_Styles]} border px-3 py-1 flex items-center gap-1`}>
                                    <StatusIcon className="h-3 w-3" />
                                    {issue.status.replace("_", " ")}
                                </Badge>
                                <Badge variant="outline" className="px-3 py-1 border-gray-200 bg-gray-50 text-gray-700">{issue.category}</Badge>
                                <Badge variant="outline" className="px-3 py-1 border-gray-200 bg-gray-50 text-gray-700">{issue.visibility}</Badge>
                            </div>
                            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                                {issue.title}
                            </CardTitle>
                        </div>
                        {isManagement && (
                            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-100 dark:border-gray-600">
                                <span className="text-sm font-medium text-gray-500">Update Status:</span>
                                <Select
                                    value={issue.status}
                                    onValueChange={updateStatus}
                                    disabled={isUpdating}
                                >
                                    <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800 border-gray-200">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="REPORTED">Reported</SelectItem>
                                        <SelectItem value="ASSIGNED">Assigned</SelectItem>
                                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                        <SelectItem value="RESOLVED">Resolved</SelectItem>
                                        <SelectItem value="CLOSED">Closed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="prose dark:prose-invert max-w-none bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700/50">
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-blue-500" />
                            Description
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                            {issue.description}
                        </p>
                    </div>

                    {issue.mediaUrls && issue.mediaUrls.length > 0 && (
                        <div>
                            <h3 className="font-semibold mb-4 text-lg">Attached Images</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {issue.mediaUrls.map((url: string, index: number) => (
                                    <div key={index} className="group relative aspect-video rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700 bg-gray-100">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={url}
                                            alt={`Issue image ${index + 1}`}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 bg-white dark:bg-gray-800 rounded-xl">
                        <div className="p-4 rounded-lg border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-2 text-blue-600 dark:text-blue-400">
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <span className="font-semibold">Location</span>
                            </div>
                            <div className="pl-12">
                                <p className="font-medium text-gray-900 dark:text-white capitalize">{issue.hostel}</p>
                                <p className="text-sm text-gray-500">{issue.block} • Room {issue.room}</p>
                            </div>
                        </div>

                        <div className="p-4 rounded-lg border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-2 text-purple-600 dark:text-purple-400">
                                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                    <User className="h-5 w-5" />
                                </div>
                                <span className="font-semibold">Reported By</span>
                            </div>
                            <div className="pl-12">
                                <p className="font-medium text-gray-900 dark:text-white">{issue.reporter.name}</p>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(issue.reportedAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div className="p-4 rounded-lg border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-2 text-indigo-600 dark:text-indigo-400">
                                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                                    <Timer className="h-5 w-5" />
                                </div>
                                <span className="font-semibold">Timeline</span>
                            </div>
                            <div className="pl-12 space-y-1 text-sm">
                                <p className="text-gray-600 dark:text-gray-400">
                                    <span className="font-medium">Reported:</span> {new Date(issue.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                {issue.resolvedAt && (
                                    <p className="text-green-600 dark:text-green-400">
                                        <span className="font-medium">Resolved:</span> {new Date(issue.resolvedAt).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {issue.comments && issue.comments.length > 0 && (
                <Card className="border-none shadow-lg bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-200">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                                <User className="h-4 w-4 text-blue-600" />
                            </div>
                            Activity & Comments
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {issue.comments && issue.comments.map((comment: any) => (
                            <div key={comment.id} className="flex gap-4 group">
                                <div className="flex flex-col items-center">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold ring-4 ring-white dark:ring-gray-900">
                                        {comment.user.name.charAt(0)}
                                    </div>
                                    <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 mt-2 group-last:hidden"></div>
                                </div>
                                <div className="flex-1 pb-6">
                                    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-sm text-gray-900 dark:text-white">{comment.user.name}</span>
                                                <Badge variant="secondary" className="text-[10px] h-5">
                                                    {comment.user.role}
                                                </Badge>
                                            </div>
                                            <span className="text-xs text-gray-400">
                                                {new Date(comment.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                            {comment.content}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
