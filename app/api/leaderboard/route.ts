import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic';


export async function GET() {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Get all users with their issue counts
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                issues: {
                    select: {
                        id: true,
                        status: true,
                    },
                },
                comments: {
                    select: {
                        id: true,
                    },
                },
            },
        })

        // Calculate points and rankings
        const leaderboardData = users.map((user) => {
            const issuesReported = user.issues.length
            const issuesResolved = user.issues.filter(
                (issue) => issue.status === "RESOLVED" || issue.status === "CLOSED"
            ).length
            const commentsCount = user.comments.length

            // Points calculation
            const points =
                issuesReported * 10 + // 10 points per issue reported
                issuesResolved * 15 + // 15 points per issue resolved
                commentsCount * 5 // 5 points per comment

            // Determine badges
            const badges: string[] = []
            if (issuesReported >= 10) badges.push("First Reporter")
            if (issuesResolved >= 5) badges.push("Problem Solver")
            if (commentsCount >= 10) badges.push("Helpful Neighbor")

            return {
                id: user.id,
                name: user.name,
                points,
                badges,
                issuesReported,
                issuesResolved,
            }
        })

        // Sort by points and add rank
        const sortedUsers = leaderboardData
            .sort((a, b) => b.points - a.points)
            .map((user, index) => ({
                ...user,
                rank: index + 1,
            }))
            .slice(0, 10) // Top 10 users

        return NextResponse.json({ users: sortedUsers })
    } catch (error) {
        console.error("Leaderboard error:", error)
        return NextResponse.json(
            { error: "Failed to fetch leaderboard" },
            { status: 500 }
        )
    }
}
