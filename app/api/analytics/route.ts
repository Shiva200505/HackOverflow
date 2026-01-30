import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export const dynamic = 'force-dynamic';

import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const session = await auth()

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Only management can access analytics
        if (session.user.role !== "MANAGEMENT") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        // Get total counts
        const totalIssues = await prisma.issue.count()
        const totalAnnouncements = await prisma.announcement.count()
        const totalLostFound = await prisma.lostFound.count()
        const totalUsers = await prisma.user.count()

        // Issues by status
        const issuesByStatus = await prisma.issue.groupBy({
            by: ["status"],
            _count: { status: true },
        })

        // Issues by category
        const issuesByCategory = await prisma.issue.groupBy({
            by: ["category"],
            _count: { category: true },
        })

        // Issues by priority
        const issuesByPriority = await prisma.issue.groupBy({
            by: ["priority"],
            _count: { priority: true },
        })

        // Issues by hostel
        const issuesByHostel = await prisma.issue.groupBy({
            by: ["hostel"],
            _count: { hostel: true },
        })

        // Calculate average resolution time (for resolved/closed issues)
        const resolvedIssues = await prisma.issue.findMany({
            where: {
                status: { in: ["RESOLVED", "CLOSED"] },
                resolvedAt: { not: null },
            },
            select: {
                reportedAt: true,
                resolvedAt: true,
            },
        })

        let avgResolutionTime = 0
        if (resolvedIssues.length > 0) {
            const totalTime = resolvedIssues.reduce((acc, issue) => {
                if (issue.resolvedAt) {
                    return acc + (new Date(issue.resolvedAt).getTime() - new Date(issue.reportedAt).getTime())
                }
                return acc
            }, 0)
            avgResolutionTime = totalTime / resolvedIssues.length / (1000 * 60 * 60) // in hours
        }

        // Calculate average response time (time to assign)
        const assignedIssues = await prisma.issue.findMany({
            where: {
                assignedAt: { not: null },
            },
            select: {
                reportedAt: true,
                assignedAt: true,
            },
        })

        let avgResponseTime = 0
        if (assignedIssues.length > 0) {
            const totalTime = assignedIssues.reduce((acc, issue) => {
                if (issue.assignedAt) {
                    return acc + (new Date(issue.assignedAt).getTime() - new Date(issue.reportedAt).getTime())
                }
                return acc
            }, 0)
            avgResponseTime = totalTime / assignedIssues.length / (1000 * 60 * 60) // in hours
        }

        // Recent issues (last 7 days)
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        const recentIssues = await prisma.issue.count({
            where: {
                createdAt: { gte: sevenDaysAgo },
            },
        })

        // Pending issues (REPORTED, ASSIGNED, IN_PROGRESS)
        const pendingIssues = await prisma.issue.count({
            where: {
                status: { in: ["REPORTED", "ASSIGNED", "IN_PROGRESS"] },
            },
        })

        // Resolved issues
        const resolvedCount = await prisma.issue.count({
            where: {
                status: { in: ["RESOLVED", "CLOSED"] },
            },
        })

        return NextResponse.json({
            overview: {
                totalIssues,
                totalAnnouncements,
                totalLostFound,
                totalUsers,
                pendingIssues,
                resolvedIssues: resolvedCount,
                recentIssues,
                avgResponseTime: Math.round(avgResponseTime * 10) / 10,
                avgResolutionTime: Math.round(avgResolutionTime * 10) / 10,
            },
            charts: {
                issuesByStatus: issuesByStatus.map(item => ({
                    name: item.status.replace("_", " "),
                    value: item._count.status,
                })),
                issuesByCategory: issuesByCategory.map(item => ({
                    name: item.category,
                    value: item._count.category,
                })),
                issuesByPriority: issuesByPriority.map(item => ({
                    name: item.priority,
                    value: item._count.priority,
                })),
                issuesByHostel: issuesByHostel.map(item => ({
                    name: item.hostel,
                    value: item._count.hostel,
                })),
            },
        })
    } catch (error) {
        console.error("Analytics fetch error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
