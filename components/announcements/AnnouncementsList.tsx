"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Megaphone, MessageSquare, Calendar, Loader2 } from "lucide-react"
import { FadeIn, StaggerContainer, StaggerItem, HoverCard } from "@/components/ui/motion"

const TYPE_COLORS = {
    CLEANING: "bg-blue-100 text-blue-800",
    PEST_CONTROL: "bg-yellow-100 text-yellow-800",
    DOWNTIME: "bg-red-100 text-red-800",
    MAINTENANCE: "bg-orange-100 text-orange-800",
    GENERAL: "bg-gray-100 text-gray-800",
}

const TYPE_ICONS = {
    CLEANING: "🧹",
    PEST_CONTROL: "🐜",
    DOWNTIME: "⚠️",
    MAINTENANCE: "🔧",
    GENERAL: "📢",
}

interface Announcement {
    id: string
    title: string
    content: string
    type: string
    targetHostels: string[]
    createdAt: string
    author: {
        name: string
        email: string
    }
    _count: {
        comments: number
        reactions: number
    }
}

interface AnnouncementsListProps {
    isManagement: boolean
}

export default function AnnouncementsList({ isManagement }: AnnouncementsListProps) {
    const [announcements, setAnnouncements] = useState<Announcement[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [typeFilter, setTypeFilter] = useState("all")

    useEffect(() => {
        const fetchAnnouncements = async () => {
            setIsLoading(true)
            try {
                const params = new URLSearchParams()
                if (typeFilter !== "all") params.append("type", typeFilter)

                const response = await fetch(`/api/announcements?${params}`)
                const data = await response.json()
                setAnnouncements(data)
            } catch (error) {
                console.error("Failed to fetch announcements:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchAnnouncements()
    }, [typeFilter])

    return (
        <FadeIn className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Announcements</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Stay updated with hostel news and notices
                    </p>
                </div>
                {isManagement && (
                    <Link href="/announcements/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            New Announcement
                        </Button>
                    </Link>
                )}
            </div>

            <div className="flex items-center gap-4">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="CLEANING">Cleaning</SelectItem>
                        <SelectItem value="PEST_CONTROL">Pest Control</SelectItem>
                        <SelectItem value="DOWNTIME">Downtime</SelectItem>
                        <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                        <SelectItem value="GENERAL">General</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {isLoading ? (
                <div className="text-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-4" />
                    <p className="text-gray-500">Loading announcements...</p>
                </div>
            ) : announcements.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <Megaphone className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500">No announcements yet</p>
                    </CardContent>
                </Card>
            ) : (
                <StaggerContainer className="space-y-4">
                    {announcements.map((announcement) => (
                        <StaggerItem key={announcement.id}>
                            <HoverCard>
                                <Card className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="text-3xl">
                                                {TYPE_ICONS[announcement.type as keyof typeof TYPE_ICONS]}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Badge className={TYPE_COLORS[announcement.type as keyof typeof TYPE_COLORS]}>
                                                        {announcement.type.replace("_", " ")}
                                                    </Badge>
                                                    {announcement.targetHostels.length > 0 && (
                                                        <Badge variant="outline">
                                                            {announcement.targetHostels.join(", ")}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <h3 className="text-lg font-semibold mb-2">{announcement.title}</h3>
                                                <p className="text-gray-600 dark:text-gray-400 mb-3">
                                                    {announcement.content}
                                                </p>
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        {new Date(announcement.createdAt).toLocaleDateString()}
                                                    </span>
                                                    <span>By {announcement.author.name}</span>
                                                    <span className="flex items-center gap-1">
                                                        <MessageSquare className="h-4 w-4" />
                                                        {announcement._count.comments} comments
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </HoverCard>
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            )}
        </FadeIn>
    )
}
