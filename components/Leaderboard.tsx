"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award, Star, TrendingUp } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface LeaderboardUser {
    id: string
    name: string
    points: number
    rank: number
    badges: string[]
    issuesReported: number
    issuesResolved: number
}

export function Leaderboard() {
    const [users, setUsers] = useState<LeaderboardUser[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchLeaderboard()
    }, [])

    const fetchLeaderboard = async () => {
        try {
            const response = await fetch("/api/leaderboard")
            if (response.ok) {
                const data = await response.json()
                setUsers(data.users)
            }
        } catch (error) {
            console.error("Failed to fetch leaderboard:", error)
        } finally {
            setLoading(false)
        }
    }

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return <Trophy className="h-6 w-6 text-yellow-500" />
            case 2:
                return <Medal className="h-6 w-6 text-gray-400" />
            case 3:
                return <Medal className="h-6 w-6 text-orange-600" />
            default:
                return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
        }
    }

    const getBadgeIcon = (badge: string) => {
        const icons: Record<string, typeof Trophy> = {
            "First Reporter": Star,
            "Problem Solver": Award,
            "Helpful Neighbor": TrendingUp,
        }
        const Icon = icons[badge] || Award
        return <Icon className="h-4 w-4" />
    }

    if (loading) {
        return (
            <Card className="p-6">
                <div className="animate-pulse space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-16 bg-muted rounded" />
                    ))}
                </div>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">🏆 Leaderboard</h2>
                    <p className="text-sm text-muted-foreground">Top contributors this month</p>
                </div>
            </div>

            <div className="grid gap-4">
                {users.map((user) => (
                    <Card
                        key={user.id}
                        className={`p-4 transition-all hover:shadow-lg ${user.rank <= 3 ? "border-2 border-primary" : ""
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            {/* Rank */}
                            <div className="flex-shrink-0 w-12 flex items-center justify-center">
                                {getRankIcon(user.rank)}
                            </div>

                            {/* Avatar */}
                            <Avatar className="h-12 w-12">
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                    {user.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>

                            {/* User Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold truncate">{user.name}</h3>
                                    {user.rank === 1 && (
                                        <Badge variant="default" className="bg-yellow-500">
                                            👑 Top Contributor
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                    <span>📝 {user.issuesReported} reported</span>
                                    <span>✅ {user.issuesResolved} resolved</span>
                                </div>
                                {user.badges.length > 0 && (
                                    <div className="flex gap-1 mt-2">
                                        {user.badges.map((badge) => (
                                            <Badge
                                                key={badge}
                                                variant="outline"
                                                className="text-xs flex items-center gap-1"
                                            >
                                                {getBadgeIcon(badge)}
                                                {badge}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Points */}
                            <div className="text-right">
                                <div className="text-2xl font-bold text-primary">{user.points}</div>
                                <div className="text-xs text-muted-foreground">points</div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Points Legend */}
            <Card className="p-4 bg-muted/50">
                <h3 className="font-semibold mb-2">How to Earn Points</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>✅ Report valid issue: <strong>+10 pts</strong></div>
                    <div>💬 Helpful comment: <strong>+5 pts</strong></div>
                    <div>🔍 Find lost item: <strong>+20 pts</strong></div>
                    <div>⭐ Issue resolved: <strong>+15 pts</strong></div>
                </div>
            </Card>
        </div>
    )
}
