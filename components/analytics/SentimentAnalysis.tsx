"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Smile, Meh, Frown, TrendingUp } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface SentimentData {
    overall: "positive" | "neutral" | "negative"
    score: number
    totalIssues: number
    sentimentBreakdown: {
        positive: number
        neutral: number
        negative: number
    }
    topConcerns: string[]
}

export function SentimentAnalysis() {
    const [sentiment, setSentiment] = useState<SentimentData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchSentiment()
    }, [])

    const fetchSentiment = async () => {
        try {
            const response = await fetch("/api/analytics/sentiment")
            if (response.ok) {
                const data = await response.json()
                setSentiment(data)
            }
        } catch (error) {
            console.error("Failed to fetch sentiment:", error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <Card className="p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="h-20 bg-muted rounded" />
                </div>
            </Card>
        )
    }

    if (!sentiment) return null

    const getSentimentIcon = () => {
        switch (sentiment.overall) {
            case "positive":
                return <Smile className="h-8 w-8 text-green-500" />
            case "neutral":
                return <Meh className="h-8 w-8 text-yellow-500" />
            case "negative":
                return <Frown className="h-8 w-8 text-red-500" />
        }
    }

    const getSentimentColor = () => {
        switch (sentiment.overall) {
            case "positive":
                return "text-green-600"
            case "neutral":
                return "text-yellow-600"
            case "negative":
                return "text-red-600"
        }
    }

    return (
        <Card className="p-6">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold">Hostel Sentiment</h3>
                        <p className="text-sm text-muted-foreground">
                            Based on {sentiment.totalIssues} recent issues
                        </p>
                    </div>
                    {getSentimentIcon()}
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                            <Smile className="h-4 w-4 text-green-500" />
                            Positive
                        </span>
                        <span className="font-medium">{sentiment.sentimentBreakdown.positive}%</span>
                    </div>
                    <Progress value={sentiment.sentimentBreakdown.positive} className="h-2" />

                    <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                            <Meh className="h-4 w-4 text-yellow-500" />
                            Neutral
                        </span>
                        <span className="font-medium">{sentiment.sentimentBreakdown.neutral}%</span>
                    </div>
                    <Progress value={sentiment.sentimentBreakdown.neutral} className="h-2" />

                    <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                            <Frown className="h-4 w-4 text-red-500" />
                            Negative
                        </span>
                        <span className="font-medium">{sentiment.sentimentBreakdown.negative}%</span>
                    </div>
                    <Progress value={sentiment.sentimentBreakdown.negative} className="h-2" />
                </div>

                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <h4 className="text-sm font-semibold">Top Concerns</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {sentiment.topConcerns.map((concern, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium"
                            >
                                {concern}
                            </span>
                        ))}
                    </div>
                </div>

                <div className={`text-center text-sm font-medium ${getSentimentColor()}`}>
                    Overall Mood: {sentiment.overall.charAt(0).toUpperCase() + sentiment.overall.slice(1)}
                </div>
            </div>
        </Card>
    )
}
