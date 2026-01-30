import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ThumbsUp, Heart, Flame, Frown } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface IssueReactionsProps {
    issueId: string
    initialReactions?: {
        UPVOTE: number
        LIKE: number
        URGENT: number
        ME_TOO: number
    }
    userReaction?: string | null
}

export function IssueReactions({
    issueId,
    initialReactions = { UPVOTE: 0, LIKE: 0, URGENT: 0, ME_TOO: 0 },
    userReaction,
}: IssueReactionsProps) {
    const [reactions, setReactions] = useState(initialReactions)
    const [selectedReaction, setSelectedReaction] = useState<string | null>(userReaction || null)
    const [loading, setLoading] = useState(false)

    const reactionTypes = [
        { type: "UPVOTE", icon: ThumbsUp, label: "Upvote", color: "text-blue-500" },
        { type: "LIKE", icon: Heart, label: "Like", color: "text-red-500" },
        { type: "URGENT", icon: Flame, label: "Urgent", color: "text-orange-500" },
        { type: "ME_TOO", icon: Frown, label: "Me Too", color: "text-purple-500" },
    ]

    const handleReaction = async (type: string) => {
        if (loading) return

        setLoading(true)
        try {
            const response = await fetch(`/api/issues/${issueId}/react`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type }),
            })

            if (response.ok) {
                await response.json()

                // Update local state
                if (selectedReaction === type) {
                    // Remove reaction
                    setReactions((prev) => ({
                        ...prev,
                        [type]: Math.max(0, prev[type as keyof typeof prev] - 1),
                    }))
                    setSelectedReaction(null)
                    toast.success("Reaction removed")
                } else {
                    // Add or change reaction
                    setReactions((prev) => {
                        const newReactions = { ...prev }
                        if (selectedReaction) {
                            newReactions[selectedReaction as keyof typeof prev] = Math.max(
                                0,
                                newReactions[selectedReaction as keyof typeof prev] - 1
                            )
                        }
                        newReactions[type as keyof typeof prev] += 1
                        return newReactions
                    })
                    setSelectedReaction(type)
                    toast.success("Reaction added")
                }
            }
        } catch {
            toast.error("Failed to add reaction")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-wrap gap-2">
            {reactionTypes.map(({ type, icon: Icon, label, color }) => {
                const count = reactions[type as keyof typeof reactions]
                const isSelected = selectedReaction === type

                return (
                    <Button
                        key={type}
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleReaction(type)}
                        disabled={loading}
                        className={cn(
                            "gap-2",
                            isSelected && "border-2"
                        )}
                    >
                        <Icon className={cn("h-4 w-4", isSelected ? "text-white" : color)} />
                        <span>{label}</span>
                        {count > 0 && (
                            <span className={cn(
                                "ml-1 rounded-full px-2 py-0.5 text-xs font-semibold",
                                isSelected ? "bg-white text-primary" : "bg-muted"
                            )}>
                                {count}
                            </span>
                        )}
                    </Button>
                )
            })}
        </div>
    )
}
