import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export const dynamic = 'force-dynamic';

import { prisma } from "@/lib/prisma"

export async function GET() {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Get recent issues for sentiment analysis
        const issues = await prisma.issue.findMany({
            where: {
                createdAt: {
                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
                },
            },
            select: {
                title: true,
                description: true,
                priority: true,
                category: true,
            },
        })

        // Simple sentiment analysis based on keywords
        const negativeKeywords = ["broken", "not working", "urgent", "emergency", "bad", "terrible", "worst", "issue", "problem"]
        const positiveKeywords = ["fixed", "resolved", "good", "great", "excellent", "working", "clean"]

        let positive = 0
        let negative = 0
        let neutral = 0

        const categoryCounts: Record<string, number> = {}

        issues.forEach((issue) => {
            const text = `${issue.title} ${issue.description}`.toLowerCase()

            // Count category occurrences
            categoryCounts[issue.category] = (categoryCounts[issue.category] || 0) + 1

            // Sentiment scoring
            const negScore = negativeKeywords.filter((word) => text.includes(word)).length
            const posScore = positiveKeywords.filter((word) => text.includes(word)).length

            if (posScore > negScore) {
                positive++
            } else if (negScore > posScore) {
                negative++
            } else {
                neutral++
            }
        })

        const total = issues.length || 1

        // Determine overall sentiment
        const positivePercent = (positive / total) * 100
        const negativePercent = (negative / total) * 100

        let overall: "positive" | "neutral" | "negative" = "neutral"
        if (positivePercent > 50) overall = "positive"
        else if (negativePercent > 50) overall = "negative"

        // Top concerns (top 5 categories)
        const topConcerns = Object.entries(categoryCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([category]) => category)

        return NextResponse.json({
            overall,
            score: Math.round(positivePercent),
            totalIssues: total,
            sentimentBreakdown: {
                positive: Math.round((positive / total) * 100),
                neutral: Math.round((neutral / total) * 100),
                negative: Math.round((negative / total) * 100),
            },
            topConcerns,
        })
    } catch (error) {
        console.error("Sentiment analysis error:", error)
        return NextResponse.json(
            { error: "Failed to analyze sentiment" },
            { status: 500 }
        )
    }
}
